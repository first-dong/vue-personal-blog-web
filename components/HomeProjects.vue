<script setup lang="ts">
interface GithubProject {
  name: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  url: string
  topics: string[]
}

// 静态项目数据（实际可接入 GitHub API）
const projects: GithubProject[] = [
  {
    name: 'personal-blog',
    description: '基于 Spring Boot + Nuxt 4 构建的现代个人博客系统，支持 Markdown、评论、弹幕等功能',
    language: 'Java',
    languageColor: '#b07219',
    stars: 128,
    forks: 32,
    url: 'https://github.com',
    topics: ['spring-boot', 'nuxt', 'blog'],
  },
  {
    name: 'algorithm-notes',
    description: '个人算法学习笔记，涵盖数据结构与算法、LeetCode 题解、竞赛模板',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 86,
    forks: 18,
    url: 'https://github.com',
    topics: ['algorithm', 'leetcode', 'python'],
  },
  {
    name: 'spring-practice',
    description: 'Spring Boot 实战项目集合，包含权限管理、文件服务、定时任务等模块',
    language: 'Java',
    languageColor: '#b07219',
    stars: 64,
    forks: 20,
    url: 'https://github.com',
    topics: ['spring', 'java', 'microservice'],
  },
  {
    name: 'vue-components',
    description: '常用 Vue 3 + TypeScript 组件库，包含无限滚动、虚拟列表、拖拽排序等',
    language: 'TypeScript',
    languageColor: '#2b7489',
    stars: 45,
    forks: 12,
    url: 'https://github.com',
    topics: ['vue3', 'typescript', 'components'],
  },
]

const currentIndex = ref(0)
const autoPlayTimer = ref<ReturnType<typeof setInterval> | null>(null)

function next() {
  currentIndex.value = (currentIndex.value + 1) % projects.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + projects.length) % projects.length
}

function goTo(index: number) {
  currentIndex.value = index
}

function startAutoPlay() {
  autoPlayTimer.value = setInterval(next, 4000)
}

function stopAutoPlay() {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

const currentProject = computed(() => projects[currentIndex.value])
</script>

<template>
  <div
    class="projects-section"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <h2 class="section-title">开源项目</h2>

    <div class="carousel-wrapper">
      <!-- Project Card -->
      <div class="project-card">
        <div class="project-header">
          <span class="project-icon">📦</span>
          <a :href="currentProject.url" target="_blank" rel="noopener" class="project-name">
            {{ currentProject.name }}
          </a>
          <span class="project-lang">
            <span
              class="lang-dot"
              :style="{ background: currentProject.languageColor }"
            />
            {{ currentProject.language }}
          </span>
        </div>

        <p class="project-desc">{{ currentProject.description }}</p>

        <div class="project-topics">
          <span v-for="topic in currentProject.topics" :key="topic" class="topic-tag">
            {{ topic }}
          </span>
        </div>

        <div class="project-stats">
          <span class="stat-item">⭐ {{ currentProject.stars }}</span>
          <span class="stat-item">🍴 {{ currentProject.forks }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="carousel-controls">
        <button class="carousel-btn" aria-label="上一个" @click="prev">‹</button>
        <div class="carousel-dots">
          <button
            v-for="(_, i) in projects"
            :key="i"
            class="dot"
            :class="{ 'dot--active': i === currentIndex }"
            :aria-label="`第${i + 1}个项目`"
            @click="goTo(i)"
          />
        </div>
        <button class="carousel-btn" aria-label="下一个" @click="next">›</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem;
}

.carousel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Project Card */
.project-card {
  padding: 1.125rem;
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-height: 140px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-icon {
  font-size: 1rem;
}

.project-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #a78bfa;
  text-decoration: none;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-name:hover {
  text-decoration: underline;
}

.project-lang {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.project-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-topics {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.topic-tag {
  font-size: 0.68rem;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.project-stats {
  display: flex;
  gap: 0.875rem;
  margin-top: auto;
}

.stat-item {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

/* Carousel Controls */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.carousel-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  padding: 0;
  line-height: 1;
}

.carousel-btn:hover {
  background: rgba(167, 139, 250, 0.2);
  color: #a78bfa;
}

.carousel-dots {
  display: flex;
  gap: 0.375rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}

.dot--active {
  background: #a78bfa;
  transform: scale(1.3);
}
</style>
