<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: '个人简历 - PersonalBlog',
  description: '全栈工程师个人简历，包含工作经历、教育经历、技能与项目经验',
})

// ---------------------- 数据定义 ----------------------

interface WorkExperience {
  period: string
  company: string
  position: string
  location: string
  description: string
  achievements: string[]
}

interface Education {
  period: string
  school: string
  degree: string
  major: string
  gpa?: string
  honors?: string[]
}

interface Skill {
  name: string
  level: number // 1-5
  category: string
  color: string
}

interface Project {
  name: string
  period: string
  role: string
  techStack: string[]
  description: string
  highlights: string[]
  link?: string
}

interface Certificate {
  name: string
  issuer: string
  date: string
  icon: string
}

const basicInfo = {
  name: '张明',
  title: '全栈工程师',
  avatar: '/favicon.ico',
  email: 'example@email.com',
  phone: '138-****-8888',
  location: '广州，中国',
  github: 'github.com/username',
  blog: 'blog.example.com',
  summary:
    '5年全栈开发经验，擅长 Java 后端架构与 Vue/React 前端开发。热爱开源，主导过多个百万级用户产品的技术迭代。注重代码质量与工程效率，具备从0到1独立完成项目的能力。',
}

const workExperiences: WorkExperience[] = [
  {
    period: '2024.03 - 至今',
    company: '某互联网公司',
    position: '高级全栈工程师',
    location: '广州',
    description: '负责核心业务系统的架构设计与开发，推动团队工程化建设。',
    achievements: [
      '主导微服务架构重构，将系统响应时间降低40%',
      '设计并实现统一认证平台，支持 OAuth2 + JWT，日活50万+',
      '引入 CI/CD 流程，部署效率提升60%',
      '带领5人团队完成核心业务模块从0到1的开发',
    ],
  },
  {
    period: '2022.06 - 2024.02',
    company: '某科技公司',
    position: '后端开发工程师',
    location: '深圳',
    description: '参与电商平台核心模块开发与优化工作。',
    achievements: [
      '负责订单、库存、支付核心模块开发，日均处理订单10万+',
      '优化数据库查询，性能提升30%，减少慢查询80%',
      '实现分布式锁解决高并发库存扣减问题',
      '推动团队单元测试覆盖率从20%提升到70%',
    ],
  },
  {
    period: '2021.07 - 2022.05',
    company: '某创业公司',
    position: '前端开发工程师',
    location: '广州',
    description: '负责公司 SaaS 产品前端开发与维护。',
    achievements: [
      '独立开发 SaaS 管理后台，服务300+企业客户',
      '基于 Vue 3 重构老项目，首屏加载时间减少50%',
      '封装通用组件库，覆盖20+业务场景，提升开发效率',
    ],
  },
]

const educations: Education[] = [
  {
    period: '2018 - 2022',
    school: '某重点大学',
    degree: '本科',
    major: '计算机科学与技术',
    gpa: '3.85/4.0',
    honors: ['连续三年一等奖学金', '优秀毕业生', '学生科技创新大赛一等奖'],
  },
]

const skills: Skill[] = [
  // 后端
  { name: 'Java', level: 5, category: '后端', color: '#f97316' },
  { name: 'Spring Boot', level: 5, category: '后端', color: '#22c55e' },
  { name: 'Spring Cloud', level: 4, category: '后端', color: '#16a34a' },
  { name: 'MyBatis-Plus', level: 4, category: '后端', color: '#3b82f6' },
  { name: 'MySQL', level: 4, category: '后端', color: '#06b6d4' },
  { name: 'Redis', level: 4, category: '后端', color: '#ef4444' },
  // 前端
  { name: 'Vue 3', level: 5, category: '前端', color: '#10b981' },
  { name: 'TypeScript', level: 4, category: '前端', color: '#3b82f6' },
  { name: 'Nuxt 4', level: 4, category: '前端', color: '#6366f1' },
  { name: 'React', level: 3, category: '前端', color: '#38bdf8' },
  { name: 'Tailwind CSS', level: 4, category: '前端', color: '#38bdf8' },
  // 运维
  { name: 'Docker', level: 4, category: '运维/工具', color: '#2563eb' },
  { name: 'Linux', level: 4, category: '运维/工具', color: '#f59e0b' },
  { name: 'Git', level: 5, category: '运维/工具', color: '#f43f5e' },
  { name: 'Nginx', level: 3, category: '运维/工具', color: '#22c55e' },
]

