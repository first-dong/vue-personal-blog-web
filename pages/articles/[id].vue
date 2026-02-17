<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-8 max-w-7xl">
      <ArticleDetailSkeleton />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-16 max-w-7xl text-center">
      <div class="text-6xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">文章不存在</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">该文章可能已被删除或不存在</p>
      <UButton @click="navigateTo('/articles')">返回文章列表</UButton>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="flex gap-8">
        <!-- Main Content -->
        <article class="flex-1 min-w-0">
          <!-- Article Header -->
          <ArticleHeader :article="article" />

          <!-- Cover Image -->
          <div v-if="article.coverImage" class="mb-8 rounded-xl overflow-hidden shadow-md">
            <img
              :src="article.coverImage"
              :alt="article.title"
              class="w-full h-64 md:h-96 object-cover"
            />
          </div>

          <!-- Article Body -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-10">
            <ArticleContent :content="article.content || ''" @toc-ready="handleTocReady" />

            <!-- Like & Share -->
            <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <ArticleLike :article-id="article.id" :like-count="article.likeCount" />
                <ArticleShare :article="article" />
              </div>
            </div>
          </div>

          <!-- Prev / Next Navigation -->
          <ArticleNavigation :prev-article="prevArticle" :next-article="nextArticle" />

          <!-- Related Articles -->
          <RelatedArticles v-if="relatedArticles.length > 0" :articles="relatedArticles" />

          <!-- Comments Section -->
          <ArticleComments :article-id="article.id" />
        </article>

        <!-- Right Sidebar (TOC) -->
        <aside class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-24 space-y-6">
            <ArticleToc :toc="tocItems" />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/blog'
import type { ApiResponse } from '~/types/api'
import type { TocItem } from '~/types/article'

definePageMeta({
  layout: 'default',
})

// Route
const route = useRoute()
const articleId = computed(() => Number(route.params.id))

// State
const article = ref<Article | null>(null)
const prevArticle = ref<Article | null>(null)
const nextArticle = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])
const tocItems = ref<TocItem[]>([])
const loading = ref(true)
const error = ref(false)

// API
const api = useApi()

// SEO
useHead(
  computed(() => ({
    title: article.value?.title || '文章详情',
    meta: [
      { name: 'description', content: article.value?.summary || '博客文章' },
    ],
  })),
)

// Fetch article detail
const fetchArticle = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await api.get<ApiResponse<Article>>(`/api/articles/${articleId.value}`)
    if (response.data.code === 200 && response.data.data) {
      article.value = response.data.data
      // Fetch adjacent & related articles after main article is loaded
      await Promise.allSettled([
        fetchAdjacentArticles(),
        fetchRelatedArticles(),
      ])
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

// Fetch prev/next articles
const fetchAdjacentArticles = async () => {
  try {
    const response = await api.get<ApiResponse<{ prev: Article | null; next: Article | null }>>(
      `/api/articles/${articleId.value}/adjacent`,
    )
    if (response.data.code === 200 && response.data.data) {
      prevArticle.value = response.data.data.prev
      nextArticle.value = response.data.data.next
    }
  } catch {
    // Fallback: fetch from list
    try {
      const listResp = await api.get<ApiResponse<{ records: Article[] }>>('/api/articles', {
        params: { page: 1, size: 50 },
      })
      if (listResp.data.code === 200 && listResp.data.data?.records) {
        const list = listResp.data.data.records
        const idx = list.findIndex((a) => a.id === articleId.value)
        if (idx !== -1) {
          prevArticle.value = idx > 0 ? list[idx - 1] : null
          nextArticle.value = idx < list.length - 1 ? list[idx + 1] : null
        }
      }
    } catch {
      // Silently fail
    }
  }
}

// Fetch related articles
const fetchRelatedArticles = async () => {
  if (!article.value) return
  try {
    const response = await api.get<ApiResponse<Article[]>>(
      `/api/articles/${articleId.value}/related`,
    )
    if (response.data.code === 200 && response.data.data) {
      relatedArticles.value = response.data.data.slice(0, 3)
      return
    }
  } catch {
    // Fallback: fetch by same category
  }
  // Fallback: fetch from same category
  try {
    const params: Record<string, unknown> = { page: 1, size: 4 }
    if (article.value.categoryId) {
      params.categoryId = article.value.categoryId
    }
    const listResp = await api.get<ApiResponse<{ records: Article[] }>>('/api/articles', {
      params,
    })
    if (listResp.data.code === 200 && listResp.data.data?.records) {
      relatedArticles.value = listResp.data.data.records
        .filter((a) => a.id !== articleId.value)
        .slice(0, 3)
    }
  } catch {
    // Silently fail
  }
}

// Handle TOC ready event from ArticleContent
const handleTocReady = (items: TocItem[]) => {
  tocItems.value = items
}

// Initialize
onMounted(() => {
  fetchArticle()
})

// Watch route changes (for navigating between articles)
watch(articleId, () => {
  article.value = null
  tocItems.value = []
  fetchArticle()
})
</script>
