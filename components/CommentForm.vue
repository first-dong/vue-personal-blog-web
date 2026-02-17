<template>
  <div class="space-y-3">
    <!-- Reply hint -->
    <div v-if="replyTo" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
      <UIcon name="i-heroicons-arrow-turn-down-right" class="w-4 h-4" />
      回复 <span class="font-medium text-gray-700 dark:text-gray-300">@{{ replyTo }}</span>
    </div>

    <!-- Author Name -->
    <div class="flex gap-3">
      <UInput
        v-model="form.authorName"
        placeholder="你的昵称 *"
        :size="compact ? 'sm' : 'md'"
        class="flex-1"
        :error="errors.authorName"
      />
      <UInput
        v-model="form.authorEmail"
        placeholder="邮箱（选填）"
        type="email"
        :size="compact ? 'sm' : 'md'"
        class="flex-1"
      />
    </div>

    <!-- Comment Content -->
    <UTextarea
      v-model="form.content"
      :placeholder="replyTo ? `回复 @${replyTo}...` : '写下你的评论...'"
      :rows="compact ? 3 : 4"
      :error="errors.content"
      class="w-full resize-none"
    />

    <!-- Captcha -->
    <div class="flex items-center gap-3">
      <UInput
        v-model="form.captchaCode"
        placeholder="验证码"
        :size="compact ? 'sm' : 'md'"
        class="w-36"
        :error="errors.captchaCode"
        @keyup.enter="submitComment"
      />
      <div
        v-if="captchaImage"
        class="cursor-pointer rounded overflow-hidden border border-gray-200 dark:border-gray-600"
        title="点击刷新验证码"
        @click="refreshCaptcha"
      >
        <img :src="captchaImage" alt="验证码" class="h-9 w-24 object-contain" />
      </div>
      <UButton
        v-else
        variant="ghost"
        :size="compact ? 'sm' : 'md'"
        :loading="captchaLoading"
        @click="refreshCaptcha"
      >
        获取验证码
      </UButton>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <UButton
        v-if="compact"
        variant="ghost"
        size="sm"
        @click="$emit('cancel')"
      >
        取消
      </UButton>
      <UButton
        :loading="submitting"
        :disabled="submitting"
        :size="compact ? 'sm' : 'md'"
        @click="submitComment"
      >
        <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 mr-1" />
        {{ compact ? '回复' : '发表评论' }}
      </UButton>
    </div>

    <!-- Success message -->
    <div v-if="submitSuccess" class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
      <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
      评论发表成功！
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types/api'
import type { CommentRequest } from '~/types/article'

interface Props {
  articleId: number
  parentId?: number | null
  replyTo?: string
  compact?: boolean
}

interface Emits {
  (e: 'submitted'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  parentId: null,
  replyTo: undefined,
  compact: false,
})

const emit = defineEmits<Emits>()
const api = useApi()

// Form state
const form = reactive({
  authorName: '',
  authorEmail: '',
  content: '',
  captchaCode: '',
})

const errors = reactive({
  authorName: '',
  content: '',
  captchaCode: '',
})

const captchaImage = ref('')
const captchaKey = ref('')
const captchaLoading = ref(false)
const submitting = ref(false)
const submitSuccess = ref(false)

// Fetch captcha
const refreshCaptcha = async () => {
  captchaLoading.value = true
  try {
    const response = await api.get<ApiResponse<{ captchaKey: string; imageBase64: string }>>(
      '/api/captcha/generate',
      { params: { type: 'arithmetic' } },
    )
    if (response.data.code === 200 && response.data.data) {
      captchaKey.value = response.data.data.captchaKey
      captchaImage.value = response.data.data.imageBase64
    }
  } catch {
    // Silently fail
  } finally {
    captchaLoading.value = false
  }
}

// Validate form
const validate = (): boolean => {
  errors.authorName = form.authorName.trim() ? '' : '请输入昵称'
  errors.content = form.content.trim() ? '' : '请输入评论内容'
  errors.captchaCode = form.captchaCode.trim() ? '' : '请输入验证码'
  return !errors.authorName && !errors.content && !errors.captchaCode
}

// Submit comment
const submitComment = async () => {
  if (!validate()) return
  if (submitting.value) return

  submitting.value = true
  try {
    const request: CommentRequest = {
      articleId: props.articleId,
      parentId: props.parentId ?? null,
      content: form.content.trim(),
      authorName: form.authorName.trim(),
      authorEmail: form.authorEmail.trim() || undefined,
      captchaKey: captchaKey.value,
      captchaCode: form.captchaCode.trim(),
    }

    const response = await api.post<ApiResponse<null>>('/api/comments', request)

    if (response.data.code === 200) {
      form.content = ''
      form.captchaCode = ''
      submitSuccess.value = true
      setTimeout(() => { submitSuccess.value = false }, 3000)
      emit('submitted')
      refreshCaptcha()
    } else {
      errors.captchaCode = response.data.message || '提交失败，请重试'
      refreshCaptcha()
    }
  } catch {
    errors.captchaCode = '网络错误，请重试'
    refreshCaptcha()
  } finally {
    submitting.value = false
  }
}

// Restore saved author info from localStorage
onMounted(() => {
  if (import.meta.client) {
    form.authorName = localStorage.getItem('comment_author_name') || ''
    form.authorEmail = localStorage.getItem('comment_author_email') || ''
  }
  refreshCaptcha()
})

// Save author info on change
watch(() => form.authorName, (val) => {
  if (import.meta.client && val) {
    localStorage.setItem('comment_author_name', val)
  }
})

watch(() => form.authorEmail, (val) => {
  if (import.meta.client && val) {
    localStorage.setItem('comment_author_email', val)
  }
})
</script>
