<template>
  <article
    class="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
    @click="navigateToArticle"
  >
    <div class="flex flex-col md:flex-row">
      <!-- Cover Image -->
      <div class="relative md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
        <img
          v-if="article.coverImage"
          :src="article.coverImage"
          :alt="article.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-photo" class="w-16 h-16 text-white opacity-50" />
        </div>
        <!-- View Count Badge -->
        <div
          class="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
        >
          <UIcon name="i-heroicons-eye" class="w-4 h-4" />
          {{ formatCount(article.viewCount) }}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 p-6 flex flex-col">
        <!-- Category & Date -->
        <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span class="inline-flex items-center gap-1">
            <UIcon name="i-heroicons-folder" class="w-4 h-4" />
            {{ article.categoryName }}
          </span>
          <span class="text-gray-300 dark:text-gray-600">•</span>
          <time :datetime="article.createdAt" class="inline-flex items-center gap-1">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            {{ formatDate(article.createdAt) }}
          </time>
        </div>

        <!-- Title -->
        <h2
          class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
        >
          {{ article.title }}
        </h2>

        <!-- Summary -->
        <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
          {{ article.summary }}
        </p>

        <!-- Tags & Like Count -->
        <div class="flex items-center justify-between mt-auto">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag.id"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors"
              :style="{
                backgroundColor: tag.color + '20',
                color: tag.color,
              }"
            >
              #{{ tag.name }}
            </span>
            <span
              v-if="article.tags.length > 3"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              +{{ article.tags.length - 3 }}
            </span>
          </div>

          <!-- Like Count -->
          <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
            <UIcon name="i-heroicons-heart" class="w-4 h-4" />
            {{ formatCount(article.likeCount) }}
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'

interface Props {
  article: Article
}

const props = defineProps<Props>()

const router = useRouter()

// Navigate to article detail
const navigateToArticle = () => {
  router.push(`/articles/${props.article.id}`)
}

// Format count (e.g., 1234 -> 1.2k)
const formatCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

// Format date (e.g., 2024-01-15T10:30:00 -> 2024年1月15日)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}
</script>
