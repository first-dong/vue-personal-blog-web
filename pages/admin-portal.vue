<template>
  <div class="portal-wrapper">
    <div class="portal-card">
      <div class="portal-icon">🔐</div>
      <h1 class="portal-title">管理入口</h1>
      <p class="portal-subtitle">请输入访问密钥以继续</p>

      <form class="portal-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            v-model="accessCode"
            type="password"
            placeholder="访问密钥"
            class="portal-input"
            autocomplete="off"
            autofocus
          />
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

        <button type="submit" class="portal-btn" :disabled="loading">
          <span v-if="loading">验证中...</span>
          <span v-else>进入管理后台</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const accessCode = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!accessCode.value.trim()) {
    errorMsg.value = '请输入访问密钥'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const result = await $fetch('/api/portal/verify', {
      method: 'POST',
      body: { code: accessCode.value },
    })

    if (result && (result as { success: boolean }).success) {
      await navigateTo('/admin/login')
    } else {
      errorMsg.value = '密钥错误，请重试'
      accessCode.value = ''
    }
  } catch {
    errorMsg.value = '密钥错误，请重试'
    accessCode.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.portal-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
}

.portal-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.portal-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.portal-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
}

.portal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 32px;
}

.portal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  width: 100%;
}

.portal-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.portal-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.portal-input:focus {
  border-color: rgba(99, 102, 241, 0.8);
}

.error-msg {
  color: #f87171;
  font-size: 13px;
  text-align: left;
  padding: 0 4px;
}

.portal-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.portal-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.portal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
