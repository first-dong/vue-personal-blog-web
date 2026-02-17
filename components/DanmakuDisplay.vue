<template>
  <div class="danmaku-container" :style="{ opacity: danmakuStore.opacity }">
    <div
      v-for="item in activeDanmaku"
      :key="item.id"
      ref="danmakuElements"
      :class="['danmaku-item', { paused: danmakuStore.isPaused }]"
      :style="getDanmakuStyle(item)"
    >
      {{ item.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDanmakuStore, type DanmakuItem } from '~/stores/danmaku'
import type { Danmaku } from '~/types/blog'

const danmakuStore = useDanmakuStore()

const activeDanmaku = ref<DanmakuItem[]>([])
const danmakuElements = ref<HTMLElement[]>([])

const TRACK_COUNT = 5
const TRACK_HEIGHT = 50
const BASE_SPEED = 1.5
const MIN_SPACING = 200

const trackStates = ref<{ lastX: number; lastTime: number }[]>(
  Array.from({ length: TRACK_COUNT }, () => ({ lastX: window.innerWidth, lastTime: 0 })),
)

let animationFrameId = 0
let lastTimestamp = 0
let danmakuIdCounter = 0

function findAvailableTrack(): number {
  const now = Date.now()
  for (let i = 0; i < TRACK_COUNT; i++) {
    const track = trackStates.value[i]
    // Check if enough time has passed and enough distance
    if (
      now - track.lastTime > 1000 &&
      window.innerWidth - track.lastX > MIN_SPACING
    ) {
      return i
    }
  }
  // Find track with oldest danmaku
  let oldestIdx = 0
  let oldestTime = trackStates.value[0].lastTime
  for (let i = 1; i < TRACK_COUNT; i++) {
    if (trackStates.value[i].lastTime < oldestTime) {
      oldestTime = trackStates.value[i].lastTime
      oldestIdx = i
    }
  }
  return oldestIdx
}

function addDanmaku(danmaku: Danmaku): void {
  const trackIndex = findAvailableTrack()
  const speed = BASE_SPEED * (danmaku.speed || 1)

  const item: DanmakuItem = {
    ...danmaku,
    trackIndex,
    startX: window.innerWidth,
    currentX: window.innerWidth,
    id: danmaku.id || ++danmakuIdCounter,
  }

  activeDanmaku.value.push(item)
  trackStates.value[trackIndex] = {
    lastX: window.innerWidth,
    lastTime: Date.now(),
  }

  // Auto-remove after animation
  setTimeout(
    () => {
      const idx = activeDanmaku.value.findIndex((d) => d.id === item.id)
      if (idx !== -1) {
        activeDanmaku.value.splice(idx, 1)
      }
    },
    (window.innerWidth + 300) / speed,
  )
}

function getDanmakuStyle(item: DanmakuItem): Record<string, string> {
  return {
    top: `${item.trackIndex * TRACK_HEIGHT + 10}px`,
    left: `${item.currentX}px`,
    color: item.color || '#ffffff',
    animationDuration: `${(window.innerWidth + 300) / (BASE_SPEED * (item.speed || 1))}ms`,
    animationPlayState: danmakuStore.isPaused ? 'paused' : 'running',
  }
}

function animate(timestamp: number): void {
  if (!lastTimestamp) lastTimestamp = timestamp
  const deltaTime = timestamp - lastTimestamp
  lastTimestamp = timestamp

  if (!danmakuStore.isPaused) {
    for (const item of activeDanmaku.value) {
      const speed = BASE_SPEED * (item.speed || 1)
      item.currentX -= (speed * deltaTime) / 16
    }

    // Update track states
    for (const item of activeDanmaku.value) {
      trackStates.value[item.trackIndex].lastX = item.currentX
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

function handleNewDanmaku(items: Danmaku[]): void {
  // Only add new items not already in active list
  const existingIds = new Set(activeDanmaku.value.map((d) => d.id))
  const newItems = items.filter((item) => !existingIds.has(item.id))

  for (const item of newItems.slice(0, 3)) {
    addDanmaku(item)
  }
}

onMounted(() => {
  animate(0)
  danmakuStore.startPolling(handleNewDanmaku)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  danmakuStore.stopPolling()
})

defineExpose({
  addDanmaku,
})
</script>

<style scoped>
.danmaku-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-size: 1.125rem;
  font-weight: 600;
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6),
    1px 1px 2px rgba(0, 0, 0, 0.9);
  transition: left 0.016s linear;
  will-change: transform;
}

.danmaku-item.paused {
  animation-play-state: paused !important;
}
</style>
