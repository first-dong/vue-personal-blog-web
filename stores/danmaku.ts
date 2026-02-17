import type { Danmaku, DanmakuRequest } from '~/types/blog'
import type { ApiResponse, PageResult } from '~/types/api'

export interface DanmakuItem extends Danmaku {
  // Runtime display properties
  trackIndex: number
  startX: number
  currentX: number
  animationId?: number
}

interface DanmakuState {
  items: DanmakuItem[]
  isPaused: boolean
  opacity: number
  isLoading: boolean
  pollingTimer: ReturnType<typeof setInterval> | null
}

export const useDanmakuStore = defineStore('danmaku', {
  state: (): DanmakuState => ({
    items: [],
    isPaused: false,
    opacity: 0.9,
    isLoading: false,
    pollingTimer: null,
  }),

  getters: {
    visibleItems: (state): DanmakuItem[] => state.items,
    danmakuOpacity: (state): number => state.opacity,
    paused: (state): boolean => state.isPaused,
  },

  actions: {
    setOpacity(value: number): void {
      this.opacity = Math.max(0.1, Math.min(1, value))
    },

    togglePause(): void {
      this.isPaused = !this.isPaused
    },

    addItem(item: DanmakuItem): void {
      this.items.push(item)
      // Keep max 100 items in memory
      if (this.items.length > 100) {
        this.items.splice(0, this.items.length - 100)
      }
    },

    removeItem(id: number): void {
      const idx = this.items.findIndex((d) => d.id === id)
      if (idx !== -1) {
        this.items.splice(idx, 1)
      }
    },

    async fetchDanmaku(): Promise<Danmaku[]> {
      if (!import.meta.client) return []
      try {
        const config = useRuntimeConfig()
        const response = await fetch(
          `${config.public.apiBase}/api/danmaku?page=1&size=30`,
        )
        if (!response.ok) return []
        const result: ApiResponse<PageResult<Danmaku>> = await response.json()
        if (result.code === 200 && result.data?.records) {
          return result.data.records
        }
      } catch {
        // API not available, return empty
      }
      return []
    },

    async sendDanmaku(request: DanmakuRequest): Promise<boolean> {
      try {
        const config = useRuntimeConfig()
        const response = await fetch(`${config.public.apiBase}/api/danmaku`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        })
        const result: ApiResponse<Danmaku> = await response.json()
        return result.code === 200
      } catch {
        return false
      }
    },

    startPolling(callback: (items: Danmaku[]) => void): void {
      if (this.pollingTimer) return
      // Initial fetch
      this.fetchDanmaku().then(callback)
      // Poll every 5 seconds
      this.pollingTimer = setInterval(async () => {
        const items = await this.fetchDanmaku()
        callback(items)
      }, 5000)
    },

    stopPolling(): void {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
    },
  },
})
