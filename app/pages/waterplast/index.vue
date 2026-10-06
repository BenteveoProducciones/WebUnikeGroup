<template>
  <DefaultMain>
    <WaterplastHero />
    <WaterplastMuestra />
    <VideoYoutube pagina="waterplast" />
    <WaterplastSobre />
    <Opiniones />
    <Distribuidores empresa="waterplast" />
    <FAQs :faqs="faqs" />
    <Blog />
  </DefaultMain>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useHomeScroll } from '~/composables/useHomeScroll'

const route = useRoute()
const { scrollToSection } = useHomeScroll()

definePageMeta({
  layout: 'waterplast'
});

const faqs = [
  {
    pregunta: "¿Qué tipo de garantía ofrecen sus productos?",
    respuesta: "Ofrecemos garantía de calidad y durabilidad en todos nuestros productos. Consulta los términos específicos en cada caso.",
  },
  {
    pregunta: "¿Cuáles son los tiempos de entrega?",
    respuesta: "Los tiempos de entrega varían según la ubicación y el producto, pero nos esforzamos en cumplir con plazos de entrega rápidos y eficientes.",
  },
  {
    pregunta: "¿Ofrecen asesoría en la instalación de productos?",
    respuesta: "Sí, contamos con un equipo de soporte que puede guiarte en la instalación de nuestros productos o recomendarte técnicos especializados.",
  },
  {
    pregunta: "¿Tienen distribución en todo el país?",
    respuesta: "Sí, nuestros productos están disponibles en todo el país gracias a nuestra amplia red de distribuidores.",
  },
  {
    pregunta: "¿Tienen comercialización directa?",
    respuesta: "No, nuestros productos son comercializados mediante nuestros distribuidores oficiales.",
  },
  {
    pregunta: "¿Cómo saber qué producto es adecuado para mi proyecto?",
    respuesta: "Puedes contactarnos y uno de nuestros asesores te guiará en la elección del producto que mejor se adapte a tus necesidades.",
  },
];

useSeoMeta({
  title: 'Waterplast - Tanques de Agua y Sistemas de Almacenamiento | Unike Group',
  description: 'En Unike Group desarrollamos soluciones innovadoras para el almacenamiento y tratamiento del agua en Argentina. Nuestros tanques Waterplast garantizan calidad, durabilidad y protección antibacteriana. Descubrí nuestra red de distribuidores y asesorate con nuestros expertos en soluciones hídricas sustentables.',
  keywords: 'tUnike Group Argentina, Waterplast, tanques de agua, tanques para agua potable, tanques plásticos, tanques con filtro UV, tanques antibacterianos, soluciones sustentables para agua, almacenamiento de agua Argentina, sistemas hídricos, distribuidores Waterplast, tanques domiciliarios, tanques industriales, innovación en agua Argentina',
  ogTitle: 'Waterplast - Tanques de Agua y Sistemas de Almacenamiento',
  ogDescription: 'En Unike Group desarrollamos soluciones innovadoras para el almacenamiento y tratamiento del agua en Argentina. Nuestros tanques Waterplast garantizan calidad, durabilidad y protección antibacteriana. Descubrí nuestra red de distribuidores y asesorate con nuestros expertos en soluciones hídricas sustentables.',
  ogSiteName: 'Waterplast - Unike Group',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Waterplast - Tanques de Agua y Sistemas de Almacenamiento',
  twitterDescription: 'En Unike Group desarrollamos soluciones innovadoras para el almacenamiento y tratamiento del agua en Argentina. Nuestros tanques Waterplast garantizan calidad, durabilidad y protección antibacteriana. Descubrí nuestra red de distribuidores y asesorate con nuestros expertos en soluciones hídricas sustentables.',
});

const config = useRuntimeConfig()

useHead({
  titleTemplate: null,
});

watch(
  () => route.hash,
  (newHash) => {
    if (newHash) {
      nextTick(() => {
        setTimeout(() => {
          scrollToSection(newHash)
        }, 100)
      })
    }
  }
);

onMounted(() => {
  if (route.hash) {
    setTimeout(() => {
      scrollToSection(route.hash)
    }, 200)
  }
});
</script>