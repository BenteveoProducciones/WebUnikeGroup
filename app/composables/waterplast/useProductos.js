export const useWaterplastProductos = () => {
    const supabase = useSupabaseClient()
    const config = useRuntimeConfig()

    const loading = ref(false)
    const productos = ref([])
    const currentProducto = ref(null)
    const error = ref(null)

    const getProductoImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        return `${config.public.supabase.url}/storage/v1/object/public/waterplast-productos/${imagePath}`
    }

    const fetchProductos = async () => {
        loading.value = true
        error.value = null

        try {
            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos')
                .select(`
                    *,
                    categoria:categoria_id (
                        id,
                        nombre,
                        slug
                    )
                `)
                .eq('estado', true)
                .order('created_at', { ascending: true })

            if (supabaseError) throw supabaseError

            const productosWithUrls = (data || []).map(producto => ({
                ...producto,
                imagen_principal: producto.imagen_principal ? getProductoImageUrl(producto.imagen_principal) : null,
                imagen_ficha_tecnica: producto.imagen_ficha_tecnica ? getProductoImageUrl(producto.imagen_ficha_tecnica) : null,
                imagenes_galeria: producto.imagenes_galeria ?
                    producto.imagenes_galeria.map((img, index) => ({
                        id: `galeria-${index}`,
                        name: `imagen-galeria-${index + 1}.jpg`,
                        url: getProductoImageUrl(img)
                    })) : [],
                imagenes_galeria_count: producto.imagenes_galeria ? producto.imagenes_galeria.length : 0
            }))

            productos.value = productosWithUrls
        } catch (err) {
            error.value = err.message
            console.error('Error al obtener productos:', err)
        } finally {
            loading.value = false
        }
    }

    const fetchProductosByCategoria = async (categoriaSlug) => {
        loading.value = true
        error.value = null

        try {
            const { data: categoriaData, error: categoriaError } = await supabase
                .from('waterplast-categorias')
                .select('id')
                .eq('slug', categoriaSlug)
                .single()

            if (categoriaError) throw categoriaError

            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos')
                .select(`
                    *,
                    categoria:categoria_id (
                        id,
                        nombre,
                        slug,
                        color
                    ),
                    subcategoria:subcategoria_id (
                        id,
                        nombre,
                        orden
                    )
                `)
                .eq('estado', true)
                .eq('categoria_id', categoriaData.id)
                .order('created_at', { ascending: true })

            if (supabaseError) throw supabaseError

            const productosWithUrls = (data || []).map(producto => ({
                ...producto,
                imagen: producto.imagen ? getProductoImageUrl(producto.imagen) : null,
                imagen_principal: producto.imagen_principal ? getProductoImageUrl(producto.imagen_principal) : (producto.imagen ? getProductoImageUrl(producto.imagen) : null),
                imagen_ficha_tecnica: producto.imagen_ficha_tecnica ? getProductoImageUrl(producto.imagen_ficha_tecnica) : null,
                icono1: producto.icono1 ? getProductoImageUrl(producto.icono1) : null,
                icono2: producto.icono2 ? getProductoImageUrl(producto.icono2) : null,
                icono3: producto.icono3 ? getProductoImageUrl(producto.icono3) : null,
                imagenes_galeria: producto.imagenes_galeria ?
                    producto.imagenes_galeria.map((img, index) => ({
                        id: `galeria-${index}`,
                        name: `imagen-galeria-${index + 1}.jpg`,
                        url: getProductoImageUrl(img)
                    })) : [],
                imagenes_galeria_count: producto.imagenes_galeria ? producto.imagenes_galeria.length : 0
            }))

            productos.value = productosWithUrls
            return productosWithUrls
        } catch (err) {
            error.value = err.message
            console.error('Error al obtener productos por categoría:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchProductoBySlug = async (slug) => {
        loading.value = true
        error.value = null
        currentProducto.value = null

        try {
            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos')
                .select(`
                    *,
                    categoria:categoria_id (
                        id,
                        nombre,
                        slug
                    )
                `)
                .eq('slug', slug)
                .single()

            if (supabaseError) throw supabaseError

            const productoWithUrls = {
                ...data,
                imagen_principal: data.imagen_principal ? getProductoImageUrl(data.imagen_principal) : null,
                imagen_ficha_tecnica: data.imagen_ficha_tecnica ? getProductoImageUrl(data.imagen_ficha_tecnica) : null,
                imagenes_galeria: data.imagenes_galeria ?
                    data.imagenes_galeria.map((img, index) => ({
                        id: `galeria-${index}`,
                        name: `imagen-galeria-${index + 1}.jpg`,
                        url: getProductoImageUrl(img)
                    })) : []
            }

            currentProducto.value = productoWithUrls
            return productoWithUrls
        } catch (err) {
            error.value = err.message
            console.error('Error al obtener producto:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchProductoByCategoriaAndSlug = async (categoriaSlug, productoSlug) => {
        loading.value = true
        error.value = null
        currentProducto.value = null

        try {
            const { data: categoriaData, error: categoriaError } = await supabase
                .from('waterplast-categorias')
                .select('id')
                .eq('slug', categoriaSlug)
                .single()

            if (categoriaError) throw categoriaError

            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos')
                .select('*')
                .eq('slug', productoSlug)
                .eq('categoria_id', categoriaData.id)
                .single()

            if (supabaseError) throw supabaseError

            const productoWithUrls = {
                ...data,
                imagen_principal: data.imagen_principal ? getProductoImageUrl(data.imagen_principal) : null,
                imagen_ficha_tecnica: data.imagen_ficha_tecnica ? getProductoImageUrl(data.imagen_ficha_tecnica) : null,
                imagenes_galeria: data.imagenes_galeria ?
                    data.imagenes_galeria.map((img, index) => ({
                        id: `galeria-${index}`,
                        name: `imagen-galeria-${index + 1}.jpg`,
                        url: getProductoImageUrl(img)
                    })) : []
            }

            currentProducto.value = productoWithUrls
            return productoWithUrls
        } catch (err) {
            error.value = err.message
            console.error('Error al obtener producto por categoría y slug:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const generateCleanName = (nombre) => {
        if (!nombre) return ''

        return nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
            .substring(0, 20)
            .replace(/-$/, '')
    }

    const fetchProducto3DFromSupabase = async (productoId) => {
        try {
            const { data, error } = await supabase
                .from('waterplast-productos')
                .select('archivo_html, nombre, xr_images_folder')
                .eq('id', productoId)
                .single()

            if (error) throw error

            if (data && data.archivo_html) {
                const htmlResponse = await $fetch(data.archivo_html)

                const imagesFolder = data.xr_images_folder || null
                const processedHTML = await processKeyShotXRHTML(htmlResponse, data.nombre, imagesFolder)

                return {
                    ...data,
                    processed_html: processedHTML,
                    clean_name: generateCleanName(data.nombre)
                }
            }

            return data
        } catch (error) {
            console.error('Error fetching 3D product from Supabase:', error)
            throw error
        }
    }

    const getImageBaseUrl = (cleanName, imagesFolder = null) => {
        const baseUrl = `${config.public.supabase.url}/storage/v1/object/public/waterplast-productos/${cleanName}/images`

        if (imagesFolder) {
            return `${baseUrl}/${imagesFolder}`
        }

        return baseUrl
    }

    const processKeyShotXRHTML = async (html, productoNombre, imagesFolder = null, cleanNameOverride = null, ext = 'png') => {
        if (!html) return ''

        let processedHTML = html
        const cleanName = cleanNameOverride || generateCleanName(productoNombre)

        const baseUrl = import.meta.client ? window.location.origin : (config.public.siteUrl || 'https://unikegroup.com.ar')

        let keyshotContent
        try {
            keyshotContent = await $fetch(`${baseUrl}/lib/keyshot-xr.js`, {
                responseType: 'text',
                headers: {
                    'Accept': 'application/javascript, text/javascript, */*'
                }
            })
        } catch (fetchError) {
            console.error('Error fetching keyshot-xr.js from:', `${baseUrl}/lib/keyshot-xr.js`, fetchError)
            try {
                keyshotContent = await $fetch('/lib/keyshot-xr.js', {
                    responseType: 'text'
                })
            } catch (fallbackError) {
                console.error('Error fetching keyshot-xr.js with relative path:', fallbackError)
                throw new Error('No se pudo cargar el visor 3D')
            }
        }

        const imageBaseUrl = getImageBaseUrl(cleanName, imagesFolder)

        let modified = false

        const vaPattern = /this\.va=function\(b,f\)\{return A\+a\.s\+[^}]+\}/
        const vaMatch = keyshotContent.match(vaPattern)

        if (vaMatch) {
            keyshotContent = keyshotContent.replace(
                vaPattern,
                `this.va=function(b,f){return "${imageBaseUrl}/"+parseInt(f)+"_"+parseInt(b)+".${ext}"}`
            )
            modified = true
        }

        if (!modified) {
            if (keyshotContent.includes('parseInt(f)+"_"+parseInt(b)')) {
                keyshotContent = keyshotContent.replace(
                    /return [^;]+parseInt\(f\)\+["']_["']\+parseInt\(b\)[^;]+/g,
                    `return "${imageBaseUrl}/"+parseInt(f)+"_"+parseInt(b)+".${ext}"`
                )
                modified = true
            }
        }

        keyshotContent = keyshotContent.replace(
            /A\+a\.s\+["']\/files\/["']\+d/g,
            `"${imageBaseUrl}/files/"+d`
        )

        keyshotContent = keyshotContent.replace(
            /ca&&a\.ua\(\)/g,
            'false'
        )

        keyshotContent = keyshotContent.replace(
            /this\.ua=function\(\)\{[^}]+a\.p=document\.createElement[^}]+\};/g,
            'this.ua=function(){};'
        )

        processedHTML = processedHTML.replace(
            /<script\s+type="text\/javascript"\s+src="[^"]*KeyShotXR\.js"><\/script>/gi,
            `<script type="text/javascript">${keyshotContent}</script>`
        )

        processedHTML = processedHTML.replace(
            /<script[^>]*src="[^"]*KeyShotXR\.js"[^>]*><\/script>/gi,
            `<script type="text/javascript">${keyshotContent}</script>`
        )

        processedHTML = processedHTML.replace(
            /var\s+folderName\s*=\s*["']([^"']*)["']/g,
            'var folderName = ""'
        )

        processedHTML = processedHTML.replace(
            /A\+a\.s\+["']\/files\/["']/g,
            `"${imageBaseUrl}/files/"`
        )

        processedHTML = processedHTML.replace(
            /src=["']files\//g,
            `src="${imageBaseUrl}/files/`
        )

        processedHTML = processedHTML.replace(
            /<div([^>]*?)id=["']?xr-container["']?([^>]*?)>/g,
            '<div$1id="xr-container"$2 style="width: 100%; height: 100%; position: relative;">'
        )

        processedHTML = processedHTML.replace(
            /<body([^>]*)>/gi,
            '<body$1 style="background-color: transparent;">'
        )

        processedHTML = processedHTML.replace(
            /this\.backgroundColor=s\.style\.backgroundColor=[^;]+;/g,
            'this.backgroundColor=s.style.backgroundColor="transparent";'
        )

        return processedHTML
    }

    const injectXRViewer = (containerId, html) => {
        if (import.meta.client) {
            const container = document.getElementById(containerId)
            if (container && html) {
                container.innerHTML = html

                const scripts = container.querySelectorAll('script')
                scripts.forEach(script => {
                    const newScript = document.createElement('script')

                    if (script.src) {
                        newScript.src = script.src
                    } else {
                        newScript.textContent = script.textContent
                    }

                    if (script.type) {
                        newScript.type = script.type
                    }

                    document.head.appendChild(newScript)

                    setTimeout(() => {
                        if (newScript.parentNode) {
                            newScript.parentNode.removeChild(newScript)
                        }
                    }, 100)
                })
            }
        }
    }

    const renderXRViewer = async (containerId, productoSlug) => {
        try {
            const producto = await fetchProductoBySlug(productoSlug)

            if (producto && producto.xr_html_content) {
                const processedHTML = processKeyShotXRHTML(producto.xr_html_content, producto.nombre)
                injectXRViewer(containerId, processedHTML)
                return true
            }
            return false
        } catch (err) {
            console.error('Error rendering XR viewer:', err)
            return false
        }
    }

    const processProductoHTML = async (producto) => {
        if (!producto || !producto.archivo_html) return null

        try {
            let htmlUrl = producto.archivo_html
            if (!htmlUrl.startsWith('http')) {
                htmlUrl = `${config.public.supabase.url}/storage/v1/object/public/waterplast-productos/${htmlUrl}`
            }

            const htmlResponse = await $fetch(htmlUrl)

            const imagesFolder = producto.xr_images_folder || null

            let folderName = null
            if (producto.archivo_html && producto.archivo_html.includes('/')) {
                folderName = producto.archivo_html.split('/')[0]
            }

            const cleanName = folderName || generateCleanName(producto.nombre)

            const processedHTML = await processKeyShotXRHTML(htmlResponse, producto.nombre, imagesFolder, cleanName, producto.xr_webp ? 'webp' : 'png')

            return {
                ...producto,
                processed_html: processedHTML,
                clean_name: cleanName,
                xr_images_folder: imagesFolder
            }
        } catch (error) {
            console.error('Error processing producto HTML:', error)
            return null
        }
    }

    const getCaracteristicaImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        const baseUrl = config.public.bucketUrl || `${config.public.supabase?.url}/storage/v1/object/public`
        return `${baseUrl}/waterplast-productos-caracteristicas/${imagePath}`
    }

    const fetchProductosRelacionados = async (productosRelacionadosIds) => {
        if (!productosRelacionadosIds || productosRelacionadosIds.length === 0) {
            return []
        }

        try {
            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos')
                .select(`
                    *,
                    categoria:categoria_id (
                        id,
                        nombre,
                        slug,
                        color
                    )
                `)
                .in('id', productosRelacionadosIds)
                .eq('estado', true)

            if (supabaseError) throw supabaseError

            const productosWithUrls = (data || []).map(producto => ({
                ...producto,
                imagen_principal: producto.imagen_principal ? getProductoImageUrl(producto.imagen_principal) : null,
                icono1: producto.icono1 ? getProductoImageUrl(producto.icono1) : null,
                icono2: producto.icono2 ? getProductoImageUrl(producto.icono2) : null,
                icono3: producto.icono3 ? getProductoImageUrl(producto.icono3) : null,
            }))

            return productosWithUrls
        } catch (err) {
            console.error('Error al obtener productos relacionados:', err)
            return []
        }
    }

    const fetchCaracteristicasAdicionales = async (productoId) => {
        if (!productoId) return []

        try {
            const { data, error: supabaseError } = await supabase
                .from('waterplast-productos-caracteristicas-adicionales')
                .select('*')
                .eq('producto_id', productoId)
                .order('orden', { ascending: true })

            if (supabaseError) throw supabaseError

            const caracteristicasWithUrls = (data || []).map(caracteristica => ({
                ...caracteristica,
                imagen: caracteristica.imagen ? getCaracteristicaImageUrl(caracteristica.imagen) : null
            }))

            return caracteristicasWithUrls
        } catch (err) {
            console.error('Error al obtener características adicionales:', err)
            return []
        }
    }

    const fetchImagenesRedes = (imagenesRedesPaths) => {
        if (!imagenesRedesPaths || imagenesRedesPaths.length === 0) return []

        const supabaseUrl = config.public.supabase?.url || config.public.bucketUrl?.replace('/storage/v1/object/public', '')

        return imagenesRedesPaths
            .filter(path => {
                const ext = path.split('.').pop().toLowerCase()
                return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
            })
            .map(path => ({
                name: path.split('/').pop(),
                url: `${supabaseUrl}/storage/v1/object/public/waterplast-categorias/${path}`
            }))
    }

    return {
        productos: readonly(productos),
        currentProducto: readonly(currentProducto),
        loading: readonly(loading),
        error: readonly(error),
        fetchProductos,
        fetchProductosByCategoria,
        fetchProductoBySlug,
        fetchProductoByCategoriaAndSlug,
        getProductoImageUrl,
        getCaracteristicaImageUrl,
        generateCleanName,
        fetchProducto3DFromSupabase,
        processKeyShotXRHTML,
        processProductoHTML,
        injectXRViewer,
        renderXRViewer,
        fetchProductosRelacionados,
        fetchCaracteristicasAdicionales,
        fetchImagenesRedes
    }
}