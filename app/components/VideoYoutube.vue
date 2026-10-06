<template>
    <DefaultSection v-if="youtubeId" class="px-4 md:px-8 lg:px-16 xxl:px-0 py-6 md:py-8 lg:py-12 xxl:py-16">
        <div class="w-full xxl:max-w-[1304px] aspect-video rounded-2xl shadow-md shadow-black/20 overflow-hidden">
            <iframe :src="`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`" :title="`Video ${pagina}`"
                loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen class="w-full h-full"></iframe>
        </div>
    </DefaultSection>
</template>

<script setup>
const props = defineProps({
    pagina: {
        type: String,
        required: true,
    },
})

const supabase = useSupabaseClient()

const { data: youtubeUrl } = await useAsyncData(`video-${props.pagina}`, async () => {
    const { data } = await supabase
        .from('videos')
        .select('youtube_url')
        .eq('pagina', props.pagina)
        .maybeSingle()
    return data?.youtube_url ?? null
})

const youtubeId = computed(() => youtubeUrl.value?.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? null)
</script>
