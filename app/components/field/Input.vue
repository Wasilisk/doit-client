<script setup lang="ts">
import { InputText } from "primevue";
import { useFieldError } from "~/composables/useFieldError";

defineOptions({ inheritAttrs: false });

export interface AuthInputFieldProps {
  modelValue?: string;
  placeholder?: string;
  error?: string | ValidationError;
}

const attrs = useAttrs();
const props = withDefaults(defineProps<AuthInputFieldProps>(), {
  modelValue: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { translatedError } = useFieldError(() => props.error);
</script>

<template>
  <div class="relative">
    <InputText
      :value="props.modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="props.placeholder"
      class="w-full"
      v-bind="attrs"
      :invalid="!!props.error"
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
        class="absolute top-1/2 -translate-y-1/2 right-3 z-10 flex items-center cursor-default text-red-500 text-sm"
      >
        <i class="pi pi-exclamation-circle" />
      </div>
    </Transition>
  </div>
</template>
