import { ROUTES } from "~/constants/routes";
import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtPlugin(() => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const router = useRouter();

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    onRequest({ options }) {
      if (!options.headers) {
        options.headers = new Headers();
      }
      if (store.token) {
        options.headers.set("Authorization", `Bearer ${store.token}`);
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        store.logout();

        if (router.currentRoute.value.path !== ROUTES.LOGIN) {
          await navigateTo(ROUTES.LOGIN);
        }
      }

      throw (
        response._data?.error ||
        response._data?.message ||
        "Something went wrong"
      );
    },
  });

  return {
    provide: { api },
  };
});
