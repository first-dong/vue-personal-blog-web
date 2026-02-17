<template>
  <div class="hero-page">
    <!-- 粒子背景 (客户端渲染) -->
    <ClientOnly>
      <ParticleBackground />
    </ClientOnly>

    <!-- 弹幕显示层 (客户端渲染) -->
    <ClientOnly>
      <DanmakuDisplay ref="danmakuDisplay" />
    </ClientOnly>

    <!-- 主内容区 -->
    <div class="hero-content">
      <!-- 个人介绍卡片 -->
      <div class="profile-wrapper">
        <ProfileCard
          name="博主"
          title="全栈工程师 / 技术爱好者"
          motto="用代码构建梦想，用文字记录思考 ✨"
          avatar-url="https://api.dicebear.com/7.x/avataaars/svg?seed=BlogDeveloper"
        />
      </div>

      <!-- 快速导航 -->
      <div class="quick-nav">
        <NuxtLink to="/articles" class="nav-card">
          <div class="nav-icon">📝</div>
          <div class="nav-text">
            <div class="nav-title">文章</div>
            <div class="nav-desc">探索技术文章</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/about" class="nav-card">
          <div class="nav-icon">👤</div>
          <div class="nav-text">
            <div class="nav-title">关于</div>
            <div class="nav-desc">了解博主</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 弹幕控制栏 (客户端渲染) -->
    <ClientOnly>
      <div class="danmaku-control-wrapper">
        <DanmakuControls @open-input="showDanmakuInput = true" />
      </div>
    </ClientOnly>

    <!-- 弹幕输入弹窗 -->
    <Transition name="modal">
      <div v-if="showDanmakuInput" class="modal-overlay" @click.self="showDanmakuInput = false">
        <div class="modal-content">
          <button
            type="button"
            class="modal-close"
            @click="showDanmakuInput = false"
          >
            ✕
          </button>
          <DanmakuInput @success="handleDanmakuSuccess" />
        </div>
      </div>
    </Transition>

    <!-- 滚动提示 -->
    <div class="scroll-hint">
      <div class="scroll-arrow" />
      <span>向下探索</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const showDanmakuInput = ref(false)

function handleDanmakuSuccess(): void {
  showDanmakuInput.value = false
}

useSeoMeta({
  title: 'PersonalBlog - 个人博客',
  description: '分享技术与生活的个人博客',
})
</script>

<style scoped>
.hero-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0f172a 60%, #0c1a2e 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-content {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 1200px;
  padding-top: 5rem;
}

.profile-wrapper {
  animation: fadeInUp 0.8s ease-out;
}

.quick-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  min-width: 150px;
}

.nav-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.nav-icon {
  font-size: 2rem;
}

.nav-title {
  font-size: 1rem;
  font-weight: 700;
}

.nav-desc {
  font-size: 0.75rem;
  opacity: 0.8;
}

.danmaku-control-wrapper {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 480px;
  animation: modalIn 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: -0.75rem;
  right: -0.75rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Scroll hint */
.scroll-hint {
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  animation: bounceAnim 2s infinite;
  z-index: 20;
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  transform: rotate(45deg);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bounceAnim {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .quick-nav {
    gap: 1rem;
  }

  .nav-card {
    min-width: 120px;
    padding: 0.75rem 1rem;
  }

  .danmaku-control-wrapper {
    bottom: 1rem;
    width: calc(100% - 2rem);
  }
}
</style>
