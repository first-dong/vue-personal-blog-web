<script setup lang="ts">
// 文章新增/编辑共用表单组件
// 包含：标题、内容（Markdown编辑器）、摘要、分类、标签、封面上传、草稿保存等

import type { Category, Tag } from '~/types/blog'

interface ArticleFormData {
  title: string
  content: string
  summary: string
  coverImage: string
  categoryId: number | undefined
  tagIds: number[]
  status: 'DRAFT' | 'PUBLISHED'
}

interface Props {
  articleId?: number
  initialData?: Partial<ArticleFormData>
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<{
  (e: 'saved', id: number): void
}>()

const router = useRouter()
const { $api } = useNuxtApp()

// Form data
const form = reactive<ArticleFormData>({
  title: '',
  content: '',
  summary: '',
  coverImage: '',
  categoryId: undefined,
  tagIds: [],
  status: 'DRAFT'
})

// Options
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

// State
const saving = ref(false)
const publishing = ref(false)
const draftTimer = ref<NodeJS.Timeout | null>(null)
const lastSavedAt = ref<string | null>(null)
const coverUploading = ref(false)
const coverFileInput = ref<HTMLInputElement>()

// Draft auto-save key
const draftKey = computed(() => `article_draft_${props.articleId ?? 'new'}`)

// Form errors
const errors = reactive({
  title: '',
  content: '',
  categoryId: ''
})

// Init form data
const initForm = () => {
  if (props.initialData) {
    Object.assign(form, props.initialData)
  } else if (!props.isEdit) {
    // Load from local draft
    try {
      const draft = localStorage.getItem(draftKey.value)
      if (draft) {
        const parsed = JSON.parse(draft)
        Object.assign(form, parsed)
        lastSavedAt.value = parsed._savedAt
      }
    } catch {}
  }
}

// Fetch options
const fetchCategories = async () => {
  try {
    const { data } = await $api.get('/api/categories')
    categories.value = data || []
  } catch {}
}

const fetchTags = async () => {
  try {
    const { data } = await $api.get('/api/tags')
    tags.value = data || []
  } catch {}
}

// Validate form
const validate = (): boolean => {
  errors.title = form.title.trim() ? '' : '请输入文章标题'
  errors.content = form.content.trim() ? '' : '请输入文章内容'
  errors.categoryId = form.categoryId ? '' : '请选择文章分类'

  return !errors.title && !errors.content && !errors.categoryId
}

// Save as draft
const saveDraft = async (showFeedback = false) => {
  saving.value = true
  try {
    // Save to local storage first
    const draftData = {
      ...form,
      _savedAt: new Date().toISOString()
    }
    localStorage.setItem(draftKey.value, JSON.stringify(draftData))
    lastSavedAt.value = draftData._savedAt

    // If editing, also save to backend as draft
    if (props.articleId && form.title.trim()) {
      await $api.put(`/api/admin/articles/${props.articleId}`, {
        ...form,
        status: 'DRAFT'
      })
    }

    if (showFeedback) {
      alert('草稿已保存')
    }
  } catch (error) {
    console.error('Failed to save draft:', error)
  } finally {
    saving.value = false
  }
}

// Auto-save draft every 30 seconds
const setupAutoSave = () => {
  draftTimer.value = setInterval(() => {
    if (form.content.trim() || form.title.trim()) {
      saveDraft()
    }
  }, 30000)
}

// Publish article
const handlePublish = async () => {
  if (!validate()) return

  publishing.value = true
  try {
    const payload = {
      title: form.title,
      content: form.content,
      summary: form.summary || form.content.substring(0, 200),
      coverImage: form.coverImage,
      categoryId: form.categoryId,
      tagIds: form.tagIds,
      status: 'PUBLISHED'
    }

    let id: number
    if (props.isEdit && props.articleId) {
      const { data } = await $api.put(`/api/admin/articles/${props.articleId}`, payload)
      id = props.articleId
    } else {
      const { data } = await $api.post('/api/admin/articles', payload)
      id = data.id
    }

    // Clear local draft
    localStorage.removeItem(draftKey.value)

    emit('saved', id)
    router.push('/admin/articles')
  } catch (error) {
    console.error('Failed to publish:', error)
    alert('发布失败，请稍后重试')
  } finally {
    publishing.value = false
  }
}

// Handle cover image upload
const handleCoverSelect = () => {
  coverFileInput.value?.click()
}

const handleCoverUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validate file
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('图片不能超过 10MB')
    return
  }

  coverUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await $api.post('/api/admin/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    form.coverImage = data.url
  } catch (error) {
    console.error('Cover upload failed:', error)
    // Fallback: show placeholder
    alert('上传失败，请稍后重试')
  } finally {
    coverUploading.value = false
    if (target) target.value = ''
  }
}

