<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuthService } from "~/services/auth.service";
import { ROUTES } from "~/constants/routes";
import { loginSchema, type LoginSchema } from "~/types/schemas/loginSchema";
import { useMutation } from "@tanstack/vue-query";
import { useApiErrorHandler } from "~/composables/useApiErrorHandler";

definePageMeta({ layout: "auth" });

const { t } = useI18n();
const localePath = useLocalePath();
const { login } = useAuthService();
const { setToken, fetchMe } = useAuthStore();
const { handleError } = useApiErrorHandler();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: "",
    password: "",
  },
});
const useAdaptive = useAdaptiveField<LoginSchema>(defineField, errors);

const mutation = useMutation({
  mutationFn: (values: { email: string; password: string }) =>
    login({ email: values.email, password: values.password }),
  onSuccess: async (response) => {
    setToken(response.token);
    await fetchMe();
    await navigateTo(localePath(ROUTES.TASKS));
  },
  onError: (e) => {
    handleError(e);
  },
});

const [email, emailAttrs] = useAdaptive("email");
const [password, passwordAttrs] = useAdaptive("password");

const handleLogin = handleSubmit((values) => {
  mutation.mutate(values);
});
</script>

<template>
  <AuthCard :title="t('auth.login.title')">
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <AuthFormField
        key="email"
        v-bind="emailAttrs"
        v-model="email"
        :placeholder="t('fields.email.placeholder')"
        :error="errors.email"
      />
      <AuthFormField
        key="password"
        v-bind="passwordAttrs"
        v-model="password"
        :placeholder="t('fields.password.placeholder')"
        :error="errors.password"
        type="password"
        :feedback="false"
      />
      <Button
        type="submit"
        :label="t('auth.login.submit')"
        :loading="mutation.isPending.value"
        class="mt-4"
      />
      <p class="flex gap-1 justify-center">
        <i18n-t keypath="auth.login.dontHaveAccount">
          <template #link>
            <NuxtLink
              :to="localePath(ROUTES.REGISTER)"
              class="text-blue-600 hover:underline font-medium"
            >
              {{ t("auth.login.link") }}
            </NuxtLink>
          </template>
        </i18n-t>
      </p>
    </form>
  </AuthCard>
</template>
