<template>
  <DefaultMain>
    <span class="hero-gradient md:w-full md:h-[11.5rem] lg:h-[16.5rem] hidden md:block md:absolute md:top-0"
      :style="`--categoria-color: ${categoriaColor}`"></span>
    <DefaultSection class="py-6 px-4 md:p-16 md:pb-8 lg:pt-44 lg:pb-12 lg:px-16 xxl:py-32">
      <div class="w-full xxl:max-w-[1304px] flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 xxl:gap-16">
        <ProductoModelo v-if="isDesktop" class="hidden lg:block xxl:w-[40%]" />
        <div class="lg:w-1/2 xxl:w-[60%] flex flex-col gap-6 xxl:gap-8">
          <div class="flex flex-col md:flex-row-reverse gap-6">
            <div class="md:w-1/2 lg:w-full flex flex-col md:justify-center gap-3 md:gap-4 lg:gap-6 xxl:gap-8">
              <div class="flex flex-col gap-1 lg:gap-3">
                <HeadingH1 class="text-terciary">{{ producto?.nombre || route.params.producto }}</HeadingH1>
                <p v-if="producto?.capacidad_lts" class="lg:text-[1.75rem] text-terciary font-semibold">{{ producto?.capacidad_lts
                  }} lts</p>
              </div>
              <p class="text-sm lg:text-md text-terciary font-medium whitespace-pre-line">{{ producto?.descripcion }}
              </p>
              <WaterplastProductoBotones v-if="producto" :producto="producto" class="hidden md:flex lg:hidden" />
            </div>
            <ProductoModelo v-if="!isDesktop" class="lg:hidden" />
          </div>

          <div class="flex flex-col gap-6 xxl:gap-8">
            <div>
              <div v-if="productosRelacionados.length > 1" class="grid grid-cols-4 items-end">
                <NuxtLink v-for="(relacionado, index) in productosRelacionados" :key="relacionado.id"
                  :to="`${ROUTES_NAMES.WATERPLAST.HOME}/${relacionado.categoria?.slug}/${relacionado.slug}`"
                  :aria-label="`Ver producto {{ relacionado.nombre }}`" :style="getRelacionadoStyle(relacionado, index)"
                  :class="getRelacionadoBorderClass(relacionado, index)"
                  class="flex justify-center md:justify-start items-center py-3 px-4 lg:px-6">
                  <p class="max-w-36 text-center text-xs lg:text-sm font-bold text-terciary">{{
                    relacionado.capacidad_lts ? `${relacionado.capacidad_lts} lts` : relacionado.nombre
                  }}</p>
                </NuxtLink>
              </div>
            </div>
            <div>
              <div v-if="producto && hasEspecificaciones"
                class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xxl:grid-cols-5 gap-4 lg:gap-6">
                <!-- Dimensiones -->
                <div v-if="[producto.altura_cm, producto.ancho_cm, producto.largo_cm].filter(Boolean).length >= 2"
                  class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg src="/images/waterplast/producto/dimensiones.svg" alt="Dimensiones"
                      class="w-10 h-10 object-contain" loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">Dimensiones {{
                    [producto.altura_cm, producto.ancho_cm, producto.largo_cm].filter(Boolean).join('cm x') }}cm</p>
                </div>

                <!-- Capacidad -->
                <div v-if="producto.capacidad_lts" class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg src="/images/waterplast/producto/capacidad.svg" alt="Capacidad"
                      class="w-10 h-10 object-contain" loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">
                    Capacidad {{ producto.capacidad_lts }} lts
                  </p>
                </div>

                <!-- Orientación -->
                <div v-if="producto.orientacion" class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg :src="getOrientacionIcon(producto.orientacion)" alt="Orientación"
                      class="w-10 h-10 object-contain" loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">
                    Orientación {{ producto.orientacion }}
                  </p>
                </div>

                <!-- Color -->
                <div v-if="producto.color" class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg src="/images/waterplast/producto/color.svg" alt="Color" class="w-10 h-10 object-contain"
                      loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">
                    Color {{ producto.color }}
                  </p>
                </div>

                <!-- Tecnología -->
                <div v-if="producto.tecnologia" class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg :src="getTecnologiaIcon(producto.tecnologia)" alt="Tecnología"
                      class="w-10 h-10 object-contain" loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">
                    Tecnología {{ producto.tecnologia }}
                  </p>
                </div>

                <!-- Opción -->
                <div v-if="producto.opcion" class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg :src="getOpcionIcon(producto.opcion)" alt="Opción" class="w-10 h-10 object-contain"
                      loading="lazy" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">
                    {{ formatOpcion(producto.opcion) }}
                  </p>
                </div>
                <div v-for="caracteristica in caracteristicasAdicionales" :key="caracteristica.id"
                  class="flex flex-col items-center gap-3 md:gap-4">
                  <div class="w-16 h-16 flex justify-center items-center rounded-full"
                    :style="{ backgroundColor: categoriaColor }">
                    <NuxtImg v-if="caracteristica.imagen" :src="caracteristica.imagen" :alt="caracteristica.descripcion"
                      class="w-10 h-10 object-contain" loading="lazy"
                      @error="(e) => handleImageError(e, caracteristica)" />
                  </div>
                  <p class="text-xs lg:text-sm text-center font-medium text-terciary">{{ caracteristica.descripcion }}
                  </p>
                </div>
              </div>
            </div>
            <WaterplastProductoBotones v-if="producto" :producto="producto"
              class="lg:max-w-full flex md:hidden lg:flex lg:flex-row" />
          </div>
        </div>
      </div>
    </DefaultSection>
    <Opiniones />
    <DefaultSection v-if="imagenesRedes.length > 0"
      class="hidden w-full flex-col items-center gap-3 md:gap-6 xxl:gap-8 py-6 lg:py-12 md:px-16">
      <HeadingH2 class="text-primary">Seguinos en nuestras redes</HeadingH2>
      <CarouselStatic :slides-per-view="{ base: 1.4, sm: 2.5, md: 3, lg: 3, xl: 4, xxl: 4 }">
        <NuxtLink v-for="imagen in imagenesRedes" :key="imagen.name" :to="ROUTES_NAMES.REDES.INSTAGRAM" target="_blank"
          rel="noopener noreferrer" :aria-label="`Seguir en Instagram - ${imagen.name}`">
          <NuxtImg :src="imagen.url" :alt="imagen.name" class="h-full rounded-3xl object-cover" />
        </NuxtLink>
      </CarouselStatic>
    </DefaultSection>
  </DefaultMain>
