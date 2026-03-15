<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useTagService } from "~/services/tag.service";
import { tagSchema, type TagSchema } from "~/types/schemas/tagSchema";
import AuthFormField from "~/components/auth/AuthFormField.vue";
import CreateTagModal from "~/components/tags/CreateTagModal.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const { fetchTags, updateTag, deleteTag } = useTagService();
const queryClient = useQueryClient();

const { data: serverTags } = await useAsyncData("tags-ssr", () => fetchTags());

const { data: tags, isPending: pending } = useQuery({
  queryKey: ["tags"],
  queryFn: () => fetchTags(),
  initialData: serverTags.value || [],
});

const isCreateModalOpen = ref(false);
const editingTagId = ref<string | null>(null);

const isDeleteDialogOpen = ref(false);
const pendingDeleteId = ref<string | null>(null);

const { handleSubmit, errors, defineField, setValues, resetForm } =
  useForm<TagSchema>({
    validationSchema: tagSchema,
    initialValues: {
      name: "",
      color: "000000",
    },
  });

const useAdaptive = useAdaptiveField<TagSchema>(defineField, errors);
const [name, nameAttrs] = useAdaptive("name");
const [color, colorAttrs] = useAdaptive("color");

const startEdit = (tag: any) => {
  editingTagId.value = tag.id;
  setValues({
    name: tag.name,
    color: tag.color.startsWith("#") ? tag.color.substring(1) : tag.color,
  });
};

const cancelEdit = () => {
  editingTagId.value = null;
  resetForm();
};

const updateMutation = useMutation({
  mutationFn: (args: { id: string; payload: any }) =>
    updateTag(args.id, args.payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    editingTagId.value = null;
    resetForm();
  },
  onError: (e) => {
    console.error(e);
  },
});

const saveEdit = handleSubmit((values) => {
  if (!editingTagId.value) return;
  const payload = {
    name: values.name,
    color: values.color.startsWith("#") ? values.color : `#${values.color}`,
  };
  updateMutation.mutate({ id: editingTagId.value, payload });
});

const confirmDelete = (id: string) => {
  pendingDeleteId.value = id;
  isDeleteDialogOpen.value = true;
};

const deleteMutation = useMutation({
  mutationFn: (id: string) => deleteTag(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    isDeleteDialogOpen.value = false;
    pendingDeleteId.value = null;
  },
  onError: (e) => {
    console.error(e);
    pendingDeleteId.value = null;
  },
});

const handleDelete = () => {
  if (!pendingDeleteId.value) return;
  deleteMutation.mutate(pendingDeleteId.value);
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">{{ t("tags.title") }}</h1>
      <Button
        :label="t('tags.actions.create')"
        icon="pi pi-plus"
        @click="isCreateModalOpen = true"
      />
    </div>

    <div
      class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
    >
      <DataTable
        :value="tags || []"
        dataKey="id"
        :loading="pending"
        class="p-datatable-sm"
      >
        <Column field="name" :header="t('tags.columns.name')" class="w-1/3">
          <template #body="{ data }">
            <template v-if="editingTagId === data.id">
              <form @submit.prevent="saveEdit" id="tag-edit-form">
                <AuthFormField
                  v-bind="nameAttrs"
                  v-model="name"
                  :placeholder="t('fields.tagName.placeholder')"
                  :error="errors.name"
                  @keyup.enter="saveEdit"
                  @keyup.escape="cancelEdit"
                />
              </form>
            </template>
            <template v-else>
              <span class="font-medium text-gray-800">{{ data.name }}</span>
            </template>
          </template>
        </Column>

        <Column field="color" :header="t('tags.columns.color')" class="w-1/3">
          <template #body="{ data }">
            <template v-if="editingTagId === data.id">
              <div class="flex items-center gap-2">
                <Chip
                  class="px-2 py-1 gap-2 flex items-center border border-gray-200"
                >
                  <ColorPicker
                    v-bind="colorAttrs"
                    v-model="color"
                    format="hex"
                  />
                  <span class="font-mono text-xs uppercase text-gray-600"
                    >#{{ color }}</span
                  >
                </Chip>
                <span v-if="errors.color" class="text-xs text-red-500">{{
                  errors.color
                }}</span>
              </div>
            </template>
            <template v-else>
              <Chip
                class="px-2 py-1 gap-2 flex items-center border border-gray-200 bg-white"
              >
                <span
                  class="w-4 h-4 rounded-full border border-gray-300 block shadow-sm"
                  :style="{ backgroundColor: data.color }"
                ></span>
                <span class="font-mono text-xs text-gray-600 uppercase">{{
                  data.color
                }}</span>
              </Chip>
            </template>
          </template>
        </Column>

        <Column
          field="task_count"
          :header="t('tags.columns.taskCount')"
          class="w-[15%]"
        >
          <template #body="{ data }">
            <Badge :value="data.task_count" severity="secondary" />
          </template>
        </Column>

        <Column
          :header="t('tags.columns.actions')"
          class="w-[15%] text-right"
          alignFrozen="right"
        >
          <template #body="{ data }">
            <div class="flex justify-end items-center gap-1">
              <template v-if="editingTagId === data.id">
                <template v-if="updateMutation.isPending.value">
                  <i class="pi pi-spinner pi-spin text-xl text-primary p-2"></i>
                </template>
                <template v-else>
                  <Button
                    icon="pi pi-check"
                    rounded
                    text
                    severity="success"
                    :aria-label="t('tags.actions.save')"
                    form="tag-edit-form"
                    type="submit"
                  />
                  <Button
                    icon="pi pi-times"
                    rounded
                    text
                    severity="secondary"
                    :aria-label="t('tags.actions.cancel')"
                    @click="cancelEdit"
                  />
                </template>
              </template>
              <template v-else>
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="secondary"
                  :aria-label="t('tags.actions.edit')"
                  :disabled="
                    updateMutation.isPending.value ||
                    deleteMutation.isPending.value
                  "
                  @click="startEdit(data)"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  :aria-label="t('tags.actions.delete')"
                  :loading="
                    deleteMutation.isPending.value &&
                    pendingDeleteId === data.id
                  "
                  :disabled="updateMutation.isPending.value"
                  @click="confirmDelete(data.id)"
                />
              </template>
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="p-8 text-center text-gray-500">
            {{ t("tags.messages.empty") }}
          </div>
        </template>
      </DataTable>
    </div>

    <AppConfirmDialog
      v-model:visible="isDeleteDialogOpen"
      :title="t('tags.actions.delete')"
      :message="t('tags.messages.deleteConfirm')"
      :acceptLabel="t('tags.actions.delete')"
      :rejectLabel="t('tags.actions.cancel')"
      :loading="deleteMutation.isPending.value"
      @accept="handleDelete"
    />

    <CreateTagModal v-model:visible="isCreateModalOpen" />
  </div>
</template>
