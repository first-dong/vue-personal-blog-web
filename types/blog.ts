// Article types
export interface Article {
  id: number
  title: string
  summary: string
  content?: string
  coverImage: string
  viewCount: number
  likeCount: number
  status: 'DRAFT' | 'PUBLISHED'
  categoryId: number
  categoryName: string
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface ArticleQuery {
  page?: number
  size?: number
  categoryId?: number
  tagId?: number
  keyword?: string
}

// Category types
export interface Category {
  id: number
  name: string
  description: string
  sortOrder: number
  articleCount?: number
}

// Tag types
export interface Tag {
  id: number
  name: string
  color: string
  articleCount?: number
}

// Danmaku types
export interface Danmaku {
  id: number
  content: string
  color: string
  position: number
  speed: number
  createTime: string
}

export interface DanmakuRequest {
  content: string
  color?: string
  position?: number
  speed?: number
  captchaKey: string
  captchaCode: string
}
