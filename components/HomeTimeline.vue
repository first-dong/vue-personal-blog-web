<script setup lang="ts">
interface TimelineItem {
  year: string
  title: string
  org: string
  desc: string
  icon: string
  type: 'education' | 'work' | 'project'
}

const timeline: TimelineItem[] = [
  {
    year: '2024 - 至今',
    title: '全栈工程师',
    org: '某互联网公司',
    desc: '负责核心业务系统的架构设计与开发，主导微服务拆分，技术栈 Spring Cloud + Vue 3。',
    icon: '💼',
    type: 'work',
  },
  {
    year: '2023',
    title: '个人博客系统',
    org: '开源项目',
    desc: '独立开发基于 Spring Boot + Nuxt 4 的个人博客，支持 Markdown、弹幕、评论等功能。',
    icon: '🚀',
    type: 'project',
  },
  {
    year: '2022 - 2023',
    title: '后端开发工程师',
    org: '某科技公司',
    desc: '参与电商平台开发，负责订单、库存、支付等核心模块，优化数据库性能提升30%。',
    icon: '💼',
    type: 'work',
  },
  {
    year: '2018 - 2022',
    title: '计算机科学与技术 本科',
    org: '某重点大学',
    desc: '主修数据结构、操作系统、计算机网络，连续三年获学业奖学金。',
    icon: '🎓',
    type: 'education',
  },
]

const typeColorMap: Record<string, string> = {
  education: '#10b981',
  work: '#6366f1',
  project: '#f59e0b',
}
</script>

<template>
  <div class="timeline-section">
    <h2 class="section-title">个人经历</h2>
    <div class="timeline">
      <div
        v-for="(item, index) in timeline"
        :key="index"
        class="timeline-item"
      >
        <!-- 左侧时间轴线 -->
        <div class="timeline-line">
          <div
            class="timeline-node"
            :style="{ background: typeColorMap[item.type], boxShadow: `0 0 8px ${typeColorMap[item.type]}66` }"
          >
            <span class="node-icon">{{ item.icon }}</span>
          </div>
          <div v-if="index < timeline.length - 1" class="timeline-connector" />
        </div>

        <!-- 右侧内容 -->
        <div class="timeline-content">
          <div class="timeline-year">{{ item.year }}</div>
          <div class="timeline-card">
            <div class="card-header">
              <span class="card-title">{{ item.title }}</span>
              <span
                class="card-badge"
                :style="{ color: typeColorMap[item.type], background: typeColorMap[item.type] + '1a' }"
              >{{ item.org }}</span>
            </div>
            <p class="card-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-section {
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

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 0.875rem;
}

/* Left axis */
.timeline-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 36px;
}

.timeline-node {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.node-icon {
  font-size: 1rem;
}

.timeline-connector {
  flex: 1;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
  min-height: 20px;
}

/* Right content */
.timeline-content {
  flex: 1;
  padding-bottom: 1.25rem;
}

.timeline-year {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.4rem;
  margin-top: 0.5rem;
}

.timeline-card {
  padding: 0.875rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.card-badge {
  font-size: 0.68rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.card-desc {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  line-height: 1.55;
}
</style>
