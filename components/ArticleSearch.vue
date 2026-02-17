<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <!-- Search Input -->
    <div class="relative">
      <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
      <input
        v-model="inputValue"
        type="text"
        placeholder="搜索文章..."
        class="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        @input="handleInput"
        @keydown.enter="handleEnter"
        @keydown.escape="closeSuggestions"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <!-- Clear Button -->
      <button
        v-if="inputValue"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        @click="clearInput"
      >
        <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
      </button>
    </div>

    <!-- Search Suggestions Dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <ul>
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.id"
          class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
          :class="{ 'bg-gray-50 dark:bg-gray-700/50': selectedIndex === index }"
          @mousedown.prevent="selectSuggestion(suggestion)"
        >
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ suggestion.title }}</p>
            <p v-if="suggestion.summary" class="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {{ suggestion.summary }}
            </p>
          </div>
        </li>
      </ul>
      <div class="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          按 Enter 搜索全部结果，找到 {{ suggestions.length }} 条建议
        </p>
      </div>
    </div>

    <!-- No Suggestions -->
    <div
      v-if="showSuggestions && suggestions.length === 0 && inputValue && !isSearching"
      class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <div class="px-4 py-6 text-center">
        <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
        <p class="text-gray-500 dark:text-gray-400">无搜索建议</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'
import type { ApiResponse } from '~/types/api'

interface SearchSuggestion {
  id: number
  title: string
  summary?: string
}

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', keyword: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const api = useApi()

const inputValue = ref(props.modelValue || '')
const suggestions = ref<SearchSuggestion[]>([])
const showSuggestions = ref(false)
const isSearching = ref(false)
const selectedIndex = ref(-1)
let searchTimer: ReturnType<typeof setTimeout> | null = null

// Fetch search suggestions with debounce
const fetchSuggestions = async (keyword: string) => {
  if (!keyword.trim()) {
    suggestions.value = []
    return
  }

  isSearching.value = true
  try {
    const response = await api.get<ApiResponse<{ records: Article[] }>>('/api/articles/search', {
      params: { keyword, size: 5 },
    })

    if (response.data.code === 200 && response.data.data) {
      suggestions.value = response.data.data.records.map((article: Article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch search suggestions:', error)
    suggestions.value = []
  } finally {
    isSearching.value = false
  }
}

// Handle input with debounce
const handleInput = () => {
  emit('update:modelValue', inputValue.value)
  selectedIndex.value = -1

  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  if (!inputValue.value.trim()) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  showSuggestions.value = true
  searchTimer = setTimeout(() => {
    fetchSuggestions(inputValue.value)
  }, 300)
}

// Handle enter key
const handleEnter = () => {
  closeSuggestions()
  emit('search', inputValue.value)
}

// Handle blur
const handleBlur = () => {
  setTimeout(() => {
    closeSuggestions()
  }, 150)
}

// Handle focus
const handleFocus = () => {
  if (inputValue.value.trim() && suggestions.value.length > 0) {
    showSuggestions.value = true
  }
}

// Select suggestion
const selectSuggestion = (suggestion: SearchSuggestion) => {
  closeSuggestions()
  router.push(`/articles/${suggestion.id}`)
}

// Clear input
const clearInput = () => {
  inputValue.value = ''
  suggestions.value = []
  showSuggestions.value = false
  emit('update:modelValue', '')
  emit('search', '')
}

// Close suggestions
const closeSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
}

// Watch for external model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== inputValue.value) {
      inputValue.value = newValue || ''
    }
  },
)
</script>
