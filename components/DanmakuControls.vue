<template>
  <div class="danmaku-controls">
    <!-- 暂停/播放按钮 -->
    <button
      type="button"
      class="control-btn"
      :title="danmakuStore.isPaused ? '播放弹幕' : '暂停弹幕'"
      @click="danmakuStore.togglePause()"
    >
      <span v-if="danmakuStore.isPaused">▶</span>
      <span v-else>⏸</span>
    </button>

    <!-- 透明度滑块 -->
    <div class="opacity-control">
      <span class="control-label">透明度</span>
      <input
        :value="danmakuStore.opacity"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        class="opacity-slider"
        @input="handleOpacityChange"
      />
      <span class="opacity-value">{{ Math.round(danmakuStore.opacity * 100) }}%</span>
    </div>

    <!-- 发送弹幕按钮 -->
    <button
      type="button"
      class="send-btn"
      @click="$emit('openInput')"
    >
      <span>💬 发弹幕</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDanmakuStore } from '~/stores/danmaku'

defineEmits<{
  openInput: []
}>()

const danmakuStore = useDanmakuStore()

function handleOpacityChange(e: Event): void {
  const target = e.target as HTMLInputElement
  danmakuStore.setOpacity(parseFloat(target.value))
}
</script>

<style scoped>
.danmaku-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.opacity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
}

.opacity-slider {
  width: 100px;
  accent-color: #667eea;
  cursor: pointer;
}

.opacity-value {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  min-width: 2.5rem;
}

.send-btn {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}
</style>
