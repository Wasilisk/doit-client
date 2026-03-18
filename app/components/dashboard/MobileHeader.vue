<script setup lang="ts">
import { ref, computed } from "vue";
import { useDashboardNav } from "~/composables/useDashboardNav";
import Menu from "primevue/menu";

const { navLinks, handleLogout, authStore } = useDashboardNav();
const { t } = useI18n();

const menu = ref<InstanceType<typeof Menu> | null>(null);

const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};

const menuItems = computed(() => {
  const items = navLinks.value.map((link) => ({
    label: t(link.label),
    icon: link.icon,
    command: () => navigateTo(link.to),
  }));

  items.push({
    label: t("navigation.logout"),
    icon: "pi pi-sign-out",
    command: handleLogout,
  });

  return items;
});
</script>

<template>
  <header
    class="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20 dark:bg-gray-900 dark:border-gray-700"
  >
    <AppLogo size="xl" />

    <div
      class="flex items-center gap-2 cursor-pointer"
      @click="toggleMenu"
      aria-haspopup="true"
      aria-controls="mobile_user_menu"
    >
      <UserAvatar v-if="authStore.user" :user="authStore.user" size="normal" />
      <Skeleton v-else size="normal" shape="circle" />
      <i class="pi pi-angle-down text-gray-500 dark:text-gray-400 text-sm"></i>
    </div>

    <Menu
      ref="menu"
      id="mobile_user_menu"
      :model="menuItems"
      :popup="true"
      class="w-full md:w-56"
    />
  </header>
</template>
