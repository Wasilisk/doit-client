<script setup lang="ts">
import { computed } from "vue";
import type { User } from "~/types/user";

const props = defineProps<{
  user: User;
  size?: "normal" | "large" | "xlarge";
}>();

const userInitials = computed(() => {
  const name = props.user?.full_name || "";
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>

<template>
  <Avatar
    v-if="user?.avatar_url"
    :image="user.avatar_url"
    :size="size"
    shape="circle"
    :pt="{
      image: {
        class: 'object-cover',
      },
    }"
  />
  <Avatar
    v-else
    :label="userInitials"
    :size="size"
    shape="circle"
    class="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
  />
</template>
