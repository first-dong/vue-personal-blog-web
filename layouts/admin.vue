<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-950">
    <!-- 侧边栏 -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
      ]"
    >
      <!-- 侧边栏 Logo -->
      <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <NuxtLink to="/admin" class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-code-bracket" class="text-white text-lg" />
          </div>
          <span
            v-if="sidebarOpen"
            class="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap"
          >
            后台管理
          </span>
        </NuxtLink>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul class="space-y-1 px-2">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActiveRoute(item.to)
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
              ]"
              :title="!sidebarOpen ? item.label : undefined"
            >
              <UIcon :name="item.icon" class="text-lg shrink-0" />
              <span v-if="sidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- 折叠按钮 -->
      <div class="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          class="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="toggleSidebar"
        >
          <UIcon
            :name="sidebarOpen ? 'i-heroicons-chevron-left' : 'i-heroicons-chevron-right'"
            class="text-lg"
          />
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div :class="['flex flex-col flex-1 min-w-0 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-16']">
      <!-- 顶部导航 -->
      <header class="sticky top-0 z-40 flex items-center h-16 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <!-- 面包屑 -->
        <div class="flex-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-home" class="text-base" />
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 dark:text-white font-medium">{{ currentPageTitle }}</span>
        </div>

        <!-- 右侧操作 -->
        <div class="flex items-center gap-3">
          <!-- 主题切换 -->
          <button
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="toggleTheme"
          >
            <UIcon
              :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              class="text-lg"
            />
          </button>

          <!-- 前台入口 -->
          <NuxtLink
            to="/"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="访问前台"
          >
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-lg" />
          </NuxtLink>

          <!-- 用户菜单 -->
          <div class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="userMenuOpen = !userMenuOpen"
            >
              <div class="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {{ userInitial }}
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300 max-w-24 truncate">
                {{ authStore.currentUser?.username || 'Admin' }}
              </span>
              <UIcon name="i-heroicons-chevron-down" class="text-xs text-gray-400" />
            </button>

            <!-- 下拉菜单 -->
            <div
              v-if="userMenuOpen"
              v-click-outside="() => (userMenuOpen = false)"
              class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50"
            >
              <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-500 dark:text-gray-400">已登录为</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ authStore.currentUser?.username }}
                </p>
              </div>
              <button
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                @click="handleLogout"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-base" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const colorMode = useColorMode()

// 侧边栏状态（从 localStorage 恢复）
const sidebarOpen = ref(true)

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('admin_sidebar_open')
    if (saved !== null) {
      sidebarOpen.value = saved === 'true'
    }
  }
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  if (import.meta.client) {
    localStorage.setItem('admin_sidebar_open', String(sidebarOpen.value))
  }
}

// 主题
const isDark = computed(() => colorMode.value === 'dark')
const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 用户菜单
const userMenuOpen = ref(false)
const userInitial = computed(() => {
  const name = authStore.currentUser?.username || 'A'
  return name.charAt(0).toUpperCase()
})

// 导航菜单
const navItems = [
  { to: '/admin', label: '仪表盘', icon: 'i-heroicons-squares-2x2' },
  { to: '/admin/articles', label: '文章管理', icon: 'i-heroicons-document-text' },
  { to: '/admin/categories', label: '分类管理', icon: 'i-heroicons-folder' },
  { to: '/admin/tags', label: '标签管理', icon: 'i-heroicons-tag' },
  { to: '/admin/danmaku', label: '弹幕管理', icon: 'i-heroicons-chat-bubble-left-right' },
  { to: '/admin/comments', label: '评论管理', icon: 'i-heroicons-chat-bubble-oval-left' },
]

const currentPageTitle = computed(() => {
  const matched = navItems.find(item => item.to === route.path)
  return matched?.label || '后台管理'
})

const isActiveRoute = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

// 退出登录
const handleLogout = async () => {
  userMenuOpen.value = false
  authStore.logout()
  await router.push('/admin/login')
}

// 自定义 v-click-outside 指令
const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler)
  },
}
</script>
