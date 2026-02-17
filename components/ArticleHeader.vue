<template>
  <header class="mb-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        首页
      </NuxtLink>
      <span>/</span>
      <NuxtLink to="/articles" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        文章
      </NuxtLink>
      <span>/</span>
      <span class="text-gray-700 dark:text-gray-300 truncate max-w-xs">{{ article.title }}</span>
    </nav>

    <!-- Category Badge -->
    <div v-if="article.categoryName" class="mb-3">
      <NuxtLink
        :to="`/articles?categoryId=${article.categoryId}`"
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
      >
        {{ article.categoryName }}
      </NuxtLink>
    </div>

    <!-- Title -->
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
      {{ article.title }}
    </h1>

    <!-- Summary -->
    <p v-if="article.summary" class="text-lg text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
      {{ article.summary }}
    </p>

    <!-- Meta Info -->
    <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <!-- Date -->
      <div class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
        <time :datetime="article.createdAt">{{ formatDate(article.createdAt) }}</time>
      </div>

      <!-- Updated -->
      <div v-if="article.updatedAt && article.updatedAt !== article.createdAt" class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
        <span>更新于 {{ formatDate(article.updatedAt) }}</span>
      </div>

      <!-- View Count -->
      <div class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-eye" class="w-4 h-4" />
        <span>{{ article.viewCount }} 阅读</span>
      </div>

      <!-- Like Count -->
      <div class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-heart" class="w-4 h-4" />
        <span>{{ article.likeCount }} 点赞</span>
      </div>

      <!-- Read Time Estimate -->
      <div class="flex items-center gap-1.5">
        <UIcon name="i-heroicons-clock" class="w-4 h-4" />
        <span>约 {{ readTime }} 分钟阅读</span>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
      <NuxtLink
        v-for="tag in article.tags"
        :key="tag.id"
        :to="`/articles?tagId=${tag.id}`"
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
        :style="{
          backgroundColor: tag.color ? tag.color + '20' : '#6b728020',
          color: tag.color || '#6b7280',
          borderColor: tag.color ? tag.color + '40' : '#6b728040',
          border: '1px solid',
        }"
      >
        # {{ tag.name }}
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'

interface Props {
  article: Article
}

const props = defineProps<Props>()

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Estimate read time based on content length
const readTime = computed(() => {
  const content = props.article.content || props.article.summary || ''
  const wordsPerMinute = 300
  const charCount = content.length
  return Math.max(1, Math.ceil(charCount / wordsPerMinute))
})
</script>
