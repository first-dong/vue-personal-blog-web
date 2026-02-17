<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">PersonalBlog</h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">欢迎来到我的个人博客</p>
      <div class="mt-8 flex gap-4 justify-center">
        <UButton to="/articles" color="primary" size="lg">
          浏览文章
        </UButton>
        <UButton to="/about" variant="outline" size="lg">
          关于我
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
