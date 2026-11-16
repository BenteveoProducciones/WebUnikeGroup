<template>
    <DefaultSection class="px-4 md:px-8 lg:px-16 xxl:px-0 py-6 md:p-8 lg:py-12 xxl:py-16">
        <div class="xxl:max-w-[1304px] md:w-full flex flex-col items-center gap-3 md:gap-4 lg:gap-6 mx-auto">
            <HeadingH2 class="text-center text-terciary">Nuestros medios de contacto</HeadingH2>

            <div class="w-full flex flex-col divide-y divide-gray-mid">
                <div v-for="sede in sedes" :key="sede.nombre"
                    class="md:w-full flex flex-col md:flex-row items-center md:justify-between gap-3 lg:gap-6 py-4 first:pt-0 last:pb-0">

                    <div class="max-w-64 md:max-w-full flex flex-col items-center md:items-start gap-2 text-center md:text-start">
                        <p class="text-xl md:text-[1.75rem] font-bold text-terciary">{{ sede.nombre }}</p>
                        <div class="flex md:items-center gap-2 md:text-xl">
                            <Icon name="material-symbols:location-on-outline-rounded" class="w-6 h-6 flex-shrink-0" />
                            <span>{{ sede.direccion }}</span>
                        </div>
                        <div class="flex items-center gap-2 md:text-xl">
                            <Icon name="material-symbols:phone-in-talk-outline-rounded" class="w-6 h-6 flex-shrink-0" />
                            <a :href="'tel:' + sede.telefonoRaw">{{ sede.telefono }}</a>
                        </div>
                        <div class="flex items-center gap-2 md:text-xl">
                            <Icon name="material-symbols:mail-outline-rounded" class="w-6 h-6 flex-shrink-0" />
                            <a :href="'mailto:' + sede.mail">{{ sede.mail }}</a>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row md:flex-col gap-2 lg:gap-3">
                        <ButtonPrimary :to="ROUTES_NAMES.UNIKE.CONTACTO"
                            class="!bg-terciary flex items-center justify-center gap-2.5 px-7">
                            <NuxtImg src="/images/redes/Whatsapp.svg" alt="Contacto Whatsapp" class="w-5 h-5 flex-shrink-0" />
                            <span>Contactate</span>
                        </ButtonPrimary>
                        <ButtonPrimary
                            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.direccion)}`"
                            target="_blank" rel="noopener noreferrer"
                            class="flex items-center justify-center gap-2.5 px-7">
                            <Icon name="material-symbols:location-on-outline-rounded" class="w-6 h-6 flex-shrink-0" />
                            <span>Ver en Maps</span>
                        </ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    </DefaultSection>
</template>

<script setup>
import { ROUTES_NAMES } from '~/constants/ROUTE_NAMES'

const sedes = [
    {
        nombre: 'Unike Group',
        direccion: 'Viamonte 3054, Valentín Alsina, Lanús, Buenos Aires, Argentina',
        telefono: '+54 (011) 4225.1531/7449',
        telefonoRaw: '+5491170133286',
        mail: 'info@unikegroup.com.ar',
    },
    {
        nombre: 'Waterplast',
        direccion: 'Viamonte 3054, Valentín Alsina, Lanús, Buenos Aires, Argentina',
        telefono: '+54 (011) 4225.1531/7449',
        telefonoRaw: '+5491170133286',
        mail: 'info@unikegroup.com.ar',
    },
    {
        nombre: 'Rohermet',
        direccion: 'Viamonte 3054, Valentín Alsina, Lanús, Buenos Aires, Argentina',
        telefono: '+54 (011) 4225.1531/7449',
        telefonoRaw: '+5491170133286',
        mail: 'info@unikegroup.com.ar',
    },
]
</script>