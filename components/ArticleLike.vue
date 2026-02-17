<template>
  <div class="flex flex-col items-center gap-2">
    <button
      class="group flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-200"
      :class="[
        liked
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
          : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-400 dark:hover:border-red-500 dark:hover:text-red-400',
        loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95',
      ]"
      :disabled="loading"
      @click="handleLike"
    >
      <UIcon
        :name="liked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
        class="w-6 h-6 transition-transform"
        :class="{ 'group-hover:scale-110': !liked }"
      />
      <span class="text-lg font-semibold">{{ displayCount }}</span>
    </button>
    <p class="text-xs text-gray-400 dark:text-gray-500">{{ liked ? '已点赞，感谢支持！' : '觉得不错？点个赞吧' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/api'

interface Props {
  articleId: number
  likeCount: number
}

const props = defineProps<Props>()

const api = useApi()

// Check if already liked (stored in localStorage)
const likeKey = computed(() => `liked_article_${props.articleId}`)
const liked = ref(false)
const localCount = ref(props.likeCount)
const loading = ref(false)

const displayCount = computed(() => localCount.value)

onMounted(() => {
  if (import.meta.client) {
    liked.value = localStorage.getItem(likeKey.value) === 'true'
  }
})

// Watch prop changes
watch(() => props.likeCount, (val) => {
  localCount.value = val
})

const handleLike = async () => {
  if (liked.value || loading.value) return

  loading.value = true
  try {
    const response = await api.post<ApiResponse<null>>(`/api/articles/${props.articleId}/like`)
    if (response.data.code === 200) {
      liked.value = true
      localCount.value++
      if (import.meta.client) {
        localStorage.setItem(likeKey.value, 'true')
      }
    }
  } catch {
    // Optimistic update failed, revert
  } finally {
    loading.value = false
  }
}
</script>
