import { defineNuxtPlugin } from 'nuxt/app';
import CountryFlag from 'vue-country-flag-next';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('country-flag', CountryFlag);
});