const skillCategories = [...new Set(skills.map((s) => s.category))]

const projects: Project[] = [
  {
    name: 'PersonalBlog - 个人博客系统',
    period: '2023.09 - 至今',
    role: '独立开发',
    techStack: ['Spring Boot 3', 'Nuxt 4', 'Vue 3', 'MySQL', 'Redis', 'Docker'],
    description: '基于 Spring Boot + Nuxt 4 的现代化个人博客，支持 Markdown 编写、弹幕互动、评论、文件上传等功能。',
    highlights: [
      '前后端分离架构，JWT 鉴权，Spring Security 安全防护',
      '集成弹幕系统（防重叠算法 + 实时轮询），支持颜色自定义',
      '管理后台：文章、评论、弹幕、分类标签的完整 CRUD',
      'Docker Compose 一键部署，Nginx 反向代理 + SSL',
    ],
    link: 'github.com/username/blog',
  },
  {
    name: '电商平台订单系统重构',
    period: '2023.03 - 2023.08',
    role: '技术负责人',
    techStack: ['Spring Cloud', 'Kafka', 'Redis', 'MySQL', 'Elasticsearch'],
    description: '将单体订单系统拆分为微服务，解决高并发下的性能瓶颈与数据一致性问题。',
    highlights: [
      '引入 Saga 模式解决分布式事务，保障数据最终一致性',
      '基于 Kafka 实现异步削峰，日均处理订单从5万提升到30万',
      '使用 Redis 分布式锁 + 乐观锁解决超卖问题',
      'Elasticsearch 实现订单全文搜索，响应时间 < 50ms',
    ],
  },
  {
    name: 'SaaS 企业管理平台',
    period: '2021.09 - 2022.05',
    role: '前端负责人',
    techStack: ['Vue 3', 'TypeScript', 'Element Plus', 'Echarts', 'Vite'],
    description: '多租户 SaaS 管理平台，为企业提供人事、财务、项目管理一体化解决方案。',
    highlights: [
      '设计多租户数据隔离方案，支持白标定制（主题色、Logo）',
      '封装20+通用业务组件，提升团队开发效率40%',
      '实现基于权限的动态路由，细粒度按钮级权限控制',
      'Vite 工程化优化，构建时间从120s降低到18s',
    ],
  },
]

const certificates: Certificate[] = [
  {
    name: '阿里云 ACA 云计算工程师认证',
    issuer: '阿里云',
    date: '2023.06',
    icon: '☁️',
  },
  {
    name: 'Oracle Java SE 11 认证',
    issuer: 'Oracle',
    date: '2022.09',
    icon: '☕',
  },
  {
    name: '全国计算机等级考试四级（网络工程师）',
    issuer: '教育部考试中心',
    date: '2021.12',
    icon: '🏆',
  },
  {
    name: '英语六级（CET-6）',
    issuer: '全国英语等级考试委员会',
    date: '2020.06',
    icon: '🌐',
  },
]

// ---------------------- 当前激活的导航节 ----------------------
const activeSection = ref('about')
const navItems = [
  { id: 'about', label: '基本信息', icon: 'i-heroicons-user' },
  { id: 'work', label: '工作经历', icon: 'i-heroicons-briefcase' },
  { id: 'education', label: '教育经历', icon: 'i-heroicons-academic-cap' },
  { id: 'skills', label: '技能', icon: 'i-heroicons-code-bracket' },
  { id: 'projects', label: '项目经验', icon: 'i-heroicons-rocket-launch' },
  { id: 'certificates', label: '荣誉证书', icon: 'i-heroicons-trophy' },
]

