// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  vite: {
    // @ts-expect-error
    plugins: [tailwindcss()],
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})
