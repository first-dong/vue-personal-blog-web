<template>
  <div class="flex gap-3">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <img
        v-if="comment.authorAvatar"
        :src="comment.authorAvatar"
        :alt="comment.authorName"
        class="w-9 h-9 rounded-full object-cover"
      />
      <div
        v-else
        class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
        :style="{ backgroundColor: avatarColor(comment.authorName) }"
      >
        {{ comment.authorName.slice(0, 1).toUpperCase() }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {{ comment.authorName }}
        </span>
        <span class="text-xs text-gray-400 dark:text-gray-500">
          {{ formatDate(comment.createdAt) }}
        </span>
      </div>

      <!-- Text -->
      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
        {{ comment.content }}
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-4 mt-2">
        <button
          class="text-xs text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
          @click="toggleReplyForm"
        >
          <UIcon name="i-heroicons-chat-bubble-left" class="w-3.5 h-3.5" />
          回复
        </button>
      </div>

      <!-- Reply Form -->
      <div v-if="showReplyForm" class="mt-3">
        <CommentForm
          :article-id="articleId"
          :parent-id="comment.id"
          :reply-to="comment.authorName"
          compact
          @submitted="handleReplySubmitted"
          @cancel="showReplyForm = false"
        />
      </div>

      <!-- Nested Replies -->
      <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
        <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :article-id="articleId"
          @reply-submitted="$emit('reply-submitted')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types/article'

interface Props {
  comment: Comment
  articleId: number
}

interface Emits {
  (e: 'reply-submitted'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const showReplyForm = ref(false)

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value
}

const handleReplySubmitted = () => {
  showReplyForm.value = false
  emit('reply-submitted')
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// Generate consistent avatar color from name
const avatarColor = (name: string): string => {
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>
