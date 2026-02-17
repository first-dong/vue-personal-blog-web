<script setup lang="ts">
import type { Article, Category, Tag } from '~/types/blog'

definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
})

interface ArticleTableItem extends Article {
  selected?: boolean
}

const router = useRouter()
const { $api } = useNuxtApp()

// State
const articles = ref<ArticleTableItem[]>([])
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const total = ref(0)

// Query params
const query = reactive({
  page: 1,
  size: 20,
  keyword: '',
  categoryId: undefined as number | undefined,
  tagId: undefined as number | undefined,
  status: undefined as 'DRAFT' | 'PUBLISHED' | undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// Search
const searchKeyword = ref('')
const searchTimer = ref<NodeJS.Timeout | null>(null)

// Selection
const selectedArticles = computed(() => articles.value.filter(a => a.selected))
const allSelected = computed({
  get: () => articles.value.length > 0 && articles.value.every(a => a.selected),
  set: (value: boolean) => {
    articles.value.forEach(a => a.selected = value)
  }
})

// Fetch data
const fetchArticles = async () => {
  loading.value = true
  try {
    const params: any = {
      page: query.page,
      size: query.size
    }

    if (query.keyword) params.keyword = query.keyword
    if (query.categoryId) params.categoryId = query.categoryId
    if (query.tagId) params.tagId = query.tagId
    if (query.status) params.status = query.status

    const { data } = await $api.get('/api/articles', { params })
    articles.value = (data.records || []).map((a: Article) => ({ ...a, selected: false }))
    total.value = data.total || 0
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await $api.get('/api/categories')
    categories.value = data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchTags = async () => {
  try {
    const { data } = await $api.get('/api/tags')
    tags.value = data || []
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

// Search handler with debounce
const handleSearch = (value: string) => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  searchTimer.value = setTimeout(() => {
    query.keyword = value
    query.page = 1
    fetchArticles()
  }, 500)
}

// Filter handlers
const handleCategoryChange = () => {
  query.page = 1
  fetchArticles()
}

const handleTagChange = () => {
  query.page = 1
  fetchArticles()
}

const handleStatusChange = () => {
  query.page = 1
  fetchArticles()
}

// Pagination
const handlePageChange = (page: number) => {
  query.page = page
  fetchArticles()
}

// Article actions
const handleCreate = () => {
  router.push('/admin/articles/create')
}

const handleEdit = (id: number) => {
  router.push(`/admin/articles/${id}`)
}

const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这篇文章吗?')) return

  try {
    await $api.delete(`/api/admin/articles/${id}`)
    fetchArticles()
  } catch (error) {
    console.error('Failed to delete article:', error)
    alert('删除失败,请稍后重试')
  }
}

const handleBatchDelete = async () => {
  if (selectedArticles.value.length === 0) {
    alert('请选择要删除的文章')
    return
  }

  if (!confirm(`确定要删除选中的 ${selectedArticles.value.length} 篇文章吗?`)) return

  try {
    const ids = selectedArticles.value.map(a => a.id)
    await Promise.all(ids.map(id => $api.delete(`/api/admin/articles/${id}`)))
    fetchArticles()
  } catch (error) {
    console.error('Failed to batch delete articles:', error)
    alert('批量删除失败,请稍后重试')
  }
}

const handleBatchPublish = async () => {
  if (selectedArticles.value.length === 0) {
    alert('请选择要发布的文章')
    return
  }

  try {
    const ids = selectedArticles.value.map(a => a.id)
    await Promise.all(ids.map(id =>
      $api.put(`/api/admin/articles/${id}`, { status: 'PUBLISHED' })
    ))
    fetchArticles()
  } catch (error) {
    console.error('Failed to batch publish articles:', error)
    alert('批量发布失败,请稍后重试')
  }
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// Get status badge color
const getStatusColor = (status: string) => {
  return status === 'PUBLISHED' ? 'green' : 'gray'
}

// Lifecycle
onMounted(() => {
  fetchArticles()
  fetchCategories()
  fetchTags()
})

onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章管理</h1>
      <p class="text-gray-600 dark:text-gray-400">管理博客文章,包括新增、编辑、删除等操作</p>
    </div>

    <!-- Filters & Actions -->
    <div class="mb-6 space-y-4">
      <!-- Search & Create -->
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章标题或内容..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="handleSearch(searchKeyword)"
          >
        </div>
        <button
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          @click="handleCreate"
        >
          新建文章
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4">
        <select
          v-model="query.categoryId"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          @change="handleCategoryChange"
        >
          <option :value="undefined">全部分类</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <select
          v-model="query.tagId"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          @change="handleTagChange"
        >
          <option :value="undefined">全部标签</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>

        <select
          v-model="query.status"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          @change="handleStatusChange"
        >
          <option :value="undefined">全部状态</option>
          <option value="PUBLISHED">已发布</option>
          <option value="DRAFT">草稿</option>
        </select>
      </div>

      <!-- Batch Actions -->
      <div v-if="selectedArticles.length > 0" class="flex gap-4">
        <span class="text-gray-600 dark:text-gray-400 py-2">
          已选择 {{ selectedArticles.length }} 篇文章
        </span>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          @click="handleBatchPublish"
        >
          批量发布
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          @click="handleBatchDelete"
        >
          批量删除
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left">
                <input
                  v-model="allSelected"
                  type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-700"
                >
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                标题
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                分类
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                浏览/点赞
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                加载中...
              </td>
            </tr>
            <tr v-else-if="articles.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                暂无文章
              </td>
            </tr>
            <tr
              v-for="article in articles"
              v-else
              :key="article.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td class="px-4 py-4">
                <input
                  v-model="article.selected"
                  type="checkbox"
                  class="rounded border-gray-300 dark:border-gray-700"
                >
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="article.coverImage"
                      :src="article.coverImage"
                      alt=""
                      class="h-10 w-10 rounded object-cover"
                    >
                    <div v-else class="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ article.title }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ article.categoryName }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="article.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ article.status === 'PUBLISHED' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ article.viewCount }} / {{ article.likeCount }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(article.createdAt) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  @click="handleEdit(article.id)"
                >
                  编辑
                </button>
                <button
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  @click="handleDelete(article.id)"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="total > query.size" class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            共 {{ total }} 篇文章
          </div>
          <div class="flex gap-2">
            <button
              :disabled="query.page === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="handlePageChange(query.page - 1)"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              第 {{ query.page }} / {{ Math.ceil(total / query.size) }} 页
            </span>
            <button
              :disabled="query.page >= Math.ceil(total / query.size)"
              class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="handlePageChange(query.page + 1)"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
