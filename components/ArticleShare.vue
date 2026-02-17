<template>
  <div class="flex flex-col items-center gap-3">
    <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">分享文章</p>
    <div class="flex items-center gap-2">
      <!-- Copy Link -->
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
        @click="copyLink"
      >
        <UIcon :name="copied ? 'i-heroicons-check' : 'i-heroicons-link'" class="w-4 h-4" />
        {{ copied ? '已复制' : '复制链接' }}
      </button>

      <!-- Share to Twitter/X -->
      <a
        :href="twitterUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-all"
        title="分享到 Twitter/X"
      >
        <UIcon name="i-simple-icons-x" class="w-4 h-4" />
        <span class="hidden sm:inline">Twitter</span>
      </a>

      <!-- Share to Weibo -->
      <a
        :href="weiboUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 transition-all"
        title="分享到微博"
      >
        <UIcon name="i-simple-icons-sinaweibo" class="w-4 h-4" />
        <span class="hidden sm:inline">微博</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'

interface Props {
  article: Article
}

const props = defineProps<Props>()

const copied = ref(false)

// Current page URL
const currentUrl = computed(() => {
  if (import.meta.client) {
    return window.location.href
  }
  return ''
})

// Twitter share URL
const twitterUrl = computed(() => {
  const text = encodeURIComponent(`${props.article.title}`)
  const url = encodeURIComponent(currentUrl.value)
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
})

// Weibo share URL
const weiboUrl = computed(() => {
  const title = encodeURIComponent(props.article.title)
  const url = encodeURIComponent(currentUrl.value)
  return `https://service.weibo.com/share/share.php?title=${title}&url=${url}`
})

// Copy link to clipboard
const copyLink = async () => {
  if (copied.value) return
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback: select text
    const textarea = document.createElement('textarea')
    textarea.value = currentUrl.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
