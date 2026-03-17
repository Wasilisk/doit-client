<script setup lang="ts">
import { ref, onMounted } from "vue";

type Theme = "light" | "dark";

interface ThemeOption {
  label: string;
  value: Theme;
  icon: string;
}

const selectedTheme = ref<Theme>("light");

const themeOptions: ThemeOption[] = [
  { label: "Light", value: "light", icon: "pi pi-sun" },
  { label: "Dark", value: "dark", icon: "pi pi-moon" },
];

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark-theme");
  } else {
    html.classList.remove("dark-theme");
  }
  localStorage.setItem("theme", theme);
}

function onThemeChange() {
  applyTheme(selectedTheme.value);
}

onMounted(() => {
  const saved = localStorage.getItem("theme") as Theme | null;
  const preferred: Theme =
    saved ??
    (window.matchMedia("(prefers-color-scheme: dark-theme)").matches
      ? "dark"
      : "light");
  selectedTheme.value = preferred;
  applyTheme(preferred);
});
</script>

<template>
  <div class="theme-switcher-wrapper">
    <SelectButton
      v-model="selectedTheme"
      :options="themeOptions"
      option-value="value"
      class="theme-select-btn"
      :allow-empty="false"
      @change="onThemeChange"
    >
      <template #option="{ option }">
        <span
          class="theme-option"
          :class="{ active: selectedTheme === option.value }"
        >
          <i :class="option.icon" class="theme-icon" />
          <span class="theme-label">{{ option.label }}</span>
        </span>
      </template>
    </SelectButton>
  </div>
</template>
