<template>
    <header :class="[
        'xxl:max-w-[1304px] flex items-center justify-between sticky z-20 bg-gradient-to-r from-primary to-terciary lg:border-2 lg:rounded-full py-2 md:py-6 lg:py-3 xxl:py-[0.875rem] px-4 md:px-8 lg:px-4 xxl:pl-6 lg:mx-16 xxl:mx-auto transition-all duration-300',
        isScrolled ? 'top-0 lg:top-6' : 'top-0 lg:top-16'
    ]">
        <NuxtLink :to="ROUTES_NAMES.ROHERMET.HOME">
            <NuxtImg src="/images/logos/Logo-Rohermet-Blanco.svg" alt="Logo Rohermet"
                fetchpriority="high"
                class="w-28 md:w-[13.5rem] h-9 md:h-[4.5rem] lg:w-[9.75rem] lg:h-[3.25rem]" />
        </NuxtLink>
        <button @click="toggleDrawer" aria-label="Toggle Menu"
            class="w-12 h-12 lg:hidden flex justify-center items-center p-4 cursor-pointer touch-manipulation active:opacity-70">
            <Icon name="material-symbols:menu-rounded"
                class="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 text-white pointer-events-none" />
        </button>
        <nav class="hidden lg:flex">
            <ul class="flex items-center text-white font-bold">
                <li class="group">
                    <div
                        class="h-12 flex justify-center items-center border-2 border-transparent hover:border-secondary rounded-full transition-colors duration-300 px-4 xxl:px-6 cursor-default">
                        Productos
                    </div>
                    <div
                        class="w-[59.5rem] xxl:w-[82.25rem] flex gap-6 absolute top-full left-0 z-20 bg-white rounded-3xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-3 mt-5">
                        <div class="grid grid-cols-3 xxl:grid-cols-6 gap-3">
                            <div v-if="loading" class="col-span-4 flex justify-center items-center py-8">
                                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                            <div v-else-if="error" class="col-span-4 text-center text-red-500 py-8">
                                <p>Error al cargar categorías</p>
                            </div>
                            <NuxtLink v-else :to="ROUTES_NAMES.ROHERMET.CATEGORIA(categoria.slug)"
                                v-for="(categoria, index) in categorias" :key="categoria.id || index" class="relative">
                                <div class="w-[9.25rem] h-40 xxl:h-[13.5rem] rounded-2xl overflow-hidden shadow-lg">
                                    <img :src="categoria.imagen"
                                        :alt="`Rohermet Categoría ${categoria.nombre}`"
                                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                                </div>
                                <p class="absolute top-4 left-0 right-0 text-center text-white font-semibold">
                                    {{ categoria.nombre }}
                                </p>
                            </NuxtLink>
                        </div>
                        <img v-if="imagenBanner" :src="imagenBanner.imagen_grande" :alt="imagenBanner.nombre"
                            class="w-[27.5rem] h-[20.75rem] xxl:hidden object-cover rounded-2xl shadow-lg" />
                        <img v-if="imagenBanner" :src="imagenBanner.imagen_mediana" :alt="imagenBanner.nombre"
                            class="xxl:w-80 h-[13.5rem] hidden xxl:block object-cover rounded-2xl shadow-lg" />
                    </div>
                </li>
                <li v-for="(item, index) in conditionalMenu" :key="index" v-show="!item.isCatalogo || catalogoUrl"
                    class="h-12 flex justify-center items-center border-2 border-transparent hover:border-secondary rounded-full transition-colors duration-300 px-4 xxl:px-6">
                    <a v-if="item.isCatalogo" :href="catalogoUrl" :download="true"
                        target="_blank" rel="noopener noreferrer" class="cursor-pointer">
                        {{ item.nombre }}
                    </a>
                    <NuxtLink v-else :to="item.route">{{ item.nombre }}</NuxtLink>
                </li>
            </ul>
            <div class="flex justify-center items-center relative ml-2 group">
                <ButtonSecondary :to="ROUTES_NAMES.HOME">
                    Somos Unike Group
                </ButtonSecondary>
                <div
                    class="w-full flex flex-col absolute top-full left-0 z-20 bg-white rounded-3xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-3 mt-5">
                    <NuxtLink :to="ROUTES_NAMES.WATERPLAST.HOME"
                        class="hover:bg-gray-mid rounded-xl text-dark font-semibold transition-colors duration-300 py-2.5 px-3">
                        Waterplast
                    </NuxtLink>
                    <NuxtLink :to="ROUTES_NAMES.UNIKE.MURALLON" target="_blank" rel="noopener noreferrer"
                        class="hover:bg-gray-mid rounded-xl text-dark font-semibold transition-colors duration-300 py-2.5 px-3">
                        Murallón
                    </NuxtLink>
                </div>
            </div>
        </nav>
    </header>

    <RohermetDrawer :isOpen="isDrawerOpen" :catalogoUrl="catalogoUrl" @close="closeDrawer" />
</template>

<script setup>
import { ROUTES_NAMES } from '~/constants/ROUTE_NAMES'
import menu from '~/shared/rohermet/menu.js'

const { useRohermetCategorias } = await import('~/composables/rohermet/useCategorias.js')
const { categorias, loading, error, fetchCategorias } = useRohermetCategorias()

const { useRohermetImagenesDestacadas } = await import('~/composables/rohermet/useImagenesDestacadas.js')
const { fetchImagenDestacadaBySlug } = useRohermetImagenesDestacadas()

const { fetchCatalogoByMarca } = useCatalogos()

const isDrawerOpen = ref(false)
const isScrolled = ref(false)
const imagenBanner = ref(null)
const catalogoUrl = ref(null)

const conditionalMenu = menu


const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
}

const closeDrawer = () => {
    isDrawerOpen.value = false
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 0
}

onMounted(async () => {
    setTimeout(() => {
        fetchCategorias()
    }, 0)

    try {
        const imagenMenu = await fetchImagenDestacadaBySlug('imagen-menu')
        if (imagenMenu) {
            imagenBanner.value = imagenMenu
        }
    } catch (error) {
        console.log(error);
    }

    fetchCatalogoByMarca('Rohermet').then((url) => {
        catalogoUrl.value = url
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll, { passive: true })
})
</script>
