<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Icon -->
    <div class="w-24 h-24 mb-6 text-gray-300 dark:text-gray-600">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Empty document illustration -->
        <rect x="40" y="30" width="120" height="150" rx="8" fill="currentColor" opacity="0.2" />
        <rect x="55" y="60" width="90" height="8" rx="4" fill="currentColor" opacity="0.4" />
        <rect x="55" y="80" width="75" height="8" rx="4" fill="currentColor" opacity="0.3" />
        <rect x="55" y="100" width="80" height="8" rx="4" fill="currentColor" opacity="0.3" />
        <rect x="55" y="120" width="60" height="8" rx="4" fill="currentColor" opacity="0.2" />
        <!-- Search icon overlay -->
        <circle cx="145" cy="145" r="35" fill="currentColor" opacity="0.15" />
        <circle cx="141" cy="141" r="16" stroke="currentColor" stroke-width="5" opacity="0.5" />
        <line x1="152" y1="152" x2="165" y2="165" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.5" />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ keyword ? '没有找到相关文章' : '暂时没有文章' }}
    </h3>

    <!-- Description -->
    <p class="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
      <template v-if="keyword">
        未找到包含 "<span class="font-medium text-primary-600 dark:text-primary-400">{{ keyword }}</span>"
        的文章，请尝试其他关键词
      </template>
      <template v-else>
        还没有发布任何文章，请稍后再来
      </template>
    </p>

    <!-- Actions -->
    <div class="flex flex-wrap gap-3 justify-center">
      <UButton v-if="keyword" variant="solid" @click="$emit('reset')">
        <UIcon name="i-heroicons-arrow-uturn-left" class="w-4 h-4 mr-1" />
        返回全部文章
      </UButton>
      <UButton variant="outline" @click="$router.push('/')">
        <UIcon name="i-heroicons-home" class="w-4 h-4 mr-1" />
        回到首页
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  keyword?: string
}

interface Emits {
  (e: 'reset'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
