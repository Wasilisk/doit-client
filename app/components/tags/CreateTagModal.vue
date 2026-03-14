<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { useTagService } from '~/services/tag.service'
import { tagSchema, type TagSchema } from '~/types/schemas/tagSchema'
import AuthFormField from '~/components/auth/AuthFormField.vue'

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'created'): void
}>()

const { t } = useI18n()
const { createTag } = useTagService()

const isSubmitting = ref(false)

const { handleSubmit, errors, defineField, resetForm } = useForm<TagSchema>({
    validationSchema: tagSchema,
    initialValues: {
        name: '',
        color: '000000',
    },
})

const useAdaptive = useAdaptiveField<TagSchema>(defineField, errors)
const [name, nameAttrs] = useAdaptive('name')
const [color, colorAttrs] = useAdaptive('color')

watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm({
            values: {
                name: '',
                color: '000000',
            }
        })
    }
})

const onSubmit = handleSubmit(async (values) => {
    isSubmitting.value = true
    try {
        const payload = {
            name: values.name,
            color: values.color.startsWith('#') ? values.color : `#${values.color}`
        }
        await createTag(payload)
        emit('created')
        emit('update:visible', false)
    } catch (e) {
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
})

const onCancel = () => {
    emit('update:visible', false)
}
</script>

<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        :header="t('tags.modal.createTitle')" 
        :style="{ width: '25rem' }" 
        :closable="!isSubmitting"
    >
        <form @submit.prevent="onSubmit" id="create-tag-form" class="flex flex-col gap-4 mt-2">
            <div>
                <AuthFormField 
                    v-bind="nameAttrs" 
                    v-model="name" 
                    :placeholder="t('fields.tagName.placeholder')" 
                    :error="errors.name"
                />
            </div>
            
            <div>
                <div class="flex items-center gap-2">
                    <Chip class="px-2 py-1 gap-2 flex items-center border border-gray-200">
                        <ColorPicker 
                            v-bind="colorAttrs" 
                            v-model="color" 
                            format="hex" 
                        />
                        <span class="font-mono text-xs uppercase text-gray-600">#{{ color }}</span>
                    </Chip>
                </div>
            </div>
        </form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button 
                    type="button" 
                    :label="t('general.cancel')" 
                    severity="secondary" 
                    @click="onCancel" 
                    :disabled="isSubmitting" 
                    icon="pi pi-times"
                />
                <Button 
                    type="submit" 
                    form="create-tag-form" 
                    :label="t('tags.actions.create')" 
                    severity="success" 
                    :loading="isSubmitting" 
                    icon="pi pi-check"
                />
            </div>
        </template>
    </Dialog>
</template>
