<template>
    <DefaultMain>
        <UnikeHero />
        <UnikeMarcasCards />
        <VideoYoutube pagina="unike" />
        <UnikeHistoria />
        <UnikeDefine />
        <UnikeCapacidad />
        <UnikeMediosContacto />
    </DefaultMain>
</template>

<script setup>
definePageMeta({
    layout: 'default'
})

useSeoMeta({
    title: 'Unike Group - Soluciones Industriales',
    description: 'Unike Group es un grupo industrial argentino dedicado al desarrollo de soluciones innovadoras para la construcción y el almacenamiento de agua.',
})

useHead({
    titleTemplate: null,
})
</script>