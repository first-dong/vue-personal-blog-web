<template>
  <div v-if="prevArticle || nextArticle" class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <!-- Previous Article -->
    <NuxtLink
      v-if="prevArticle"
      :to="`/articles/${prevArticle.id}`"
      class="group flex flex-col gap-1 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all"
    >
      <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-1">
        <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
        上一篇
      </span>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 transition-colors">
        {{ prevArticle.title }}
      </span>
    </NuxtLink>
    <div v-else class="hidden sm:block"></div>

    <!-- Next Article -->
    <NuxtLink
      v-if="nextArticle"
      :to="`/articles/${nextArticle.id}`"
      class="group flex flex-col items-end gap-1 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all text-right"
    >
      <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-1">
        下一篇
        <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
      </span>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 transition-colors">
        {{ nextArticle.title }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'

interface Props {
  prevArticle: Article | null
  nextArticle: Article | null
}

defineProps<Props>()
</script>
