<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 站点信息 -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 font-bold text-lg text-primary-500">
            <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
            <span>{{ appName }}</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            分享技术与生活，记录成长历程。
          </p>
          <div class="flex items-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              :aria-label="social.name"
            >
              <UIcon :name="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- 友情链接 -->
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-800 dark:text-gray-200">友情链接</h3>
          <ul class="space-y-2">
            <li v-for="link in friendLinks" :key="link.name">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 快速导航 -->
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-800 dark:text-gray-200">快速导航</h3>
          <ul class="space-y-2">
            <li v-for="nav in quickNavs" :key="nav.path">
              <NuxtLink
                :to="nav.path"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {{ nav.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div
        class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <p>© {{ currentYear }} {{ appName }}. All rights reserved.</p>
        <p v-if="icpNumber">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            {{ icpNumber }}
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName || 'PersonalBlog'
const currentYear = new Date().getFullYear()

// ICP 备案号（从环境变量读取）
const icpNumber = config.public.icpNumber || ''

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com', icon: 'i-simple-icons-github' },
]

const friendLinks = [
  { name: 'Vue.js', url: 'https://vuejs.org' },
  { name: 'Nuxt.js', url: 'https://nuxt.com' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
]

const quickNavs = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
  { label: '关于', path: '/about' },
]
</script>
