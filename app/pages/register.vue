<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuthService } from "~/services/auth.service";
import { ROUTES } from "~/constants/routes";
import {
  registerSchema,
  type RegisterSchema,
} from "~/types/schemas/registerSchema";
import { useMutation } from "@tanstack/vue-query";
import { useApiErrorHandler } from "~/composables/useApiErrorHandler";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const { register } = useAuthService();
const { setToken } = useAuthStore();
const { handleError } = useApiErrorHandler();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  },
});

const mutation = useMutation({
  mutationFn: (values: { email: string; fullName: string; password: string }) =>
    register({
      email: values.email,
      full_name: values.fullName,
      password: values.password,
    }),
  onSuccess: async (response) => {
    setToken(response.token);
    await navigateTo(localePath(ROUTES.TASKS));
  },
  onError: (e) => {
    handleError(e);
  },
});

const useAdaptive = useAdaptiveField<RegisterSchema>(defineField, errors);

const [email, emailAttrs] = useAdaptive("email");
const [fullName, fullNameAttrs] = useAdaptive("fullName");
const [password, passwordAttrs] = useAdaptive("password");
const [confirmPassword, confirmPasswordAttrs] = useAdaptive("confirmPassword");

const handleRegister = handleSubmit((values) => {
  mutation.mutate(values);
});
</script>

<template>
  <AuthCard :title="t('auth.register.title')">
    <form @submit.prevent="handleRegister" class="flex flex-col gap-2">
      <FieldInput
        key="email"
        v-bind="emailAttrs"
        v-model="email"
        :placeholder="t('fields.email.placeholder')"
        :error="errors.email"
      />
      <FieldInput
        key="fullName"
        v-bind="fullNameAttrs"
        v-model="fullName"
        :placeholder="t('fields.fullName.placeholder')"
        :error="errors.fullName"
      />
      <FieldPassword
        key="password"
        v-bind="passwordAttrs"
        v-model="password"
        :placeholder="t('fields.password.placeholder')"
        :error="errors.password"
      />
      <FieldPassword
        key="confirmPassword"
        v-bind="confirmPasswordAttrs"
        v-model="confirmPassword"
        :placeholder="t('fields.confirmPassword.placeholder')"
        :error="errors.confirmPassword"
        :feedback="false"
      />

      <Button
        type="submit"
        :label="t('auth.register.submit')"
        :loading="mutation.isPending.value"
        class="mt-4"
      />
      <p class="flex gap-1 justify-center">
        <i18n-t keypath="auth.register.alreadyHaveAccount">
          <template #link>
            <NuxtLink
              :to="localePath(ROUTES.LOGIN)"
              class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {{ t("auth.register.link") }}
            </NuxtLink>
          </template>
        </i18n-t>
      </p>
    </form>
  </AuthCard>
</template>
