<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth.store";
import { useAuthService } from "~/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useApiErrorHandler } from "~/composables/useApiErrorHandler";
import { useForm } from "vee-validate";
import {
  profileSchema,
  type ProfileSchema,
} from "~/types/schemas/profileSchema";

definePageMeta({ layout: "dashboard" });

const { t } = useI18n();
const authStore = useAuthStore();
const { updateUserProfile } = useAuthService();
const { handleError } = useApiErrorHandler();
const config = useRuntimeConfig();

const user = computed(() => authStore.user);

const avatarUrl = computed(() => {
  if (!user.value?.avatar_url) return null;
  if (user.value.avatar_url.startsWith("http")) return user.value.avatar_url;
  return `${config.public.apiUrl}${user.value.avatar_url}`;
});

const fileInput = ref<HTMLInputElement | null>(null);
const isHoveringAvatar = ref(false);

const isEditingName = ref(false);

const { handleSubmit, errors, defineField, resetForm } = useForm<ProfileSchema>(
  {
    validationSchema: profileSchema,
  },
);

const useAdaptive = useAdaptiveField<ProfileSchema>(defineField, errors);
const [fullName, fullNameAttrs] = useAdaptive("fullName");

const startEditingName = () => {
  resetForm({
    values: {
      fullName: user.value?.full_name || "",
    },
  });
  isEditingName.value = true;
};

const cancelEditingName = () => {
  isEditingName.value = false;
  resetForm({ values: { fullName: "" } });
};

const mutation = useMutation({
  mutationFn: (formData: FormData) => updateUserProfile(formData),
  onSuccess: async () => {
    await authStore.fetchMe();
    isEditingName.value = false;
  },
  onError: (e) => {
    handleError(e);
  },
});

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);
  mutation.mutate(formData);

  if (fileInput.value) fileInput.value.value = "";
};

const handleSaveName = handleSubmit((values) => {
  if (!values.fullName.trim() || values.fullName === user.value?.full_name) {
    cancelEditingName();
    return;
  }

  const formData = new FormData();
  formData.append("full_name", values.fullName.trim());
  mutation.mutate(formData);
});
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8 flex flex-col gap-4 justify-center">
    <Card class="w-full">
      <template #title>
        {{ t("settings.profile.title") }}
      </template>
      <template #content>
        <div v-if="user" class="flex flex-col md:flex-row gap-8 items-start">
          <div class="flex-shrink-0 relative group">
            <div
              class="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-sm relative cursor-pointer"
              @mouseenter="isHoveringAvatar = true"
              @mouseleave="isHoveringAvatar = false"
              @click="fileInput?.click()"
            >
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="user.full_name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500"
              >
                <i class="pi pi-user text-5xl md:text-7xl"></i>
              </div>

              <div
                class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-opacity duration-200"
                :class="isHoveringAvatar ? 'opacity-100' : 'opacity-0'"
              >
                <i
                  v-if="mutation.isPending.value"
                  class="pi pi-spinner pi-spin text-3xl"
                ></i>
                <template v-else>
                  <i class="pi pi-camera text-3xl mb-2"></i>
                  <span class="text-sm font-medium">{{
                    t("settings.profile.actions.uploadAvatar")
                  }}</span>
                </template>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
              :disabled="mutation.isPending.value"
            />
          </div>

          <div class="flex-grow flex flex-col gap-6 w-full">
            <div>
              <label
                class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                >{{ t("settings.profile.fullName") }}</label
              >
              <div class="flex items-center gap-3 w-full">
                <template v-if="isEditingName">
                  <form
                    @submit.prevent="handleSaveName"
                    class="flex items-start gap-3 w-full"
                  >
                    <div class="flex-grow">
                      <FieldInput
                        v-bind="fullNameAttrs"
                        v-model="fullName"
                        :placeholder="t('fields.fullName.placeholder')"
                        :error="errors.fullName"
                        :disabled="mutation.isPending.value"
                      />
                    </div>
                    <Button
                      type="submit"
                      icon="pi pi-check"
                      severity="success"
                      text
                      rounded
                      :loading="mutation.isPending.value"
                      :aria-label="t('settings.profile.actions.save')"
                    />
                    <Button
                      type="button"
                      icon="pi pi-times"
                      severity="secondary"
                      text
                      rounded
                      @click="cancelEditingName"
                      :disabled="mutation.isPending.value"
                      :aria-label="t('settings.profile.actions.cancel')"
                    />
                  </form>
                </template>
                <template v-else>
                  <p
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex-grow"
                  >
                    {{ user.full_name }}
                  </p>
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    rounded
                    @click="startEditingName"
                    :aria-label="t('settings.profile.actions.edit')"
                    :disabled="mutation.isPending.value"
                  />
                </template>
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                >{{ t("settings.profile.email") }}</label
              >
              <p
                class="text-lg text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center gap-2"
              >
                <i class="pi pi-envelope text-gray-400 dark:text-gray-500"></i>
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-center p-12">
          <i class="pi pi-spinner pi-spin text-4xl text-primary"></i>
        </div>
      </template>
    </Card>
    <Card>
      <template #title>{{ t("settings.preferences.title") }}</template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <Label>{{ t("settings.preferences.theme") }}</Label>
            <ThemeSwitcher />
          </div>
          <div class="flex items-center gap-2">
            <Label>{{ t("settings.preferences.language") }}</Label>
            <LanguageSelector />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
