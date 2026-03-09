<script setup lang="ts">
const props = defineProps<{
    title: string
}>()
</script>

<template>
    <Card class="w-full max-w-md p-6 shadow-lg rounded-xl">
        <template #header class="relative">
            <h1 class="text-4xl font-bold mb-2 text-center">
                DOIT<span class="text-red-500">.</span>
            </h1>
            <LanguageSelector class="absolute top-4 right-4" />
        </template>
        <template #title>
            <h2 class="text-center mb-4">{{ props.title }}</h2>
        </template>
        <template #content class="p-0">
            <slot />
        </template>
    </Card>
</template>