</template>

<script setup>
definePageMeta({ layout: 'waterplast' })

import { useWaterplastProductos } from '~/composables/waterplast/useProductos'
import { useWaterplastSeo } from '~/composables/useSeoMeta'
import { ROUTES_NAMES } from '~/constants/ROUTE_NAMES'

const route = useRoute()
// Un solo visor 360 montado: el iframe oculto con CSS igual descarga todos los frames
const isDesktop = ref(window.matchMedia('(min-width: 1080px)').matches)
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const {
  fetchProductosRelacionados,
  fetchCaracteristicasAdicionales,
  fetchImagenesRedes
} = useWaterplastProductos()

const { setSeoForProducto } = useWaterplastSeo()

const producto = ref(null)
const productosRelacionados = ref([])
const caracteristicasAdicionales = ref([])
const imagenesRedes = ref([])

const getProductoImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  const supabaseUrl = config.public.supabase?.url || config.public.bucketUrl?.replace('/storage/v1/object/public', '')
  return `${supabaseUrl}/storage/v1/object/public/waterplast-productos/${imagePath}`
}

const categoriaColor = computed(() => {
  return producto.value?.categoria?.color || '#FFFFFF'
})

const hasEspecificaciones = computed(() => {
  if (!producto.value) return false

  const dimensionesCount = [
    producto.value.altura_cm,
    producto.value.ancho_cm,
    producto.value.largo_cm
  ].filter(Boolean).length

  return !!(
    dimensionesCount >= 2 ||
    producto.value.capacidad_lts ||
    producto.value.orientacion ||
    producto.value.color ||
    producto.value.tecnologia ||
    producto.value.opcion
  )
})

const formatOpcion = (opcion) => {
  if (!opcion) return ''
  if (opcion === 'para_exteriores') return 'Para exteriores'
  if (opcion === 'es_cisterna') return 'Es cisterna'
  return opcion
}

const getOrientacionIcon = (orientacion) => {
  if (!orientacion) return '/images/waterplast/producto/dimensiones.svg'
  const normalizado = orientacion.toLowerCase()
  if (normalizado.includes('vertical')) return '/images/waterplast/producto/vertical.svg'
  if (normalizado.includes('horizontal')) return '/images/waterplast/producto/horizontal.svg'
  return '/images/waterplast/producto/dimensiones.svg'
}

const getTecnologiaIcon = (tecnologia) => {
  if (!tecnologia) return '/images/waterplast/producto/dimensiones.svg'
  const normalizado = tecnologia.toLowerCase()
  if (normalizado.includes('soplado')) return '/images/waterplast/producto/soplado.svg'
  if (normalizado.includes('rotomolde')) return '/images/waterplast/producto/rotomoldeado.svg'
  if (normalizado.includes('soldad')) return '/images/waterplast/producto/soldado.svg'
  if (normalizado.includes('inyeccion')) return '/images/waterplast/producto/inyeccion.svg'
  return '/images/waterplast/producto/dimensiones.svg'
}

