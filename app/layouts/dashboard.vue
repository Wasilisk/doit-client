<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900"
  >
    <DashboardMobileHeader />
    <DashboardSidebar />

    <main class="flex-1 p-4 md:p-6 overflow-y-auto">
      <slot />
    </main>
    <Toast />
  </div>
</template>
