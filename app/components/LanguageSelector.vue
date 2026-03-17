<script setup lang="ts">
import VueCountryFlag from "vue-country-flag-next";
import type { Locale } from "~/types/i18n";

const { locale, locales, setLocale } = useI18n();

const localeOptions = computed(() =>
  locales.value.map((l) => ({
    label: l.name,
    value: l.code,
  })),
);

const countryMap: Record<Locale, string> = {
  en: "us",
  ua: "ua",
};

function localeToCountry(code: Locale): string {
  return countryMap[code] ?? code;
}

function localeLabel(code: Locale): string {
  return localeOptions.value.find((o) => o.value === code)?.label ?? code;
}

async function switchLanguage(e: { value: Locale }) {
  await setLocale(e.value);
}
</script>
<template>
  <Select
    :model-value="locale"
    :options="localeOptions"
    option-label="label"
    option-value="value"
    size="small"
    @change="switchLanguage"
    :pt="{
      root: 'border-none shadow-none min-w-32 rounded-lg',
      label: 'text-sm font-medium',
      dropdown: 'w-8',
      overlay:
        'rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden',
      listContainer: 'p-0.5',
      option:
        'p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer',
    }"
  >
    <template #value="slotProps">
      <div class="flex items-center justify-center gap-2 text-sm font-medium">
        <vue-country-flag
          :country="localeToCountry(slotProps.value)"
          class="rounded-sm shadow-sm p-0! my-[-6px]!"
        />
        <span>{{ localeLabel(slotProps.value) }}</span>
      </div>
    </template>

    <template #option="slotProps">
      <div
        class="flex items-center justify-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <vue-country-flag
          :country="localeToCountry(slotProps.option.value)"
          class="rounded-sm shadow-sm p-0! my-[-6px]!"
        />
        <span>{{ slotProps.option.label }}</span>
      </div>
    </template>
  </Select>
</template>
