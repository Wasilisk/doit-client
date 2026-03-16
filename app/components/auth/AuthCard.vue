<script setup lang="ts">
import AppLogo from "~/components/common/AppLogo.vue";

const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <Card class="w-full max-w-md p-6 shadow-lg rounded-xl">
    <template #header>
      <div class="flex justify-center">
        <AppLogo size="3xl" />
      </div>
    </template>
    <template #title>
      <h2 class="text-center mb-4">{{ props.title }}</h2>
    </template>
    <template #content class="p-0">
      <slot />
    </template>
  </Card>
</template>