// Toggle tag selection
const toggleTag = (tagId: number) => {
  const index = form.tagIds.indexOf(tagId)
  if (index === -1) {
    form.tagIds.push(tagId)
  } else {
    form.tagIds.splice(index, 1)
  }
}

// Format saved time
const formatSavedAt = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN')
}

// Lifecycle
onMounted(() => {
  initForm()
  fetchCategories()
  fetchTags()
  setupAutoSave()
})

onUnmounted(() => {
  if (draftTimer.value) {
    clearInterval(draftTimer.value)
  }
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEdit ? '编辑文章' : '新建文章' }}
        </h1>
        <p v-if="lastSavedAt" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          草稿已于 {{ formatSavedAt(lastSavedAt) }} 自动保存
        </p>
      </div>
      <div class="flex gap-3">
        <button
          :disabled="saving"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          @click="saveDraft(true)"
        >
          {{ saving ? '保存中...' : '保存草稿' }}
        </button>
        <button
          :disabled="publishing"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          @click="handlePublish"
        >
          {{ publishing ? '发布中...' : (isEdit ? '更新发布' : '发布文章') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Main content area -->
      <div class="col-span-2 space-y-4">
        <!-- Title -->
        <div>
          <input
            v-model="form.title"
            type="text"
            placeholder="请输入文章标题..."
            class="w-full px-4 py-3 text-xl font-semibold border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <!-- Markdown Editor -->
        <div>
          <MarkdownEditor
            v-model="form.content"
            :height="600"
            placeholder="请输入文章内容（支持 Markdown 语法）..."
          />
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <!-- Status -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">发布状态</h3>
          <div class="flex gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.status"
                type="radio"
                value="DRAFT"
                class="text-green-600"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">草稿</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.status"
                type="radio"
                value="PUBLISHED"
                class="text-green-600"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">已发布</span>
            </label>
          </div>
        </div>

        <!-- Category -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">文章分类</h3>
          <select
            v-model="form.categoryId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option :value="undefined">请选择分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">{{ errors.categoryId }}</p>
        </div>

        <!-- Tags -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">文章标签</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in tags"
              :key="tag.id"
              :class="form.tagIds.includes(tag.id)
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              class="px-3 py-1 text-xs rounded-full transition-colors"
              :style="form.tagIds.includes(tag.id) ? { backgroundColor: tag.color } : {}"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
            <span v-if="tags.length === 0" class="text-sm text-gray-400">暂无标签</span>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">封面图片</h3>

          <!-- Preview -->
          <div v-if="form.coverImage" class="mb-3">
            <img
              :src="form.coverImage"
              alt="封面图片"
              class="w-full h-40 object-cover rounded-lg"
            >
            <button
              class="mt-2 text-xs text-red-600 hover:text-red-800"
              @click="form.coverImage = ''"
            >
              移除封面
            </button>
          </div>

          <!-- Upload area -->
          <div v-else>
            <div
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
              @click="handleCoverSelect"
            >
              <div class="text-gray-400 dark:text-gray-500">
                <div class="text-2xl mb-2">📷</div>
                <div class="text-sm">{{ coverUploading ? '上传中...' : '点击上传封面图片' }}</div>
                <div class="text-xs mt-1">支持 JPG/PNG/WebP，最大 10MB</div>
              </div>
            </div>
          </div>

          <!-- URL input fallback -->
          <div class="mt-3">
            <input
              v-model="form.coverImage"
              type="text"
              placeholder="或直接输入图片 URL"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <input
            ref="coverFileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleCoverUpload"
          >
        </div>

        <!-- Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">文章摘要</h3>
          <textarea
            v-model="form.summary"
            placeholder="请输入文章摘要（可选，不填将自动截取正文前200字）"
            rows="4"
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>
