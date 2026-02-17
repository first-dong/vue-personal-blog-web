<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <UIcon name="i-heroicons-tag" class="w-5 h-5 text-primary-500" />
      热门标签
    </h3>

    <div v-if="tags.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <UIcon name="i-heroicons-tag" class="w-12 h-12 mx-auto mb-2 opacity-30" />
      <p class="text-sm">暂无标签</p>
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="tag in sortedTags"
        :key="tag.id"
        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
        :style="{
          backgroundColor: tag.color + '20',
          color: tag.color,
          borderWidth: '1px',
          borderColor: tag.color + '40',
        }"
        @click="handleTagClick(tag.id)"
      >
        <span>#{{ tag.name }}</span>
        <span v-if="tag.articleCount !== undefined" class="ml-1.5 text-xs opacity-75">
          ({{ tag.articleCount }})
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/types/blog'

interface Props {
  tags: Tag[]
}

interface Emits {
  (e: 'tag-click', tagId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Sort tags by article count (descending)
const sortedTags = computed(() => {
  return [...props.tags].sort((a, b) => {
    const countA = a.articleCount || 0
    const countB = b.articleCount || 0
    return countB - countA
  })
})

// Handle tag click
const handleTagClick = (tagId: number) => {
  emit('tag-click', tagId)
}
</script>
