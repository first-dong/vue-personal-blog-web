<script setup lang="ts">
interface SiteStats {
  articleCount: number
  totalViews: number
  runningDays: number
}

const stats = ref<SiteStats>({
  articleCount: 0,
  totalViews: 0,
  runningDays: 0,
})

const loading = ref(true)

// 启动日期（博客上线时间）
const LAUNCH_DATE = new Date('2025-01-01')

function calcRunningDays(): number {
  const now = new Date()
  const diff = now.getTime() - LAUNCH_DATE.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

async function fetchStats() {
  try {
    const api = useApi()
    const res = await api.get('/api/stats/overview')
    stats.value = {
      articleCount: res.data?.data?.articleCount ?? 0,
      totalViews: res.data?.data?.totalViews ?? 0,
      runningDays: calcRunningDays(),
    }
  } catch {
    // 后端不可用时使用默认值
    stats.value = {
      articleCount: 0,
      totalViews: 0,
      runningDays: calcRunningDays(),
    }
  } finally {
    loading.value = false
  }
}

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

onMounted(() => {
  fetchStats()
})

const statCards = computed(() => [
  {
    icon: '📝',
    label: '发布文章',
    value: formatNumber(stats.value.articleCount),
    unit: '篇',
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.12)',
  },
  {
    icon: '👁️',
    label: '总访问量',
    value: formatNumber(stats.value.totalViews),
    unit: '次',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
  },
  {
    icon: '🚀',
    label: '持续运行',
    value: String(stats.value.runningDays),
    unit: '天',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
  },
])
</script>

<template>
  <div class="site-stats-grid">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="stat-card stat-card--skeleton">
        <div class="skeleton-icon" />
        <div class="skeleton-value" />
        <div class="skeleton-label" />
      </div>
    </template>
    <template v-else>
      <div
        v-for="card in statCards"
        :key="card.label"
        class="stat-card"
        :style="{ '--card-color': card.color, '--card-bg': card.bgColor }"
      >
        <div class="stat-icon">{{ card.icon }}</div>
        <div class="stat-value">
          {{ card.value }}<span class="stat-unit">{{ card.unit }}</span>
        </div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.site-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem;
  border-radius: 1rem;
  background: var(--card-bg, rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--card-color, #fff);
  line-height: 1;
}

.stat-unit {
  font-size: 0.75rem;
  font-weight: 400;
  margin-left: 2px;
  opacity: 0.8;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

/* skeleton */
.stat-card--skeleton {
  background: rgba(255, 255, 255, 0.04);
}

.skeleton-icon,
.skeleton-value,
.skeleton-label {
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.skeleton-value {
  width: 60%;
  height: 1.5rem;
  margin-bottom: 0.4rem;
}

.skeleton-label {
  width: 50%;
  height: 0.75rem;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@media (max-width: 480px) {
  .site-stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .stat-card {
    padding: 0.875rem 0.5rem;
  }
  .stat-value {
    font-size: 1.125rem;
  }
}
</style>
