<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- 导航栏 -->
    <AppNavbar @search="handleSearch" />

    <!-- 主内容区 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 返回顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
const handleSearch = () => {
  // TODO: 实现搜索功能（留给后续功能）
  console.log('Search clicked')
}
</script>
