<template>
  <div ref="particleContainer" class="particle-container">
    <canvas ref="canvas" class="particle-canvas" />
  </div>
</template>

<script setup lang="ts">
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

const particleContainer = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const particles = ref<Particle[]>([])
const animationId = ref<number>(0)
const mouseX = ref<number>(0)
const mouseY = ref<number>(0)

const PARTICLE_COUNT = 80
const CONNECTION_DISTANCE = 120
const PARTICLE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#3b82f6', '#f59e0b']

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    radius: Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.6 + 0.3,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }
}

function initParticles(): void {
  if (!canvas.value) return
  const width = canvas.value.width
  const height = canvas.value.height
  particles.value = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height))
}

function drawParticles(): void {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const width = canvas.value.width
  const height = canvas.value.height

  ctx.clearRect(0, 0, width, height)

  // Draw connections
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const p1 = particles.value[i]
      const p2 = particles.value[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < CONNECTION_DISTANCE) {
        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  // Draw mouse connections
  for (const p of particles.value) {
    const dx = p.x - mouseX.value
    const dy = p.y - mouseY.value
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < CONNECTION_DISTANCE * 1.5) {
      const opacity = (1 - dist / (CONNECTION_DISTANCE * 1.5)) * 0.5
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(mouseX.value, mouseY.value)
      ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
  }

  // Draw particles
  for (const p of particles.value) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0')
    ctx.fill()

    // Glow effect
    ctx.shadowBlur = 8
    ctx.shadowColor = p.color
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function updateParticles(): void {
  if (!canvas.value) return
  const width = canvas.value.width
  const height = canvas.value.height

  for (const p of particles.value) {
    p.x += p.vx
    p.y += p.vy

    // Bounce off edges
    if (p.x < 0 || p.x > width) p.vx = -p.vx
    if (p.y < 0 || p.y > height) p.vy = -p.vy

    // Keep within bounds
    p.x = Math.max(0, Math.min(width, p.x))
    p.y = Math.max(0, Math.min(height, p.y))
  }
}

function animate(): void {
  updateParticles()
  drawParticles()
  animationId.value = requestAnimationFrame(animate)
}

function resizeCanvas(): void {
  if (!canvas.value || !particleContainer.value) return
  canvas.value.width = particleContainer.value.clientWidth
  canvas.value.height = particleContainer.value.clientHeight
  initParticles()
}

function handleMouseMove(e: MouseEvent): void {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

onMounted(() => {
  resizeCanvas()
  animate()

  window.addEventListener('resize', resizeCanvas)
  if (particleContainer.value) {
    particleContainer.value.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  window.removeEventListener('resize', resizeCanvas)
  if (particleContainer.value) {
    particleContainer.value.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<style scoped>
.particle-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
