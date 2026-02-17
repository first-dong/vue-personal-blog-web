import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  // 仅在客户端执行（避免 SSR 访问 localStorage 报错）
  if (import.meta.server) return

  const authStore = useAuthStore()

  // 恢复本地存储的登录状态
  authStore.restoreFromStorage()

  // 登录页不需要守卫
  if (to.path === '/admin/login') {
    // 如果已登录，跳转到后台首页
    if (authStore.isLoggedIn && authStore.isAdmin) {
      return navigateTo('/admin')
    }
    return
  }

  // 其他后台页面：检查是否已登录
  if (!authStore.isLoggedIn) {
    return navigateTo('/admin/login')
  }

  // 检查是否是管理员
  if (!authStore.isAdmin) {
    return navigateTo('/admin/login')
  }
})
