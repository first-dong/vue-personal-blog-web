// Article detail types

export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}

export interface Comment {
  id: number
  articleId: number
  parentId: number | null
  content: string
  authorName: string
  authorEmail?: string
  authorAvatar?: string
  createdAt: string
  replies?: Comment[]
  likeCount?: number
}

export interface CommentRequest {
  articleId: number
  parentId?: number | null
  content: string
  authorName: string
  authorEmail?: string
  captchaKey: string
  captchaCode: string
}
