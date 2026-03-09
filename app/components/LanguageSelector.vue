<script setup lang="ts">
import VueCountryFlag from 'vue-country-flag-next'

const { locale, locales, setLocale } = useI18n()

const selectedLocale = ref(locale.value)

const localeOptions = computed(() =>
    (locales.value).map((l) => ({
        label: l.name,
        value: l.code,
    }))
)

const countryMap: Record<string, string> = {
    en: 'us',
    ua: 'ua',
}

function localeToCountry(code: string): string {
    return countryMap[code] ?? code
}

function localeLabel(code: string): string {
    return localeOptions.value.find((o) => o.value === code)?.label ?? code
}

async function switchLanguage(e: { value: 'en' | 'ua' }) {
    await setLocale(e.value)
    selectedLocale.value = e.value
}
</script>
<template>
    <Select v-model="selectedLocale" :options="localeOptions" option-label="label" option-value="value"
        @change="switchLanguage" :pt="{
            root: 'border-none shadow-none min-w-32 rounded-2xl',
            label: 'py-1.5 px-2 text-sm font-medium',
            dropdown: 'w-8',
            overlay: 'rounded-2xl shadow-xl border border-gray-100 overflow-hidden',
            listContainer: 'p-1.5',
            option: 'rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
        }">
        <template #value="slotProps">
            <div class="flex items-center gap-2 text-sm font-medium">
                <vue-country-flag :country="localeToCountry(slotProps.value)" size="small"
                    class="rounded-sm shadow-sm" />
                <span>{{ localeLabel(slotProps.value) }}</span>
            </div>
        </template>

        <template #option="slotProps">
            <div class="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                <vue-country-flag :country="localeToCountry(slotProps.option.value)" size="small"
                    class="rounded-sm shadow-sm" />
                <span>{{ slotProps.option.label }}</span>
            </div>
        </template>
    </Select>
</template>