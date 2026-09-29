// Convierte los frames PNG del visor 360 a WebP (al lado de los PNG, no borra nada)
// y marca xr_webp = true en cada producto terminado sin errores.
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/frames-to-webp.mjs
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const BUCKET = 'waterplast-productos'
const CONCURRENCY = 8

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const listRecursive = async (prefix) => {
  const files = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, offset })
    if (error) throw error
    for (const item of data) {
      const path = `${prefix}/${item.name}`
      if (item.id === null) files.push(...(await listRecursive(path)))
      else files.push(path)
    }
    if (data.length < 1000) break
  }
  return files
}

const convert = async (pngPath) => {
  const { data, error } = await supabase.storage.from(BUCKET).download(pngPath)
  if (error) throw error
  const webp = await sharp(Buffer.from(await data.arrayBuffer())).webp({ quality: 80 }).toBuffer()
  const { error: upError } = await supabase.storage
    .from(BUCKET)
    .upload(pngPath.replace(/\.png$/, '.webp'), webp, { contentType: 'image/webp', cacheControl: '31536000', upsert: true })
  if (upError) throw upError
}

const { data: productos, error } = await supabase
  .from(BUCKET)
  .select('id, slug, archivo_html')
  .eq('estado', true)
  .eq('xr_webp', false)
  .not('archivo_html', 'is', null)
if (error) throw error

for (const producto of productos) {
  const folder = producto.archivo_html.split('/')[0]
  const files = await listRecursive(`${folder}/images`)
  const existing = new Set(files.filter(f => f.endsWith('.webp')))
  const pending = files.filter(f => f.endsWith('.png') && !existing.has(f.replace(/\.png$/, '.webp')))

  let failed = 0
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const results = await Promise.allSettled(pending.slice(i, i + CONCURRENCY).map(convert))
    failed += results.filter(r => r.status === 'rejected').length
  }

  if (failed === 0 && files.some(f => f.endsWith('.png'))) {
    await supabase.from(BUCKET).update({ xr_webp: true }).eq('id', producto.id)
  }
  console.log(`${producto.slug}: ${pending.length} convertidos, ${failed} errores`)
}
