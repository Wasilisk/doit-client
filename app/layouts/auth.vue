<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image: url(&quot;/images/auth-bg.jpg&quot;)"
  >
    <div class="min-h-screen flex items-center justify-center p-4 bg-black/20">
      <div class="w-full max-w-md">
        <slot />
      </div>
      <Toast />
      <LanguageSelector class="absolute top-4 right-4" />
    </div>
  </div>
</template>
