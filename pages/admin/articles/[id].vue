<script setup lang="ts">
import type { Article } from '~/types/blog'

definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
})

const route = useRoute()
const { $api } = useNuxtApp()

const articleId = Number(route.params.id)

const loading = ref(true)
const article = ref<Article | null>(null)
const error = ref<string | null>(null)

const fetchArticle = async () => {
  try {
    const { data } = await $api.get(`/api/articles/${articleId}`)
    article.value = data
  } catch (e) {
    error.value = '文章加载失败'
    console.error('Failed to fetch article:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div>
    <div v-if="loading" class="p-6 text-center text-gray-500 dark:text-gray-400">
      加载文章中...
    </div>
    <div v-else-if="error" class="p-6 text-center text-red-600">
      {{ error }}
    </div>
    <ArticleForm
      v-else-if="article"
      :article-id="articleId"
      :is-edit="true"
      :initial-data="{
        title: article.title,
        content: article.content || '',
        summary: article.summary,
        coverImage: article.coverImage,
        categoryId: article.categoryId,
        tagIds: article.tags?.map(t => t.id) || [],
        status: article.status
      }"
    />
  </div>
</template>
