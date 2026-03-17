<script setup lang="ts">
import { useDashboardNav } from "~/composables/useDashboardNav";
import AppLogo from "~/components/common/AppLogo.vue";

const { navLinks, userInitials, fullAvatarUrl, handleLogout, authStore } =
  useDashboardNav();

const { t } = useI18n();
</script>

<template>
  <aside
    class="hidden md:flex w-[260px] min-h-screen bg-white flex-col border-r border-gray-100 dark:bg-gray-900 dark:border-gray-700"
  >
    <div class="px-6 pt-6 pb-4">
      <AppLogo size="3xl" />
    </div>

    <div class="px-3">
      <Divider class="my-0" />
      <div
        class="py-4 flex items-center gap-3"
        v-if="!authStore.isFetchingUser && authStore.user"
      >
        <Avatar
          v-if="fullAvatarUrl"
          :image="fullAvatarUrl"
          size="large"
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
          size="large"
          shape="circle"
          class="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
        />
        <div class="min-w-0">
          <p
            class="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate"
          >
            {{ authStore.user.full_name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ authStore.user.email }}
          </p>
        </div>
      </div>

      <div class="px-6 py-4 flex items-center gap-3" v-else>
        <Skeleton shape="circle" size="3rem" />
        <div class="flex flex-col gap-2 flex-1">
          <Skeleton width="70%" height="0.75rem" />
          <Skeleton width="90%" height="0.625rem" />
        </div>
      </div>

      <Divider class="my-0" />
    </div>

    <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-amber-900/30 dark:hover:text-amber-200"
        exact-active-class="bg-amber-100 text-amber-900 font-semibold dark:bg-amber-900/40 dark:text-amber-200"
      >
        <i :class="link.icon" class="text-base"></i>
        <span>{{ t(link.label) }}</span>
      </NuxtLink>
    </nav>

    <div class="px-3 pb-6">
      <Divider class="mt-0 mb-3" />
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 w-full cursor-pointer"
      >
        <i class="pi pi-sign-out text-base"></i>
        <span>{{ t("navigation.logout") }}</span>
      </button>
    </div>
  </aside>
</template>
