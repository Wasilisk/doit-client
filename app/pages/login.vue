<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useAuthService } from '~/services/auth.service'
import { ROUTES } from '~/constants/routes'
import { loginSchema, type LoginSchema } from '~/types/schemas/loginSchema'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const localePath = useLocalePath()
const { login } = useAuthService()
const { setToken } = useAuthStore()

const { handleSubmit, errors, defineField } = useForm({
    validationSchema: loginSchema,
    initialValues: {
        email: '',
        password: '',
    },
})
const useAdaptive = useAdaptiveField<LoginSchema>(defineField, errors)

const { loading, execute } = useApiRequestHandler()

const [email, emailAttrs] = useAdaptive('email')
const [password, passwordAttrs] = useAdaptive('password')

const handleLogin = handleSubmit(async (values) => {
    await execute(async () => {
        const response = await login({ email: values.email, password: values.password })
        console.log("response", response)
        setToken(response.token)
        await navigateTo(localePath(ROUTES.TASKS))
    })
})
</script>

<template>
    <AuthCard :title="t('auth.login.title')">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <AuthFormField key="email" v-bind="emailAttrs" v-model="email" :placeholder="t('fields.email.placeholder')"
                :error="errors.email" />
            <AuthFormField key="password" v-bind="passwordAttrs" v-model="password"
                :placeholder="t('fields.password.placeholder')" :error="errors.password" type="password"
                :feedback="false" />
            <Button type="submit" :label="t('auth.login.submit')" :loading="loading" class="mt-4" />
            <p class="flex gap-1 justify-center">
                <i18n-t keypath="auth.login.dontHaveAccount">
                    <template #link>
                        <NuxtLink :to="localePath(ROUTES.REGISTER)" class="text-blue-600 hover:underline font-medium">
                            {{ t('auth.login.link') }}
                        </NuxtLink>
                    </template>
                </i18n-t>
            </p>
        </form>
    </AuthCard>
</template>