function scrollToSection(id: string) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    const offset = 80
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// ---------------------- 滚动监听 ----------------------
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  )

  for (const item of navItems) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }

  onUnmounted(() => observer.disconnect())
})

// ---------------------- PDF 导出 ----------------------
const isExporting = ref(false)

async function exportPdf() {
  if (isExporting.value) return
  isExporting.value = true
  try {
    const { default: html2pdf } = await import('html2pdf.js')
    const element = document.getElementById('resume-content')
    if (!element) return

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${basicInfo.name}-个人简历.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    await html2pdf().set(opt).from(element).save()
  }
  catch (err) {
    console.error('PDF 导出失败:', err)
  }
  finally {
    isExporting.value = false
  }
}

// ---------------------- 打印 ----------------------
function printResume() {
  window.print()
}

// ---------------------- 工具 ----------------------
function getLevelLabel(level: number): string {
  const labels = ['', '入门', '基础', '熟练', '精通', '专家']
  return labels[level] ?? ''
}
</script>

<template>
  <div class="resume-page">
    <!-- 页面背景 -->
    <div class="page-bg" />

    <div class="resume-container">
      <!-- 顶部操作栏 -->
      <div class="top-bar">
        <div class="top-bar-left">
          <h1 class="page-heading">个人简历</h1>
          <p class="page-sub">CURRICULUM VITAE</p>
        </div>
        <div class="top-bar-right">
          <button class="action-btn print-btn" @click="printResume">
            <UIcon name="i-heroicons-printer" class="btn-icon" />
            打印
          </button>
          <button
            class="action-btn export-btn"
            :disabled="isExporting"
            @click="exportPdf"
          >
            <UIcon
              :name="isExporting ? 'i-heroicons-arrow-path' : 'i-heroicons-arrow-down-tray'"
              class="btn-icon"
              :class="{ 'spin': isExporting }"
            />
            {{ isExporting ? '导出中...' : '导出 PDF' }}
          </button>
        </div>
      </div>

      <!-- 主布局：左侧导航 + 右侧内容 -->
      <div class="resume-layout">
        <!-- 左侧导航 -->
        <aside class="resume-sidebar">
          <div class="sidebar-sticky">
            <!-- 快速头像 -->
            <div class="sidebar-profile">
              <div class="sidebar-avatar">
                <span class="avatar-text">{{ basicInfo.name[0] }}</span>
              </div>
              <div class="sidebar-name">{{ basicInfo.name }}</div>
              <div class="sidebar-title">{{ basicInfo.title }}</div>
            </div>

            <!-- 导航菜单 -->
            <nav class="sidebar-nav">
              <button
                v-for="item in navItems"
                :key="item.id"
                class="nav-item"
                :class="{ active: activeSection === item.id }"
                @click="scrollToSection(item.id)"
              >
                <UIcon :name="item.icon" class="nav-icon" />
                {{ item.label }}
              </button>
            </nav>

            <!-- 联系方式 -->
            <div class="sidebar-contact">
              <div class="contact-item">
                <UIcon name="i-heroicons-envelope" class="contact-icon" />
                <span>{{ basicInfo.email }}</span>
              </div>
              <div class="contact-item">
                <UIcon name="i-heroicons-phone" class="contact-icon" />
                <span>{{ basicInfo.phone }}</span>
              </div>
              <div class="contact-item">
                <UIcon name="i-heroicons-map-pin" class="contact-icon" />
                <span>{{ basicInfo.location }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <main id="resume-content" class="resume-main">
          <!-- 1. 基本信息 -->
          <section id="about" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-user" class="section-icon" />
              <h2 class="section-title">基本信息</h2>
            </div>

            <div class="about-card">
              <!-- 个人信息头 -->
              <div class="about-header">
                <div class="about-avatar">
                  <span class="about-avatar-text">{{ basicInfo.name[0] }}</span>
                </div>
                <div class="about-info">
                  <h3 class="about-name">{{ basicInfo.name }}</h3>
                  <p class="about-title">{{ basicInfo.title }}</p>
                  <div class="about-meta">
                    <span class="meta-item">
                      <UIcon name="i-heroicons-map-pin" class="meta-icon" />
                      {{ basicInfo.location }}
                    </span>
                    <span class="meta-item">
                      <UIcon name="i-heroicons-envelope" class="meta-icon" />
                      {{ basicInfo.email }}
                    </span>
                  </div>
                  <div class="about-links">
                    <a :href="`https://${basicInfo.github}`" target="_blank" class="about-link">
                      <UIcon name="i-simple-icons-github" class="link-icon" />
                      {{ basicInfo.github }}
                    </a>
                    <a :href="`https://${basicInfo.blog}`" target="_blank" class="about-link">
                      <UIcon name="i-heroicons-globe-alt" class="link-icon" />
                      {{ basicInfo.blog }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- 个人简介 -->
              <div class="about-summary">
                <p>{{ basicInfo.summary }}</p>
              </div>
            </div>
          </section>

          <!-- 2. 工作经历 -->
          <section id="work" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-briefcase" class="section-icon" />
              <h2 class="section-title">工作经历</h2>
            </div>

            <div class="timeline">
              <div
                v-for="(job, index) in workExperiences"
                :key="index"
                class="timeline-item"
              >
                <div class="timeline-marker">
                  <div class="timeline-dot" />
                  <div v-if="index < workExperiences.length - 1" class="timeline-line" />
                </div>
                <div class="timeline-body">
                  <div class="timeline-card">
                    <div class="job-header">
                      <div class="job-main">
                        <h3 class="job-position">{{ job.position }}</h3>
                        <span class="job-company">{{ job.company }}</span>
                      </div>
                      <div class="job-meta">
                        <span class="job-period">{{ job.period }}</span>
                        <span class="job-location">
                          <UIcon name="i-heroicons-map-pin" class="meta-icon-sm" />
                          {{ job.location }}
                        </span>
                      </div>
                    </div>
                    <p class="job-desc">{{ job.description }}</p>
                    <ul class="achievement-list">
                      <li
                        v-for="(ach, i) in job.achievements"
                        :key="i"
                        class="achievement-item"
                      >
                        <span class="achievement-bullet" />
                        {{ ach }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. 教育经历 -->
          <section id="education" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-academic-cap" class="section-icon" />
              <h2 class="section-title">教育经历</h2>
            </div>

            <div class="edu-list">
              <div
                v-for="(edu, index) in educations"
                :key="index"
                class="edu-card"
              >
                <div class="edu-left">
                  <div class="edu-icon">🎓</div>
                </div>
                <div class="edu-right">
                  <div class="edu-header">
                    <h3 class="edu-school">{{ edu.school }}</h3>
                    <span class="edu-period">{{ edu.period }}</span>
                  </div>
                  <div class="edu-degree">
                    {{ edu.degree }} · {{ edu.major }}
                    <span v-if="edu.gpa" class="edu-gpa">GPA: {{ edu.gpa }}</span>
                  </div>
                  <div v-if="edu.honors && edu.honors.length" class="edu-honors">
                    <span
                      v-for="honor in edu.honors"
                      :key="honor"
                      class="honor-tag"
                    >{{ honor }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 4. 技能 -->
          <section id="skills" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-code-bracket" class="section-icon" />
              <h2 class="section-title">技能</h2>
            </div>

            <div class="skills-wrapper">
              <div
                v-for="category in skillCategories"
                :key="category"
                class="skill-group"
              >
                <h3 class="skill-category">{{ category }}</h3>
                <div class="skill-cloud">
                  <div
                    v-for="skill in skills.filter(s => s.category === category)"
                    :key="skill.name"
                    class="skill-tag"
                    :style="{
                      borderColor: skill.color + '66',
                      background: skill.color + '18',
                    }"
                  >
                    <span class="skill-dots">
                      <span
                        v-for="n in 5"
                        :key="n"
                        class="skill-dot"
                        :class="{ active: n <= skill.level }"
                        :style="n <= skill.level ? { background: skill.color } : {}"
                      />
                    </span>
                    <span class="skill-name" :style="{ color: skill.color }">{{ skill.name }}</span>
                    <span class="skill-level-label">{{ getLevelLabel(skill.level) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 5. 项目经验 -->
          <section id="projects" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-rocket-launch" class="section-icon" />
              <h2 class="section-title">项目经验</h2>
            </div>

            <div class="project-list">
              <div
                v-for="(project, index) in projects"
                :key="index"
                class="project-card"
              >
                <div class="project-header">
                  <div class="project-title-row">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <a
                      v-if="project.link"
                      :href="`https://${project.link}`"
                      target="_blank"
                      class="project-link"
                    >
                      <UIcon name="i-heroicons-arrow-top-right-on-square" class="link-icon-sm" />
                    </a>
                  </div>
                  <div class="project-meta">
                    <span class="project-period">{{ project.period }}</span>
                    <span class="project-role">{{ project.role }}</span>
                  </div>
                </div>

                <div class="project-tech">
                  <span
                    v-for="tech in project.techStack"
                    :key="tech"
                    class="tech-tag"
                  >{{ tech }}</span>
                </div>

                <p class="project-desc">{{ project.description }}</p>

                <ul class="project-highlights">
                  <li
                    v-for="(hl, i) in project.highlights"
                    :key="i"
                    class="highlight-item"
                  >
                    <span class="highlight-bullet" />
                    {{ hl }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 6. 荣誉证书 -->
          <section id="certificates" class="resume-section">
            <div class="section-header">
              <UIcon name="i-heroicons-trophy" class="section-icon" />
              <h2 class="section-title">荣誉证书</h2>
            </div>

            <div class="cert-grid">
              <div
                v-for="(cert, index) in certificates"
                :key="index"
                class="cert-card"
              >
                <div class="cert-icon">{{ cert.icon }}</div>
                <div class="cert-info">
                  <div class="cert-name">{{ cert.name }}</div>
                  <div class="cert-meta">
                    <span class="cert-issuer">{{ cert.issuer }}</span>
                    <span class="cert-date">{{ cert.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面基础 ===== */
.resume-page {
  min-height: 100vh;
  position: relative;
}

.page-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.dark .page-bg {
  background: radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
}

.resume-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  position: relative;
  z-index: 1;
}

/* ===== 顶部操作栏 ===== */
.top-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-heading {
  font-size: 2rem;
  font-weight: 800;
  color: rgb(15 23 42);
  margin: 0;
  line-height: 1.1;
}

.dark .page-heading {
  color: #fff;
}

.page-sub {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: rgb(100 116 139);
  margin: 0.25rem 0 0;
}

.top-bar-right {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.print-btn {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.3);
}

.print-btn:hover {
  background: rgba(99, 102, 241, 0.2);
}

.export-btn {
  background: #6366f1;
  color: #fff;
}

.export-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.export-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== 主布局 ===== */
.resume-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  .resume-layout {
    grid-template-columns: 1fr;
  }

  .resume-sidebar {
    display: none;
  }
}

/* ===== 左侧导航 ===== */
.resume-sidebar {
  position: sticky;
  top: 5rem;
}

.sidebar-sticky {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  backdrop-filter: blur(12px);
}

.dark .sidebar-sticky {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.08);
}

.sidebar-profile {
  text-align: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .sidebar-profile {
  border-color: rgba(255, 255, 255, 0.08);
}

.sidebar-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.avatar-text {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
}

.sidebar-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(15 23 42);
}

.dark .sidebar-name {
  color: #fff;
}

.sidebar-title {
  font-size: 0.75rem;
  color: rgb(100 116 139);
  margin-top: 0.2rem;
}

/* 导航菜单 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgb(71 85 105);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border: none;
  background: transparent;
  width: 100%;
}

.dark .nav-item {
  color: rgba(255, 255, 255, 0.6);
}

.nav-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  font-weight: 600;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* 联系方式 */
.sidebar-contact {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dark .sidebar-contact {
  border-color: rgba(255, 255, 255, 0.08);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  color: rgb(100 116 139);
  word-break: break-all;
}

.contact-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  color: #6366f1;
}

/* ===== 右侧内容 ===== */
.resume-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===== 章节通用 ===== */
.resume-section {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 1rem;
  padding: 1.75rem;
  backdrop-filter: blur(12px);
}

.dark .resume-section {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(255, 255, 255, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .section-header {
  border-color: rgba(255, 255, 255, 0.08);
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6366f1;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: rgb(15 23 42);
  margin: 0;
}

.dark .section-title {
  color: #fff;
}

/* ===== 基本信息 ===== */
.about-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.about-header {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.about-avatar {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #6366f1, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.about-avatar-text {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
}

.about-info {
  flex: 1;
}

.about-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: rgb(15 23 42);
  margin: 0 0 0.25rem;
}

.dark .about-name {
  color: #fff;
}

.about-title {
  font-size: 0.9rem;
  color: #6366f1;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: rgb(71 85 105);
}

.dark .meta-item {
  color: rgba(255, 255, 255, 0.55);
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.about-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #6366f1;
  text-decoration: none;
  transition: opacity 0.2s;
}

.about-link:hover {
  opacity: 0.75;
}

.link-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.about-summary {
  background: rgba(99, 102, 241, 0.06);
  border-left: 3px solid #6366f1;
  padding: 0.875rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.about-summary p {
  font-size: 0.875rem;
  color: rgb(71 85 105);
  line-height: 1.7;
  margin: 0;
}

.dark .about-summary p {
  color: rgba(255, 255, 255, 0.65);
}

/* ===== 工作经历时间线 ===== */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 1rem;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
  margin-top: 0.4rem;
}

.timeline-line {
  flex: 1;
  width: 2px;
  background: rgba(99, 102, 241, 0.2);
  margin: 0.5rem 0;
  min-height: 20px;
}

.timeline-body {
  flex: 1;
  padding-bottom: 1.5rem;
}

.timeline-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.5);
}

.dark .timeline-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.job-main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.job-position {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(15 23 42);
  margin: 0;
}

.dark .job-position {
  color: #fff;
}

.job-company {
  font-size: 0.8rem;
  color: #6366f1;
  font-weight: 500;
}

.job-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.job-period {
  font-size: 0.78rem;
  color: rgb(100 116 139);
  white-space: nowrap;
}

.job-location {
  font-size: 0.72rem;
  color: rgb(100 116 139);
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.meta-icon-sm {
  width: 0.75rem;
  height: 0.75rem;
}

.job-desc {
  font-size: 0.8rem;
  color: rgb(71 85 105);
  margin: 0 0 0.75rem;
  line-height: 1.6;
}

.dark .job-desc {
  color: rgba(255, 255, 255, 0.55);
}

.achievement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.achievement-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgb(51 65 85);
  line-height: 1.55;
}

.dark .achievement-item {
  color: rgba(255, 255, 255, 0.65);
}

.achievement-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #6366f1;
  flex-shrink: 0;
  margin-top: 0.45rem;
}

/* ===== 教育经历 ===== */
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edu-card {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
}

.dark .edu-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.edu-left {
  flex-shrink: 0;
}

.edu-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 0.75rem;
}

.edu-right {
  flex: 1;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.edu-school {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(15 23 42);
  margin: 0;
}

.dark .edu-school {
  color: #fff;
}

.edu-period {
  font-size: 0.78rem;
  color: rgb(100 116 139);
}

.edu-degree {
  font-size: 0.85rem;
  color: rgb(71 85 105);
  margin-bottom: 0.625rem;
}

.dark .edu-degree {
  color: rgba(255, 255, 255, 0.6);
}

.edu-gpa {
  margin-left: 0.75rem;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.edu-honors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.honor-tag {
  font-size: 0.72rem;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* ===== 技能标签云 ===== */
.skills-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skill-category {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(100 116 139);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
}

.skill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid;
  font-size: 0.8rem;
  transition: transform 0.2s;
}

.skill-tag:hover {
  transform: translateY(-2px);
}

.skill-dots {
  display: flex;
  gap: 2px;
  align-items: center;
}

.skill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
}

.dark .skill-dot {
  background: rgba(255, 255, 255, 0.15);
}

.skill-dot.active {
  /* color set by inline style */
}

.skill-name {
  font-weight: 600;
}

.skill-level-label {
  font-size: 0.68rem;
  color: rgb(148 163 184);
}

/* ===== 项目经验 ===== */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.project-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  transition: border-color 0.2s;
}

.dark .project-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.project-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
}

.project-header {
  margin-bottom: 0.75rem;
}

.project-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.project-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(15 23 42);
  margin: 0;
}

.dark .project-name {
  color: #fff;
}

.project-link {
  color: #6366f1;
  display: flex;
}

.link-icon-sm {
  width: 0.875rem;
  height: 0.875rem;
}

.project-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: rgb(100 116 139);
}

