<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: '数据展示 - PersonalBlog',
  description: '站点统计、最新文章、技能展示、项目轮播与个人经历',
})
</script>

<template>
  <div class="home-data-page">
    <!-- 页面背景 -->
    <div class="page-bg" />

    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">探索更多</h1>
        <p class="page-subtitle">站点统计 · 最新文章 · 技能栈 · 开源项目 · 个人经历</p>
      </div>

      <!-- 主内容布局：左右两栏 -->
      <div class="content-layout">
        <!-- 左栏 -->
        <div class="left-col">
          <!-- 站点统计 -->
          <section class="section-block">
            <HomeSiteStats />
          </section>

          <!-- 最新文章 -->
          <section class="section-block">
            <HomeLatestArticles />
          </section>
        </div>

        <!-- 右栏 -->
        <div class="right-col">
          <!-- 技能展示 -->
          <section class="section-block">
            <HomeSkills />
          </section>

          <!-- 项目展示 -->
          <section class="section-block">
            <HomeProjects />
          </section>

          <!-- 个人经历时间线 -->
          <section class="section-block">
            <HomeTimeline />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-data-page {
  min-height: 100vh;
  position: relative;
  padding-top: 5rem;
  padding-bottom: 4rem;
}

.page-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #0c1a2e 100%);
  z-index: -1;
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #a78bfa, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* 两栏布局 */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.25rem;
  padding: 1.25rem;
  backdrop-filter: blur(8px);
  animation: fadeInUp 0.6s ease-out both;
}

.section-block:nth-child(1) { animation-delay: 0.1s; }
.section-block:nth-child(2) { animation-delay: 0.2s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式：单栏 */
@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}
</style>
