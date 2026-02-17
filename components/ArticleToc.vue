<template>
  <div v-if="toc.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
    <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
      <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
      目录
    </h3>
    <nav class="space-y-1">
      <TocItem
        v-for="item in toc"
        :key="item.id"
        :item="item"
        :active-id="activeId"
        @navigate="handleNavigate"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { TocItem as TocItemType } from '~/types/article'

interface Props {
  toc: TocItemType[]
}

defineProps<Props>()

// Currently active heading ID
const activeId = ref('')

// Observe headings and update active ID on scroll
onMounted(() => {
  if (!import.meta.client) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    },
  )

  // Observe all heading elements
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  headings.forEach((h) => observer.observe(h))

  onUnmounted(() => observer.disconnect())
})

// Smooth scroll to heading
const handleNavigate = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Offset for fixed navbar
    setTimeout(() => {
      window.scrollBy({ top: -80, behavior: 'smooth' })
    }, 100)
    activeId.value = id
  }
}
</script>
