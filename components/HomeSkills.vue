<script setup lang="ts">
interface Skill {
  name: string
  level: number // 0-100
  color: string
  icon: string
}

const skills: Skill[] = [
  { name: 'Java / Spring Boot', level: 90, color: '#f59e0b', icon: '☕' },
  { name: 'Vue 3 / Nuxt', level: 85, color: '#42b883', icon: '💚' },
  { name: 'TypeScript', level: 80, color: '#3b82f6', icon: '🔷' },
  { name: 'MySQL / Redis', level: 78, color: '#ef4444', icon: '🗄️' },
  { name: 'Docker / Linux', level: 70, color: '#8b5cf6', icon: '🐳' },
  { name: 'Python', level: 65, color: '#10b981', icon: '🐍' },
]

// 控制进度条动画
const animated = ref(false)

onMounted(() => {
  // 延迟触发动画，确保组件可见
  setTimeout(() => { animated.value = true }, 200)
})
</script>

<template>
  <div class="skills-section">
    <h2 class="section-title">技能栈</h2>
    <div class="skills-list">
      <div v-for="skill in skills" :key="skill.name" class="skill-item">
        <div class="skill-header">
          <div class="skill-name">
            <span class="skill-icon">{{ skill.icon }}</span>
            <span>{{ skill.name }}</span>
          </div>
          <span class="skill-level" :style="{ color: skill.color }">{{ skill.level }}%</span>
        </div>
        <div class="skill-bar-bg">
          <div
            class="skill-bar-fill"
            :style="{
              width: animated ? `${skill.level}%` : '0%',
              background: `linear-gradient(90deg, ${skill.color}99, ${skill.color})`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-section {
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

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.skill-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-name {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.skill-icon {
  font-size: 1rem;
}

.skill-level {
  font-size: 0.78rem;
  font-weight: 600;
}

.skill-bar-bg {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
