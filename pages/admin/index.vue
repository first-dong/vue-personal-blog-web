<template>
  <div>
    <!-- 欢迎信息 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        欢迎回来，{{ authStore.currentUser?.username || 'Admin' }} 👋
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ currentDate }} · 今天也要加油哦！
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 flex items-center gap-4"
      >
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', stat.bgColor]">
          <UIcon :name="stat.icon" :class="['text-2xl', stat.iconColor]" />
        </div>
        <div class="min-w-0">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.loading ? '...' : stat.value }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- 快捷操作面板 -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">快捷操作</h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors group"
          >
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', action.bgColor]">
              <UIcon :name="action.icon" :class="['text-lg', action.iconColor]" />
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-700 dark:group-hover:text-primary-300">
              {{ action.label }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">系统信息</h2>
        <div class="space-y-3">
          <div
            v-for="info in systemInfo"
            :key="info.label"
            class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ info.label }}</span>
            <span :class="['text-sm font-medium', info.valueClass || 'text-gray-900 dark:text-white']">
              {{ info.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近文章 -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">最近文章</h2>
        <NuxtLink
          to="/admin/articles"
          class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          查看全部 →
        </NuxtLink>
      </div>

      <div v-if="recentArticlesLoading" class="space-y-3">
        <div v-for="n in 3" :key="n" class="animate-pulse flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0" />
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
            <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="recentArticles.length === 0" class="text-center py-8 text-gray-400">
        <UIcon name="i-heroicons-document-text" class="text-4xl mb-2" />
        <p class="text-sm">暂无文章</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="article in recentArticles"
          :key="article.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-document-text" class="text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ article.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(article.createdAt) }}
              <span :class="['ml-2 px-1.5 py-0.5 rounded text-xs', article.status === 1 ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400']">
                {{ article.status === 1 ? '已发布' : '草稿' }}
              </span>
            </p>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-400 shrink-0">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-eye" />
              {{ article.viewCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// 使用 admin 布局和路由守卫
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const authStore = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// 统计数据
const stats = ref([
  {
    label: '文章总数',
    value: 0,
    icon: 'i-heroicons-document-text',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
    loading: true,
  },
  {
    label: '总浏览量',
    value: 0,
    icon: 'i-heroicons-eye',
    bgColor: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
    loading: true,
  },
  {
    label: '弹幕数量',
    value: 0,
    icon: 'i-heroicons-chat-bubble-left-right',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400',
    loading: true,
  },
  {
    label: '评论数量',
    value: 0,
    icon: 'i-heroicons-chat-bubble-oval-left',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
    loading: true,
  },
])

// 快捷操作
const quickActions = [
  {
    to: '/admin/articles/create',
    label: '写新文章',
    icon: 'i-heroicons-pencil-square',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    to: '/admin/articles',
    label: '管理文章',
    icon: 'i-heroicons-document-text',
    bgColor: 'bg-green-100 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    to: '/admin/danmaku',
    label: '审核弹幕',
    icon: 'i-heroicons-chat-bubble-left-right',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    to: '/admin/comments',
    label: '管理评论',
    icon: 'i-heroicons-chat-bubble-oval-left',
    bgColor: 'bg-orange-100 dark:bg-orange-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
]

// 系统信息
const systemInfo = [
  { label: '前端框架', value: 'Nuxt 4 + Vue 3.5' },
  { label: '后端框架', value: 'Spring Boot 3.x' },
  { label: '数据库', value: 'MySQL 8.0' },
  { label: '登录用户', value: authStore.currentUser?.username || '-', valueClass: 'text-primary-600 dark:text-primary-400' },
  { label: '用户角色', value: authStore.currentUser?.role || '-', valueClass: 'text-green-600 dark:text-green-400' },
]

// 最近文章
interface Article {
  id: number
  title: string
  status: number
  viewCount: number
  createdAt: string
}
const recentArticles = ref<Article[]>([])
const recentArticlesLoading = ref(true)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// 加载统计数据和最近文章（后端未就绪时静默降级）
onMounted(async () => {
  authStore.restoreFromStorage()

  const token = authStore.token

  // 加载文章列表（最近5篇）
  try {
    const res = await $fetch<{
      code: number
      data: { records: Article[]; total: number }
    }>(`${apiBase}/api/articles?page=1&size=5`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (res.code === 200) {
      recentArticles.value = res.data.records || []
      stats.value[0].value = res.data.total || 0
      stats.value[1].value = recentArticles.value.reduce((sum, a) => sum + (a.viewCount || 0), 0)
    }
  }
  catch {
    // 后端不可用时静默忽略
  }
  finally {
    recentArticlesLoading.value = false
    stats.value[0].loading = false
    stats.value[1].loading = false
    stats.value[2].loading = false
    stats.value[3].loading = false
  }
})
</script>
