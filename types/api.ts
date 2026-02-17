// Common API response wrapper
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// Pagination
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface PageQuery {
  page?: number
  size?: number
}
