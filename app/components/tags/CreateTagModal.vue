<script setup lang="ts">
import { watch } from "vue";
import { useForm } from "vee-validate";
import { useTagService } from "~/services/tag.service";
import { tagSchema, type TagSchema } from "~/types/schemas/tagSchema";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "created"): void;
}>();

const { t } = useI18n();
const { createTag } = useTagService();
const queryClient = useQueryClient();
const { handleError } = useApiErrorHandler();

const mutation = useMutation({
  mutationFn: (payload: { name: string; color: string }) => createTag(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    emit("created");
    emit("update:visible", false);
  },
  onError: (e) => {
    handleError(e);
  },
});

const getRandomColor = () =>
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");

const { handleSubmit, errors, defineField, resetForm } = useForm<TagSchema>({
  validationSchema: tagSchema,
  initialValues: {
    name: "",
    color: getRandomColor(),
  },
});

const useAdaptive = useAdaptiveField<TagSchema>(defineField, errors);
const [name, nameAttrs] = useAdaptive("name");
const [color, colorAttrs] = useAdaptive("color");

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm({
        values: {
          name: "",
          color: getRandomColor(),
        },
      });
    }
  },
);

const onSubmit = handleSubmit((values) => {
  const payload = {
    name: values.name,
    color: values.color.startsWith("#") ? values.color : `#${values.color}`,
  };
  mutation.mutate(payload);
});

const onCancel = () => {
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="t('tags.modal.createTitle')"
    :style="{ width: '25rem' }"
    :closable="!mutation.isPending.value"
  >
    <form
      @submit.prevent="onSubmit"
      id="create-tag-form"
      class="flex flex-col gap-4 mt-2"
    >
      <div>
        <FieldInput
          v-bind="nameAttrs"
          v-model="name"
          :placeholder="t('fields.tagName.placeholder')"
          :error="errors.name"
        />
      </div>

      <div class="flex items-center gap-2">
        <Label
          class="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1"
          >{{ t("fields.tagColor.label") }}</Label
        >
        <div class="flex items-center gap-2">
          <Chip
            class="px-2 py-1 gap-2 flex items-center border border-gray-200 dark:border-gray-600"
          >
            <ColorPicker v-bind="colorAttrs" v-model="color" format="hex" />
            <span
              class="font-mono text-xs uppercase text-gray-600 dark:text-gray-300"
              >#{{ color }}</span
            >
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
          :disabled="mutation.isPending.value"
          icon="pi pi-times"
        />
        <Button
          type="submit"
          form="create-tag-form"
          :label="t('tags.actions.create')"
          severity="success"
          :loading="mutation.isPending.value"
          icon="pi pi-check"
        />
      </div>
    </template>
  </Dialog>
</template>
