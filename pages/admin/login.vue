<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
    </div>

    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md mx-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mb-4 shadow-lg">
            <UIcon name="i-heroicons-code-bracket" class="text-white text-3xl" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">后台管理</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">请输入管理员账号登录</p>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMsg"
          class="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
        >
          <UIcon name="i-heroicons-exclamation-circle" class="shrink-0" />
          <span>{{ errorMsg }}</span>
        </div>

        <!-- 登录表单 -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- 用户名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <div class="relative">
              <UIcon
                name="i-heroicons-user"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"
              />
              <input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                autocomplete="username"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
              />
            </div>
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <div class="relative">
              <UIcon
                name="i-heroicons-lock-closed"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"
              />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                autocomplete="current-password"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="showPassword = !showPassword"
              >
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="text-base" />
              </button>
            </div>
          </div>

          <!-- 记住登录 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">记住登录状态</span>
            </label>
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 底部信息 -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">
            ← 返回前台
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// 不使用 admin 布局
definePageMeta({
  layout: false,
})

const router = useRouter()
const authStore = useAuthStore()

// 如果已登录，跳转到后台首页
onMounted(() => {
  authStore.restoreFromStorage()
  if (authStore.isLoggedIn && authStore.isAdmin) {
    router.replace('/admin')
  }
})

const form = reactive({
  username: '',
  password: '',
})
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!form.username || !form.password) return

  loading.value = true
  errorMsg.value = ''

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase

    const response = await $fetch<{
      code: number
      message: string
      data: {
        token: string
        refreshToken: string
        user: {
          id: number
          username: string
          email: string
          avatar: string
          role: string
        }
      }
    }>(`${apiBase}/api/auth/login`, {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password,
      },
    })

    if (response.code === 200) {
      const { token, refreshToken, user } = response.data

      if (user.role !== 'ADMIN') {
        errorMsg.value = '权限不足，仅管理员可登录后台'
        return
      }

      authStore.setTokens(token, refreshToken)
      authStore.setUser(user)

      // 记住登录：可扩展为 sessionStorage vs localStorage 策略
      if (rememberMe.value && import.meta.client) {
        localStorage.setItem('admin_remember', 'true')
      }

      await router.push('/admin')
    }
    else {
      errorMsg.value = response.message || '登录失败，请检查用户名和密码'
    }
  }
  catch (err: unknown) {
    if (err && typeof err === 'object' && 'data' in err) {
      const apiErr = err as { data?: { message?: string } }
      errorMsg.value = apiErr.data?.message || '登录失败，请检查用户名和密码'
    }
    else {
      errorMsg.value = '网络错误，请稍后重试'
    }
  }
  finally {
    loading.value = false
  }
}
</script>
