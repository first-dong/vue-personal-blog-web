<script setup lang="ts">
import type { Article } from '~/types/blog'

const articles = ref<Article[]>([])
const loading = ref(true)

async function fetchLatestArticles() {
  try {
    const api = useApi()
    const res = await api.get('/api/articles', { params: { page: 1, size: 4, status: 'PUBLISHED' } })
    articles.value = res.data?.data?.records ?? []
  } catch {
    articles.value = []
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function truncate(str: string, max: number): string {
  return str && str.length > max ? str.slice(0, max) + '…' : str
}

onMounted(() => {
  fetchLatestArticles()
})
</script>

<template>
  <div class="latest-articles">
    <div class="section-header">
      <h2 class="section-title">最新文章</h2>
      <NuxtLink to="/articles" class="view-all-link">查看全部 →</NuxtLink>
    </div>

    <!-- Skeleton -->
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="article-card article-card--skeleton">
        <div class="skeleton-cover" />
        <div class="skeleton-content">
          <div class="skeleton-tag" />
          <div class="skeleton-title" />
          <div class="skeleton-summary" />
          <div class="skeleton-meta" />
        </div>
      </div>
    </template>

    <!-- Empty -->
    <div v-else-if="articles.length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <p>暂无文章</p>
    </div>

    <!-- Article List -->
    <template v-else>
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/articles/${article.id}`"
        class="article-card"
      >
        <div
          class="article-cover"
          :style="article.coverImage
            ? `background-image: url(${article.coverImage})`
            : 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'"
        />
        <div class="article-content">
          <div class="article-meta-top">
            <span v-if="article.categoryName" class="article-category">{{ article.categoryName }}</span>
            <span class="article-date">{{ formatDate(article.createdAt) }}</span>
          </div>
          <h3 class="article-title">{{ truncate(article.title, 40) }}</h3>
          <p class="article-summary">{{ truncate(article.summary, 70) }}</p>
          <div class="article-meta-bottom">
            <span class="meta-item">👁 {{ article.viewCount }}</span>
            <span class="meta-item">❤ {{ article.likeCount }}</span>
          </div>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.latest-articles {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.view-all-link {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #a78bfa;
}

/* Article Card */
.article-card {
  display: flex;
  gap: 0.875rem;
  padding: 0.875rem;
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.article-cover {
  flex-shrink: 0;
  width: 80px;
  height: 64px;
  border-radius: 0.5rem;
  background-size: cover;
  background-position: center;
}

.article-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-category {
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.25);
  color: #a78bfa;
  font-weight: 500;
}

.article-date {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.article-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-summary {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta-bottom {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.meta-item {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Skeleton */
.article-card--skeleton {
  cursor: default;
  pointer-events: none;
}

.skeleton-cover {
  flex-shrink: 0;
  width: 80px;
  height: 64px;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skeleton-tag,
.skeleton-title,
.skeleton-summary,
.skeleton-meta {
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.08);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-tag { width: 50px; height: 0.75rem; border-radius: 999px; }
.skeleton-title { width: 80%; height: 0.9rem; }
.skeleton-summary { width: 100%; height: 0.75rem; }
.skeleton-meta { width: 40%; height: 0.7rem; }

/* Empty */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
</style>
