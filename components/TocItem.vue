<template>
  <div>
    <button
      class="w-full text-left text-sm py-1 px-2 rounded transition-all hover:bg-gray-100 dark:hover:bg-gray-700/50 truncate"
      :class="[
        paddingClass,
        isActive
          ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20'
          : 'text-gray-600 dark:text-gray-400',
      ]"
      :title="item.text"
      @click="$emit('navigate', item.id)"
    >
      {{ item.text }}
    </button>

    <!-- Nested items -->
    <div v-if="item.children && item.children.length > 0" class="ml-2 border-l border-gray-200 dark:border-gray-700 pl-2">
      <TocItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :active-id="activeId"
        @navigate="$emit('navigate', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocItem as TocItemType } from '~/types/article'

interface Props {
  item: TocItemType
  activeId: string
}

interface Emits {
  (e: 'navigate', id: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const isActive = computed(() => props.activeId === props.item.id)

const paddingClass = computed(() => {
  const level = props.item.level
  if (level <= 2) return 'pl-2'
  if (level === 3) return 'pl-4'
  if (level === 4) return 'pl-6'
  return 'pl-8'
})
</script>
