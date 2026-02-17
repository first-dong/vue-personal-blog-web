<template>
  <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-primary-500" />
      评论
      <span v-if="total > 0" class="text-sm font-normal text-gray-400 dark:text-gray-500">
        ({{ total }})
      </span>
    </h3>

    <!-- Comment Form -->
    <CommentForm
      :article-id="articleId"
      :parent-id="null"
      class="mb-8"
      @submitted="handleCommentSubmitted"
    />

    <!-- Comment List -->
    <div v-if="loading && comments.length === 0" class="space-y-4">
      <CommentSkeleton v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="comments.length === 0" class="py-8 text-center text-gray-400 dark:text-gray-500">
      <UIcon name="i-heroicons-chat-bubble-oval-left" class="w-12 h-12 mx-auto mb-2 opacity-30" />
      <p>暂无评论，快来抢沙发吧！</p>
    </div>

    <div v-else class="space-y-6">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-id="articleId"
        @reply-submitted="handleCommentSubmitted"
      />
    </div>

    <!-- Load More -->
    <div v-if="hasMore && comments.length > 0" class="mt-6 text-center">
      <UButton variant="outline" :loading="loading" @click="loadMore">
        加载更多评论
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types/article'
import type { ApiResponse } from '~/types/api'

interface Props {
  articleId: number
}

const props = defineProps<Props>()

const api = useApi()

const comments = ref<Comment[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const hasMore = ref(true)

const fetchComments = async (reset = false) => {
  if (loading.value) return
  loading.value = true
  try {
    const response = await api.get<ApiResponse<{ records: Comment[]; total: number; pages: number }>>(
      `/api/comments`,
      { params: { articleId: props.articleId, page: reset ? 1 : currentPage.value, size: pageSize } },
    )
    if (response.data.code === 200 && response.data.data) {
      const { records, total: t, pages } = response.data.data
      total.value = t
      if (reset) {
        comments.value = records
        currentPage.value = 1
      } else {
        comments.value.push(...records)
      }
      hasMore.value = currentPage.value < pages
    }
  } catch {
    // Silently fail - comments are not critical
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    fetchComments()
  }
}

const handleCommentSubmitted = () => {
  fetchComments(true)
}

onMounted(() => {
  fetchComments(true)
})
</script>