const getOpcionIcon = (opcion) => {
  if (!opcion) return '/images/waterplast/producto/dimensiones.svg'
  const normalizado = opcion.toLowerCase()
  if (normalizado.includes('exterior')) return '/images/waterplast/producto/exterior.svg'
  if (normalizado.includes('cisterna')) return '/images/waterplast/producto/cisterna.svg'
  return '/images/waterplast/producto/dimensiones.svg'
}

const getRelacionadoStyle = (relacionado, index) => {
  const isSelected = relacionado.slug === route.params.producto
  const baseColor = producto.value?.categoria?.color || '#FFFFFF'

  if (isSelected) {
    return { backgroundColor: '#FFFFFF' }
  }

  const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 0.33)`
    }
    return hex
  }

  return { backgroundColor: hexToRgba(baseColor) }
}

const getRelacionadoBorderClass = (relacionado, index) => {
  const isSelected = relacionado.slug === route.params.producto
  const isFirst = index === 0
  const isFourth = index === 3
  const isFifth = index === 4
  const isLast = index === productosRelacionados.value.length - 1
  const hasFifth = productosRelacionados.value.length >= 5

  const classes = []

  if (isSelected) {
    classes.push('h-[62px]')
  } else {
    classes.push('h-[3.375rem]')
  }

  classes.push('border', 'border-gray-dark')

  if (index % 4 !== 0) {
    classes.push('-ml-[1px]')
  }

  if (index >= 4) {
    classes.push('-mt-[1px]')
  }

  if (isSelected) {
    classes.push('rounded-t-lg')
    if (isFirst && !hasFifth) {
      classes.push('rounded-bl-lg')
    }
  } else {
    if (isFirst && !hasFifth) {
      classes.push('rounded-tl-lg', 'rounded-bl-lg')
    } else if (isFirst) {
      classes.push('rounded-tl-lg')
    }

    if (isFourth) {
      classes.push('rounded-tr-lg', 'rounded-br-lg')
    }

    if (isFifth) {
      classes.push('rounded-bl-lg')
      if (isLast) {
        classes.push('rounded-br-lg')
      }
    }
  }

  return classes.join(' ')
}

const handleImageError = (event, caracteristica) => {
  console.error('Error loading image:')
  console.error('- URL:', event.target.src)
  console.error('- Característica:', caracteristica)
}

const fetchProducto = async () => {
  try {
    const { data, error } = await supabase
      .from('waterplast-productos')
      .select(`
        *,
        categoria:categoria_id (
          id,
          nombre,
          slug,
          color,
          imagenes_redes
        )
      `)
      .eq('slug', route.params.producto)
      .single()

    if (error) throw error

    const productoConUrls = {
      ...data,
      imagen_principal: data.imagen_principal ? getProductoImageUrl(data.imagen_principal) : null,
      imagen: data.imagen ? getProductoImageUrl(data.imagen) : null,
      imagen_ficha_tecnica: data.imagen_ficha_tecnica ? getProductoImageUrl(data.imagen_ficha_tecnica) : null
    }

    producto.value = productoConUrls

    if (productoConUrls) {
      setSeoForProducto(productoConUrls, productoConUrls.categoria)
    }

    if (data && data.productos_relacionados && data.productos_relacionados.length > 0) {
      try {
        const relacionados = await fetchProductosRelacionados(data.productos_relacionados)
        const todosLosProductos = [productoConUrls, ...relacionados]
        productosRelacionados.value = todosLosProductos.sort((a, b) => {
          const capacidadA = parseFloat(a.capacidad_lts) || 0
          const capacidadB = parseFloat(b.capacidad_lts) || 0
          return capacidadA - capacidadB
        })
      } catch (relacionadosError) {
        console.warn('Error loading related products:', relacionadosError)
        productosRelacionados.value = [productoConUrls]
      }
    } else {
      productosRelacionados.value = [productoConUrls]
    }

    if (data && data.id) {
      try {
        caracteristicasAdicionales.value = await fetchCaracteristicasAdicionales(data.id)
      } catch (caracteristicasError) {
        console.warn('Error loading additional characteristics:', caracteristicasError)
      }
    }

    if (data && data.categoria) {
      imagenesRedes.value = fetchImagenesRedes(data.categoria.imagenes_redes)
    }
  } catch (error) {
    console.error('Error al cargar producto:', error)
    producto.value = null
  }
}

onMounted(async () => {
  await fetchProducto()
})
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(180deg, var(--categoria-color) 66%, rgba(249, 249, 249, 0) 100%);
}

@media (min-width: 1080px) {
  .hero-gradient {
    background: linear-gradient(180deg, var(--categoria-color) 0%, rgba(249, 249, 249, 0) 100%);
  }
}
</style>
