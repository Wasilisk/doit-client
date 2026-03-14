import { defineNuxtPlugin } from "#app";
import {
  VueQueryPlugin,
  QueryClient,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  });

  const options: VueQueryPluginOptions = { queryClient };

  nuxtApp.vueApp.use(VueQueryPlugin, options);
});
