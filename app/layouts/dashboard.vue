<template>
    <div class="min-h-screen flex bg-gradient-to-br from-amber-50 via-orange-50 to-green-50">
        <DashboardSidebar />
        <main class="flex-1 p-6 overflow-y-auto">
            <slot />
        </main>
        <Toast />
    </div>
</template>
