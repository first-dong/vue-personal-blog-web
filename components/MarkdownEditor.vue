<script setup lang="ts">
// Markdown 编辑器组件，使用原生 textarea + markdown-it 预览
// 支持：Markdown 语法编辑、实时预览、图片粘贴上传、工具栏快捷操作

interface Props {
  modelValue: string
  placeholder?: string
  height?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'image-upload', file: File): Promise<string>
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入 Markdown 内容...',
  height: 500
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement>()
const previewHtml = ref('')
const viewMode = ref<'editor' | 'preview' | 'split'>('split')
const isUploading = ref(false)

// Render markdown to HTML
const renderMarkdown = async (text: string) => {
  if (!text) {
    previewHtml.value = ''
    return
  }

  const { default: MarkdownIt } = await import('markdown-it')
  const { default: hljs } = await import('highlight.js')

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(str, { language: lang }).value
          return `<pre class="hljs"><code>${highlighted}</code></pre>`
        } catch {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  })

  previewHtml.value = md.render(text)
}

// Watch value changes for preview
watch(() => props.modelValue, (newVal) => {
  if (viewMode.value !== 'editor') {
    renderMarkdown(newVal)
  }
}, { immediate: true })

watch(viewMode, (mode) => {
  if (mode !== 'editor') {
    renderMarkdown(props.modelValue)
  }
})

// Handle textarea input
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// Toolbar actions
const insertText = (before: string, after: string = '', defaultText: string = '') => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end) || defaultText
  const newText = before + selectedText + after

  const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
  emit('update:modelValue', newValue)

  nextTick(() => {
    textarea.focus()
    const cursorPos = start + before.length + selectedText.length + after.length
    textarea.setSelectionRange(cursorPos, cursorPos)
  })
}

const toolbarItems = [
  { icon: 'B', title: '粗体', action: () => insertText('**', '**', '粗体文字') },
  { icon: 'I', title: '斜体', action: () => insertText('*', '*', '斜体文字') },
  { icon: 'S', title: '删除线', action: () => insertText('~~', '~~', '删除线文字') },
  { separator: true },
  { icon: 'H1', title: '一级标题', action: () => insertText('# ', '', '标题内容') },
  { icon: 'H2', title: '二级标题', action: () => insertText('## ', '', '标题内容') },
  { icon: 'H3', title: '三级标题', action: () => insertText('### ', '', '标题内容') },
  { separator: true },
  { icon: 'UL', title: '无序列表', action: () => insertText('- ', '', '列表项') },
  { icon: 'OL', title: '有序列表', action: () => insertText('1. ', '', '列表项') },
  { icon: '> ', title: '引用', action: () => insertText('> ', '', '引用内容') },
  { separator: true },
  { icon: '<>', title: '行内代码', action: () => insertText('`', '`', '代码') },
  { icon: '```', title: '代码块', action: () => insertText('```\n', '\n```', '代码块内容') },
  { separator: true },
  { icon: '---', title: '分隔线', action: () => insertText('\n---\n', '', '') },
  { icon: '🔗', title: '链接', action: () => insertText('[', '](https://)', '链接文字') },
  { icon: '📷', title: '图片', action: () => insertText('![', '](图片URL)', '图片描述') },
]

// Handle paste for image upload
const handlePaste = async (e: ClipboardEvent) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of Array.from(items)) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      if (!file) continue

      isUploading.value = true
      try {
        const url = await uploadImage(file)
        if (url) {
          insertText('![图片](', ')', url)
        }
      } finally {
        isUploading.value = false
      }
      break
    }
  }
}

// Upload image
const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { $api } = useNuxtApp()
    const { data } = await $api.post('/api/admin/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.url || null
  } catch (error) {
    console.error('Image upload failed:', error)
    // Fallback: return a placeholder URL
    return null
  }
}

// Handle file input for image upload
const fileInputRef = ref<HTMLInputElement>()

const handleImageUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploading.value = true
  try {
    const url = await uploadImage(file)
    if (url) {
      insertText('![图片](', ')', url)
    }
  } finally {
    isUploading.value = false
    if (target) target.value = ''
  }
}

// Handle keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault()
        insertText('**', '**', '粗体文字')
        break
      case 'i':
        e.preventDefault()
        insertText('*', '*', '斜体文字')
        break
    }
  }

  // Handle Tab for indentation
  if (e.key === 'Tab') {
    e.preventDefault()
    insertText('  ', '', '')
  }
}
</script>

<template>
  <div class="markdown-editor border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="flex items-center gap-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <!-- Tool buttons -->
      <template v-for="(item, index) in toolbarItems" :key="index">
        <div v-if="item.separator" class="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />
        <button
          v-else
          :title="item.title"
          class="px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          @click="item.action?.()"
        >
          {{ item.icon }}
        </button>
      </template>

      <!-- Image upload button -->
      <div class="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        title="上传图片"
        class="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        @click="handleImageUpload"
      >
        上传图片
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      >

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Upload indicator -->
      <span v-if="isUploading" class="text-xs text-blue-600 dark:text-blue-400">上传中...</span>

      <!-- View mode switcher -->
      <div class="flex border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
        <button
          :class="viewMode === 'editor' ? 'bg-green-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-3 py-1 text-xs transition-colors"
          @click="viewMode = 'editor'"
        >
          编辑
        </button>
        <button
          :class="viewMode === 'split' ? 'bg-green-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-3 py-1 text-xs transition-colors border-x border-gray-300 dark:border-gray-700"
          @click="viewMode = 'split'"
        >
          分屏
        </button>
        <button
          :class="viewMode === 'preview' ? 'bg-green-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          class="px-3 py-1 text-xs transition-colors"
          @click="viewMode = 'preview'"
        >
          预览
        </button>
      </div>
    </div>

    <!-- Editor Content Area -->
    <div class="flex" :style="{ height: `${height}px` }">
      <!-- Editor -->
      <div
        v-if="viewMode !== 'preview'"
        :class="viewMode === 'split' ? 'w-1/2 border-r border-gray-300 dark:border-gray-700' : 'w-full'"
        class="flex flex-col"
      >
        <textarea
          ref="textareaRef"
          :value="modelValue"
          :placeholder="placeholder"
          class="w-full h-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none"
          @input="handleInput"
          @paste="handlePaste"
          @keydown="handleKeydown"
        />
      </div>

      <!-- Preview -->
      <div
        v-if="viewMode !== 'editor'"
        :class="viewMode === 'split' ? 'w-1/2' : 'w-full'"
        class="h-full overflow-y-auto p-4 bg-white dark:bg-gray-800 prose dark:prose-invert max-w-none prose-sm"
      >
        <div
          v-if="previewHtml"
          class="markdown-preview"
          v-html="previewHtml"
        />
        <p v-else class="text-gray-400 dark:text-gray-600">
          暂无内容预览
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-preview :deep(pre) {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.markdown-preview :deep(code:not(pre code)) {
  background-color: #f1f5f9;
  color: #ef4444;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dark .markdown-preview :deep(code:not(pre code)) {
  background-color: #334155;
  color: #f87171;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #10b981;
  padding-left: 1rem;
  color: #6b7280;
  font-style: italic;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
}

.markdown-preview :deep(th) {
  background-color: #f9fafb;
}
</style>
