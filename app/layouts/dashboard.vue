<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardNav } from '~/composables/useDashboardNav'
import Menu from 'primevue/menu'

const { navLinks, userInitials, fullAvatarUrl, handleLogout, authStore } = useDashboardNav()

const menu = ref<InstanceType<typeof Menu> | null>(null)

const toggleMenu = (event: Event) => {
    menu.value?.toggle(event)
}

const menuItems = computed(() => {
    const items = navLinks.value.map(link => ({
        label: link.label,
        icon: link.icon,
        command: () => navigateTo(link.to)
    }))
    
    items.push({
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        command: handleLogout
    })
    
    return items
})
</script>

<template>
    <div class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-amber-50 via-orange-50 to-green-50">
        <header class="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
            <h1 class="text-3xl font-bold">
                DOIT<span class="text-red-500">.</span>
            </h1>
            
            <div class="flex items-center gap-2 cursor-pointer" @click="toggleMenu" aria-haspopup="true" aria-controls="mobile_user_menu">
                <Avatar
                    v-if="fullAvatarUrl"
                    :image="fullAvatarUrl"
                    size="normal"
                    shape="circle"
                    image-class="object-cover"
                />
                <Avatar
                    v-else
                    :label="userInitials"
                    size="normal"
                    shape="circle"
                    class="bg-amber-100 text-amber-800"
                />
                <i class="pi pi-angle-down text-gray-500 text-sm"></i>
            </div>
            
            <Menu ref="menu" id="mobile_user_menu" :model="menuItems" :popup="true" class="w-full md:w-56" />
        </header>
        <DashboardSidebar />

        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
            <slot />
        </main>
        <Toast />
    </div>
</template>