.project-role {
  color: #6366f1;
  font-weight: 500;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.tech-tag {
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.project-desc {
  font-size: 0.8rem;
  color: rgb(71 85 105);
  line-height: 1.6;
  margin: 0 0 0.75rem;
}

.dark .project-desc {
  color: rgba(255, 255, 255, 0.55);
}

.project-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.highlight-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgb(51 65 85);
  line-height: 1.55;
}

.dark .highlight-item {
  color: rgba(255, 255, 255, 0.65);
}

.highlight-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
  margin-top: 0.45rem;
}

/* ===== 荣誉证书 ===== */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.cert-card {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  padding: 1rem 1.125rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  transition: border-color 0.2s, transform 0.2s;
}

.dark .cert-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.cert-card:hover {
  border-color: rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

.cert-icon {
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;
}

.cert-info {
  flex: 1;
}

.cert-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgb(15 23 42);
  line-height: 1.4;
  margin-bottom: 0.375rem;
}

.dark .cert-name {
  color: rgba(255, 255, 255, 0.9);
}

.cert-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.72rem;
  color: rgb(100 116 139);
}

.cert-date {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

/* ===== 打印样式优化 ===== */
@media print {
  .page-bg,
  .top-bar,
  .resume-sidebar {
    display: none !important;
  }

  .resume-container {
    max-width: 100%;
    padding: 0;
  }

  .resume-layout {
    grid-template-columns: 1fr;
  }

  .resume-section {
    background: #fff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 0 !important;
    backdrop-filter: none !important;
    break-inside: avoid;
    margin-bottom: 1rem;
    page-break-inside: avoid;
  }

  .section-title {
    color: #0f172a !important;
  }

  .job-position,
  .edu-school,
  .project-name,
  .cert-name,
  .about-name {
    color: #0f172a !important;
  }

  .timeline-card,
  .edu-card,
  .project-card,
  .cert-card {
    background: #f8fafc !important;
    border-color: #e2e8f0 !important;
  }

  body {
    background: #fff !important;
  }
}
</style>
