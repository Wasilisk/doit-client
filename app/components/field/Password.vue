<script setup lang="ts">
import { Password } from "primevue";
import { useFieldError } from "~/composables/useFieldError";

defineOptions({ inheritAttrs: false });

export interface AuthPasswordFieldProps {
  modelValue?: string;
  placeholder?: string;
  error?: string | ValidationError;
  feedback?: boolean;
}

const { t } = useI18n();
const attrs = useAttrs();
const props = withDefaults(defineProps<AuthPasswordFieldProps>(), {
  modelValue: "",
  feedback: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { translatedError } = useFieldError(() => props.error);
</script>

<template>
  <div class="relative">
    <Password
      :model-value="props.modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :placeholder="props.placeholder"
      v-bind="attrs"
      :feedback="props.feedback"
      toggle-mask
      class="w-full"
      input-class="w-full"
      :invalid="!!props.error"
      :weakLabel="t('fields.email.weak_label')"
      :mediumLabel="t('fields.email.medium_label')"
      :strongLabel="t('fields.email.strong_label')"
    />
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="translatedError"
        v-tooltip.top="translatedError"
        class="absolute top-1/2 -translate-y-1/2 right-9 z-10 flex items-center cursor-default text-red-500 text-sm"
      >
        <i class="pi pi-exclamation-circle" />
      </div>
    </Transition>
  </div>
</template>
