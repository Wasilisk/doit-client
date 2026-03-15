<script setup lang="ts">
const visible = defineModel("visible", { type: Boolean, default: false });

withDefaults(
  defineProps<{
    title: string;
    message: string;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptIcon?: string;
    rejectIcon?: string;
    acceptClass?: string;
    rejectClass?: string;
    acceptSeverity?:
      | "success"
      | "info"
      | "warning"
      | "danger"
      | "help"
      | "primary"
      | "secondary"
      | "contrast";
    loading?: boolean;
  }>(),
  {
    acceptIcon: "pi pi-check",
    rejectIcon: "pi pi-times",
    acceptSeverity: "danger",
  },
);

const emit = defineEmits<{
  (e: "accept"): void;
  (e: "cancel"): void;
}>();

const onAccept = () => {
  emit("accept");
};

const onCancel = () => {
  visible.value = false;
  emit("cancel");
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="title"
    :style="{ width: '25rem' }"
    :closable="!loading"
  >
    <span class="p-text-secondary block mb-5">{{ message }}</span>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        :label="rejectLabel || $t('general.cancel')"
        :icon="rejectIcon"
        severity="secondary"
        @click="onCancel"
        :disabled="loading"
      />
      <Button
        type="button"
        :label="acceptLabel || $t('general.confirm')"
        :icon="acceptIcon"
        :severity="acceptSeverity"
        :class="acceptClass"
        :loading="loading"
        @click="onAccept"
      />
    </div>
  </Dialog>
</template>
