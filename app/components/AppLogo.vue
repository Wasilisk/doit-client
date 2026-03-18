<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  }>(),
  {
    size: "base",
  },
);
</script>

<template>
  <h1 :class="`text-${props.size} font-bold`">
    DOIT<span class="text-red-500">.</span>
  </h1>
</template>
