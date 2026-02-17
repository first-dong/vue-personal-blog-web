<template>
  <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
      <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-500" />
      相关文章
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/articles/${article.id}`"
        class="group flex flex-col gap-2 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all"
      >
        <!-- Cover Image -->
        <div class="h-32 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          <img
            v-if="article.coverImage"
            :src="article.coverImage"
            :alt="article.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
            :style="{ background: gradientFor(article.id) }"
          >
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-white/60" />
          </div>
        </div>

        <!-- Title -->
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 transition-colors">
          {{ article.title }}
        </h4>

        <!-- Meta -->
        <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-calendar-days" class="w-3 h-3" />
            {{ formatDate(article.createdAt) }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-eye" class="w-3 h-3" />
            {{ article.viewCount }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'

interface Props {
  articles: Article[]
}

defineProps<Props>()

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

const gradientFor = (id: number): string => {
  return gradients[id % gradients.length]
}
</script>
