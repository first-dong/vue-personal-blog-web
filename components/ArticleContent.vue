<template>
  <div
    ref="contentRef"
    class="prose prose-gray dark:prose-invert max-w-none
           prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
           prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
           prose-code:text-primary-700 dark:prose-code:text-primary-300
           prose-pre:p-0 prose-pre:bg-transparent prose-pre:rounded-xl prose-pre:overflow-hidden
           prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-900/20
           prose-img:rounded-xl prose-img:shadow-md"
    v-html="renderedContent"
  ></div>
</template>

<script setup lang="ts">
import type { TocItem } from '~/types/article'

interface Props {
  content: string
}

interface Emits {
  (e: 'toc-ready', items: TocItem[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const contentRef = ref<HTMLElement | null>(null)
const renderedContent = ref('')

// Escape HTML helper
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Slugify heading text to generate anchor IDs
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/--+/g, '-')
    .trim()

// Build hierarchical TOC from flat heading list
const buildToc = (headings: TocItem[]): TocItem[] => {
  if (headings.length === 0) return []
  const toc: TocItem[] = []
  const stack: TocItem[] = []
  for (const h of headings) {
    const item: TocItem = { id: h.id, text: h.text, level: h.level, children: [] }
    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop()
    }
    if (stack.length === 0) {
      toc.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) parent.children = []
      parent.children.push(item)
    }
    stack.push(item)
  }
  return toc
}

// Render markdown (client-side only)
const renderMarkdown = async (content: string) => {
  if (!content) {
    renderedContent.value = '<p class="text-gray-400 italic">暂无内容</p>'
    return
  }

  if (!import.meta.client) {
    // SSR: render plain escaped text
    renderedContent.value = `<div class="whitespace-pre-wrap">${escapeHtml(content)}</div>`
    return
  }

  try {
    // Dynamic imports for client-side only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MarkdownItModule = await import('markdown-it')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hljsModule = await import('highlight.js')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MarkdownIt = (MarkdownItModule as any).default || MarkdownItModule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hljs = (hljsModule as any).default || hljsModule

    const headings: TocItem[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const md: any = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight(str: string, lang: string): string {
        const langDisplay = lang || 'code'
        const codeAttr = escapeHtml(str)
        let codeHtml = escapeHtml(str)

        if (lang && hljs.getLanguage(lang)) {
          try {
            codeHtml = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          } catch {
            // Use escaped plain text
          }
        }

        return (
          `<pre class="hljs-pre rounded-xl overflow-hidden my-4 shadow">` +
          `<div class="hljs-header flex items-center justify-between px-4 py-2 bg-gray-800">` +
          `<span class="text-xs text-gray-400 font-mono">${langDisplay}</span>` +
          `<button class="copy-btn text-xs text-gray-400 hover:text-white transition-colors" data-code="${codeAttr}">复制</button>` +
          `</div>` +
          `<code class="hljs${lang ? ` language-${lang}` : ''}">${codeHtml}</code>` +
          `</pre>`
        )
      },
    })

    // Override heading renderer to add IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultHeadingOpen = md.renderer.rules.heading_open as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    md.renderer.rules.heading_open = (tokens: any[], idx: number, options: any, env: any, self: any) => {
      const token = tokens[idx]
      const level = parseInt(token.tag.slice(1))
      const inlineToken = tokens[idx + 1]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = (inlineToken?.children || []).map((t: any) => t.content).join('')
      const id = slugify(text)
      token.attrSet('id', id)
      headings.push({ id, text, level })

      if (defaultHeadingOpen) {
        return defaultHeadingOpen(tokens, idx, options, env, self)
      }
      return self.renderToken(tokens, idx, options)
    }

    renderedContent.value = md.render(content)
    emit('toc-ready', buildToc(headings))
  } catch (err) {
    console.error('Markdown render error:', err)
    renderedContent.value = `<div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">${escapeHtml(content)}</div>`
  }
}

// Bind copy buttons after DOM update
const bindCopyButtons = () => {
  if (!contentRef.value) return
  const buttons = contentRef.value.querySelectorAll<HTMLButtonElement>('.copy-btn')
  buttons.forEach((btn) => {
    // Remove previous listener by cloning
    const newBtn = btn.cloneNode(true) as HTMLButtonElement
    btn.parentNode?.replaceChild(newBtn, btn)
    newBtn.addEventListener('click', async () => {
      const code = newBtn.getAttribute('data-code') || ''
      try {
        await navigator.clipboard.writeText(code)
        newBtn.textContent = '已复制!'
      } catch {
        newBtn.textContent = '复制失败'
      }
      setTimeout(() => { newBtn.textContent = '复制' }, 2000)
    })
  })
}

// Watch content
watch(() => props.content, renderMarkdown, { immediate: true })

// Inject hljs CSS once
onMounted(() => {
  if (!import.meta.client) return
  const linkId = 'hljs-theme-css'
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
    document.head.appendChild(link)
  }
})

// After content update, bind copy buttons
watch(renderedContent, () => {
  nextTick(bindCopyButtons)
})
</script>

<style scoped>
/* Inline code */
:deep(code:not(.hljs)) {
  background: #f3f4f6;
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.875em;
  font-family: 'JetBrains Mono', Consolas, monospace;
}

.dark :deep(code:not(.hljs)) {
  background: #374151;
}

/* Code blocks */
:deep(.hljs-pre) code.hljs {
  display: block;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}

/* Blockquote */
:deep(blockquote) {
  border-left-width: 4px;
  padding: 0.75rem 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

/* Tables */
:deep(table) {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  width: 100%;
}

:deep(th),
:deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
}

.dark :deep(th),
.dark :deep(td) {
  border-color: #374151;
}

:deep(th) {
  background: #f9fafb;
  font-weight: 600;
}

.dark :deep(th) {
  background: #1f2937;
}
</style>
