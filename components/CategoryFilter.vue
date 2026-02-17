<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <UIcon name="i-heroicons-folder" class="w-5 h-5 text-primary-500" />
      分类筛选
    </h3>

    <ul class="space-y-2">
      <!-- All Categories -->
      <li>
        <button
          class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group"
          :class="
            selectedCategoryId === null
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          "
          @click="handleCategoryClick(null)"
        >
          <span class="flex items-center gap-2">
            <UIcon
              :name="selectedCategoryId === null ? 'i-heroicons-check-circle-solid' : 'i-heroicons-circle'"
              class="w-4 h-4"
              :class="selectedCategoryId === null ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'"
            />
            全部
          </span>
          <span
            class="text-xs px-2 py-0.5 rounded-full"
            :class="
              selectedCategoryId === null
                ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            "
          >
            {{ totalCount }}
          </span>
        </button>
      </li>

      <!-- Category Items -->
      <li v-for="category in categories" :key="category.id">
        <button
          class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group"
          :class="
            selectedCategoryId === category.id
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          "
          @click="handleCategoryClick(category.id)"
        >
          <span class="flex items-center gap-2 flex-1 truncate">
            <UIcon
              :name="selectedCategoryId === category.id ? 'i-heroicons-check-circle-solid' : 'i-heroicons-circle'"
              class="w-4 h-4 flex-shrink-0"
              :class="
                selectedCategoryId === category.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
              "
            />
            <span class="truncate" :title="category.name">{{ category.name }}</span>
          </span>
          <span
            v-if="category.articleCount !== undefined"
            class="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
            :class="
              selectedCategoryId === category.id
                ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            "
          >
            {{ category.articleCount }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/blog'

interface Props {
  categories: Category[]
  modelValue?: number | null
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'change', categoryId: number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedCategoryId = computed({
  get: () => props.modelValue ?? null,
  set: (value) => emit('update:modelValue', value),
})

// Calculate total count
const totalCount = computed(() => {
  return props.categories.reduce((sum, category) => sum + (category.articleCount || 0), 0)
})

// Handle category click
const handleCategoryClick = (categoryId: number | null) => {
  selectedCategoryId.value = categoryId
  emit('change', categoryId)
}
</script>
