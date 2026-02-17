<template>
  <div class="profile-card">
    <div class="avatar-wrapper">
      <div class="avatar-ring" />
      <img
        :src="avatarUrl"
        :alt="name"
        class="avatar-image"
      />
    </div>

    <h1 class="profile-name">{{ name }}</h1>
    <p class="profile-title">{{ title }}</p>

    <!-- 打字机效果标语 -->
    <div class="typewriter-container">
      <p class="typewriter-text">
        {{ displayedText }}<span class="cursor">|</span>
      </p>
    </div>

    <!-- 社交链接 -->
    <div class="social-links">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        :class="['social-link', social.color]"
        :title="social.name"
      >
        <component :is="social.icon" />
      </a>
    </div>

    <!-- 统计信息 -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: string
  title?: string
  motto?: string
  avatarUrl?: string
}>()

const name = computed(() => props.name || '开发者')
const title = computed(() => props.title || '全栈工程师')
const motto = computed(() => props.motto || '代码改变世界，创新驱动未来 🚀')
const avatarUrl = computed(() => props.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Developer')

const displayedText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const typingSpeed = ref(150)

// Social links
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    color: 'github',
    icon: 'IconGithub',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    color: 'twitter',
    icon: 'IconTwitter',
  },
  {
    name: 'Email',
    url: 'mailto:contact@example.com',
    color: 'email',
    icon: 'IconEmail',
  },
]

// Stats
const stats = ref([
  { label: '文章', value: '0' },
  { label: '浏览', value: '0' },
  { label: '点赞', value: '0' },
])

function typeWriter(): void {
  const fullText = motto.value

  if (!isDeleting.value && currentIndex.value < fullText.length) {
    displayedText.value = fullText.substring(0, currentIndex.value + 1)
    currentIndex.value++
    typingSpeed.value = 100 + Math.random() * 100
  } else if (isDeleting.value && currentIndex.value > 0) {
    displayedText.value = fullText.substring(0, currentIndex.value - 1)
    currentIndex.value--
    typingSpeed.value = 50
  } else if (!isDeleting.value && currentIndex.value === fullText.length) {
    // Pause at end before deleting
    setTimeout(() => {
      isDeleting.value = true
    }, 2000)
    return
  } else if (isDeleting.value && currentIndex.value === 0) {
    isDeleting.value = false
  }

  setTimeout(typeWriter, typingSpeed.value)
}

onMounted(() => {
  setTimeout(typeWriter, 500)
})
</script>

<style scoped>
.profile-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 400px;
  position: relative;
  overflow: hidden;
}

.dark .profile-card {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(75, 85, 99, 0.3);
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  animation: rotate 3s linear infinite;
}

.avatar-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  z-index: 1;
}

.dark .avatar-image {
  border-color: #1f2937;
}

.profile-name {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dark .profile-name {
  color: #f9fafb;
}

.profile-title {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.dark .profile-title {
  color: #9ca3af;
}

.typewriter-container {
  min-height: 3rem;
  margin-bottom: 1.5rem;
}

.typewriter-text {
  font-size: 0.875rem;
  color: #4b5563;
  font-style: italic;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .typewriter-text {
  color: #d1d5db;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  color: #667eea;
  font-weight: bold;
}

.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 1.25rem;
}

.social-link.github {
  background: #333;
  color: white;
}

.social-link.twitter {
  background: #1da1f2;
  color: white;
}

.social-link.email {
  background: #ea4335;
  color: white;
}

.social-link:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .stats-grid {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.dark .stat-label {
  color: #9ca3af;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
