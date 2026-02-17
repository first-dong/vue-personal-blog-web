<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Search Bar -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6 max-w-7xl">
        <ArticleSearch v-model="searchKeyword" @search="handleSearch" />
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <aside class="lg:col-span-1 space-y-6">
          <!-- Category Filter -->
          <CategoryFilter v-model="selectedCategory" :categories="categories" @change="handleCategoryChange" />

          <!-- Tag Cloud -->
          <TagCloud :tags="tags" @tag-click="handleTagClick" />
        </aside>

        <!-- Article List -->
        <main class="lg:col-span-3">
          <!-- Loading Skeleton -->
          <div v-if="loading && articles.length === 0" class="space-y-6">
            <ArticleCardSkeleton v-for="i in 6" :key="i" />
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && articles.length === 0">
            <ArticleEmptyState :keyword="searchKeyword" @reset="handleReset" />
          </div>

          <!-- Article Cards -->
          <div v-else class="space-y-6">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
          </div>

          <!-- Load More / Pagination -->
          <div v-if="hasMore && articles.length > 0" class="mt-8 text-center">
            <UButton
              :loading="loading"
              :disabled="loading"
              size="lg"
              variant="outline"
              @click="loadMore"
            >
              {{ loading ? '加载中...' : '加载更多' }}
            </UButton>
          </div>

          <!-- Loading More Indicator -->
          <div v-if="loading && articles.length > 0" class="mt-8 text-center">
            <div class="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin"></div>
              <span>加载中...</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article, Category, Tag, ArticleQuery } from '~/types/blog'
import type { ApiResponse } from '~/types/api'

// Meta
definePageMeta({
  layout: 'default',
})

// SEO
useHead({
  title: '文章列表',
  meta: [
    { name: 'description', content: '浏览所有文章，包含技术分享、学习笔记、项目经验等内容' },
  ],
})

// State
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 12
const selectedCategory = ref<number | null>(null)
const selectedTag = ref<number | null>(null)
const searchKeyword = ref('')

// API
const api = useApi()

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get<ApiResponse<Category[]>>('/api/categories')
    if (response.data.code === 200) {
      categories.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Fetch tags
const fetchTags = async () => {
  try {
    const response = await api.get<ApiResponse<Tag[]>>('/api/tags')
    if (response.data.code === 200) {
      tags.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

// Fetch articles
const fetchArticles = async (reset = false) => {
  if (loading.value) return

  loading.value = true

  try {
    const params: ArticleQuery = {
      page: reset ? 1 : currentPage.value,
      size: pageSize,
    }

    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value
    }

    if (selectedTag.value) {
      params.tagId = selectedTag.value
    }

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const response = await api.get<ApiResponse<{ records: Article[]; total: number; pages: number }>>('/api/articles', { params })

    if (response.data.code === 200 && response.data.data) {
      const { records, pages } = response.data.data

      if (reset) {
        articles.value = records
        currentPage.value = 1
      } else {
        articles.value.push(...records)
      }

      hasMore.value = currentPage.value < pages
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

// Load more
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    fetchArticles()
  }
}

// Handle category change
const handleCategoryChange = (categoryId: number | null) => {
  selectedCategory.value = categoryId
  selectedTag.value = null
  fetchArticles(true)
}

// Handle tag click
const handleTagClick = (tagId: number) => {
  selectedTag.value = tagId
  selectedCategory.value = null
  fetchArticles(true)
}

// Handle search
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  selectedCategory.value = null
  selectedTag.value = null
  fetchArticles(true)
}

// Handle reset
const handleReset = () => {
  searchKeyword.value = ''
  selectedCategory.value = null
  selectedTag.value = null
  fetchArticles(true)
}

// Initialize
onMounted(() => {
  fetchCategories()
  fetchTags()
  fetchArticles()
})
</script>
