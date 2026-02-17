<template>
  <div class="danmaku-input-card">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">发送弹幕</h3>

    <div class="space-y-4">
      <!-- 弹幕内容输入 -->
      <div>
        <input
          v-model="content"
          type="text"
          placeholder="输入弹幕内容（最多200字）"
          maxlength="200"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          @keydown.enter="handleSubmit"
        />
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {{ content.length }}/200
        </div>
      </div>

      <!-- 颜色选择 -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">颜色:</span>
        <div class="flex gap-2">
          <button
            v-for="colorOption in colorOptions"
            :key="colorOption.value"
            type="button"
            :class="[
              'w-8 h-8 rounded-full border-2 transition-all',
              color === colorOption.value
                ? 'border-gray-800 dark:border-gray-200 scale-110'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            :style="{ backgroundColor: colorOption.value }"
            :title="colorOption.name"
            @click="color = colorOption.value"
          />
        </div>
      </div>

      <!-- 验证码 -->
      <div class="flex gap-2 items-start">
        <input
          v-model="captchaCode"
          type="text"
          placeholder="验证码"
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="button"
          class="captcha-image-btn"
          :disabled="captchaLoading"
          @click="fetchCaptcha"
        >
          <img
            v-if="captchaImage"
            :src="captchaImage"
            alt="验证码"
            class="w-full h-full object-contain"
          />
          <span v-else class="text-xs text-gray-500">点击获取</span>
        </button>
      </div>

      <!-- 提交按钮 -->
      <button
        type="button"
        class="submit-btn"
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
      >
        <template v-if="submitting"> 发送中... </template>
        <template v-else> 发射弹幕 🚀 </template>
      </button>

      <!-- 错误提示 -->
      <div
        v-if="errorMessage"
        class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDanmakuStore } from '~/stores/danmaku'
import type { ApiResponse } from '~/types/api'

const emit = defineEmits<{
  success: []
}>()

const danmakuStore = useDanmakuStore()

const content = ref('')
const color = ref('#FFFFFF')
const captchaCode = ref('')
const captchaKey = ref('')
const captchaImage = ref('')
const captchaLoading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

const colorOptions = [
  { name: '白色', value: '#FFFFFF' },
  { name: '红色', value: '#F87171' },
  { name: '橙色', value: '#FB923C' },
  { name: '黄色', value: '#FBBF24' },
  { name: '绿色', value: '#34D399' },
  { name: '青色', value: '#22D3EE' },
  { name: '蓝色', value: '#60A5FA' },
  { name: '紫色', value: '#A78BFA' },
  { name: '粉色', value: '#F472B6' },
]

const canSubmit = computed(
  () =>
    content.value.trim().length > 0 &&
    content.value.length <= 200 &&
    captchaKey.value &&
    captchaCode.value.trim().length > 0,
)

async function fetchCaptcha(): Promise<void> {
  captchaLoading.value = true
  errorMessage.value = ''
  try {
    const config = useRuntimeConfig()
    const response = await fetch(
      `${config.public.apiBase}/api/captcha/generate?type=arithmetic`,
    )
    const result: ApiResponse<{ captchaKey: string; imageBase64: string }> =
      await response.json()
    if (result.code === 200 && result.data) {
      captchaKey.value = result.data.captchaKey
      captchaImage.value = result.data.imageBase64
    } else {
      errorMessage.value = result.message || '获取验证码失败'
    }
  } catch (error) {
    errorMessage.value = '验证码服务暂不可用'
  } finally {
    captchaLoading.value = false
  }
}

async function handleSubmit(): Promise<void> {
  if (!canSubmit.value || submitting.value) return

  submitting.value = true
  errorMessage.value = ''

  try {
    const success = await danmakuStore.sendDanmaku({
      content: content.value.trim(),
      color: color.value,
      position: Math.floor(Math.random() * 5),
      speed: 1,
      captchaKey: captchaKey.value,
      captchaCode: captchaCode.value,
    })

    if (success) {
      content.value = ''
      captchaCode.value = ''
      emit('success')
      // Refresh captcha
      fetchCaptcha()
    } else {
      errorMessage.value = '发送失败，请检查验证码'
      // Refresh captcha on failure
      fetchCaptcha()
    }
  } catch {
    errorMessage.value = '发送失败，请稍后重试'
    fetchCaptcha()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCaptcha()
})
</script>

<style scoped>
.danmaku-input-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .danmaku-input-card {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(75, 85, 99, 0.3);
}

.captcha-image-btn {
  width: 120px;
  height: 40px;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.dark .captcha-image-btn {
  border-color: #4b5563;
  background: #1f2937;
}

.captcha-image-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.captcha-image-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
