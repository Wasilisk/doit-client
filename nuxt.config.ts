// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8080",
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module", "@pinia/nuxt", "@nuxtjs/i18n"],
  routeRules: {
    "/login": { ssr: false },
    "/register": { ssr: false },
  },
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss(), { src: "@/plugins/country-flag.client.js" }],
  },
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".my-app-dark",
          cssLayer: {
            name: "primevue",
            order: "theme, base, primevue, utilities",
          },
        },
      },
    },
    directives: {
      include: ["Tooltip"],
    },
  },
  css: ["~/assets/css/tailwind.css", "primeicons/primeicons.css"],
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "ua", name: "Українська", file: "ua.json" },
    ],
  },
});
