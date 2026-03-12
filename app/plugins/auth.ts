import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  authStore.loadFromStorage();
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (e) {
      authStore.logout();
    }
  }
});
