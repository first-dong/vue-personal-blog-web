<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      class="fixed bottom-8 right-8 z-40 w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <UIcon name="i-heroicons-arrow-up" class="w-5 h-5" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(false)
const threshold = 300

const handleScroll = () => {
  visible.value = window.scrollY > threshold
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
