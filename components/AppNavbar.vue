<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo / 站点名称 -->
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-500">
          <UIcon name="i-heroicons-code-bracket" class="w-6 h-6" />
          <span>{{ appName }}</span>
        </NuxtLink>

        <!-- 桌面端导航 -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{
              'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20':
                $route.path === item.path,
            }"
          >
            <UIcon :name="item.icon" class="w-4 h-4 inline-block mr-1" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-2">
          <!-- 主题切换按钮 -->
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          />

          <!-- 搜索按钮（桌面端） -->
          <UButton
            icon="i-heroicons-magnifying-glass"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="搜索"
            class="hidden md:flex"
            @click="$emit('search')"
          />

          <!-- 移动端菜单按钮 -->
          <UButton
            :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            color="neutral"
            variant="ghost"
            size="sm"
            class="md:hidden"
            aria-label="菜单"
            @click="toggleMobileMenu"
          />
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <nav class="px-4 py-3 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{
              'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20':
                $route.path === item.path,
            }"
            @click="mobileMenuOpen = false"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  search: []
}>()

const config = useRuntimeConfig()
const appName = config.public.appName || 'PersonalBlog'

const { isDark, toggleTheme } = useTheme()
const mobileMenuOpen = ref(false)

const navItems = [
  { label: '首页', path: '/', icon: 'i-heroicons-home' },
  { label: '文章', path: '/articles', icon: 'i-heroicons-document-text' },
  { label: '关于', path: '/about', icon: 'i-heroicons-user' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 路由切换时关闭移动端菜单
const route = useRoute()
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
