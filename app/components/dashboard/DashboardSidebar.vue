<script setup lang="ts">
import { ROUTES } from '~/constants/routes'

const localePath = useLocalePath()
const authStore = useAuthStore()

const navLinks = computed(() => [
    { label: 'Profile', icon: 'pi pi-user', to: localePath(ROUTES.PROFILE) },
    { label: 'My Tasks', icon: 'pi pi-check-square', to: localePath(ROUTES.TASKS) },
    { label: 'Tags', icon: 'pi pi-tag', to: localePath(ROUTES.TAGS) },
    { label: 'Deleted Items', icon: 'pi pi-trash', to: localePath(ROUTES.TASKS_DELETED) },
])

const userInitials = computed(() => {
    const name = authStore.user?.full_name || ''
    return name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const fullAvatarUrl = computed(() => {
    if (!authStore.user?.avatar_url) return null
    const baseUrl = useRuntimeConfig().public.apiUrl.replace(/\/$/, '')
    const path = authStore.user.avatar_url.startsWith('/') 
        ? authStore.user.avatar_url 
        : `/${authStore.user.avatar_url}`
    return `${baseUrl}${path}`
})

const handleLogout = async () => {
    authStore.logout()
    await navigateTo(localePath(ROUTES.LOGIN))
}
</script>

<template>
    <aside class="w-[260px] min-h-screen bg-white flex flex-col border-r border-gray-100">
        <div class="px-6 pt-6 pb-4">
            <h1 class="text-4xl font-bold">
                DOIT<span class="text-red-500">.</span>
            </h1>
        </div>

        <Divider class="my-0" />

        <div class="px-6 py-4 flex items-center gap-3" v-if="!authStore.isFetchingUser && authStore.user">
            <Avatar
                v-if="fullAvatarUrl"
                :image="fullAvatarUrl"
                size="large"
                shape="circle"
            />
            <Avatar
                v-else
                :label="userInitials"
                size="large"
                shape="circle"
                class="bg-amber-100 text-amber-800"
            />
            <div class="min-w-0">
                <p class="font-semibold text-sm text-gray-900 truncate">
                    {{ authStore.user.full_name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                    {{ authStore.user.email }}
                </p>
            </div>
        </div>

        <div class="px-6 py-4 flex items-center gap-3" v-else>
            <Skeleton shape="circle" size="3rem" />
            <div class="flex flex-col gap-2 flex-1">
                <Skeleton width="70%" height="0.75rem" />
                <Skeleton width="90%" height="0.625rem" />
            </div>
        </div>

        <Divider class="my-0" />

        <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
            <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-amber-50 hover:text-amber-900"
                exact-active-class="bg-amber-100 text-amber-900 font-semibold"
            >
                <i :class="link.icon" class="text-base"></i>
                <span>{{ link.label }}</span>
            </NuxtLink>
        </nav>

        <div class="px-3 pb-6">
            <Divider class="mt-0 mb-3" />
            <button
                @click="handleLogout"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 w-full cursor-pointer"
            >
                <i class="pi pi-sign-out text-base"></i>
                <span>Log Out</span>
            </button>
        </div>
    </aside>
</template>
