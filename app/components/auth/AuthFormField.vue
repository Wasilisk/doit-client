<script setup lang="ts">
import { InputText, Password } from 'primevue';

defineOptions({ inheritAttrs: false })

type FieldType = 'text' | 'password'
export interface AuthFieldProps {
    modelValue?: string
    type?: FieldType
    placeholder?: string
    error?: string | ValidationError
    feedback?: boolean
}

const attrs = useAttrs()
const props = withDefaults(defineProps<AuthFieldProps>(), {
    modelValue: '',
    feedback: true,
    type: 'text'
})
const { resolveError } = useValidationErrorResolver()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const translatedError = computed(() => resolveError(props.error))
</script>

<template>
    <div class="relative">
        <Password v-if="props.type === 'password'" :model-value="props.modelValue"
            @update:model-value="emit('update:modelValue', $event)" :placeholder="props.placeholder" v-bind="attrs"
            :feedback="props.feedback" toggle-mask class="w-full" input-class="w-full" :invalid="!!props.error" />
        <InputText v-else :value="props.modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :placeholder="props.placeholder" class="w-full" v-bind="attrs" :invalid="!!props.error" />
        <Transition enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
            leave-to-class="opacity-0">
            <div v-if="translatedError" v-tooltip.top="translatedError"
                class="absolute top-1/2 -translate-y-1/2 z-10 flex items-center cursor-default text-red-500 text-sm"
                :class="props.type === 'password' ? 'right-9' : 'right-3'">
                <i class="pi pi-exclamation-circle" />
            </div>
        </Transition>
    </div>
</template>