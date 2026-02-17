import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// API response type
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// Create axios instance
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor - attach JWT token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error: unknown) => {
      return Promise.reject(error)
    },
  )

  // Response interceptor - handle errors globally
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      // Backend returns non-200 code in response body
      if (data.code !== 200) {
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      return response
    },
    async (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 401) {
          // Token expired - attempt refresh
          if (import.meta.client) {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              try {
                const refreshResponse = await axios.post<ApiResponse<{ token: string; refreshToken: string }>>(
                  `${baseURL}/api/auth/refresh`,
                  { refreshToken },
                )
                const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data.data
                localStorage.setItem('token', newToken)
                localStorage.setItem('refreshToken', newRefreshToken)

                // Retry the original request with new token
                if (error.config) {
                  error.config.headers.Authorization = `Bearer ${newToken}`
                  return instance(error.config as AxiosRequestConfig)
                }
              }
              catch {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.location.href = '/admin/login'
              }
            }
            else {
              window.location.href = '/admin/login'
            }
          }
        }
        else if (status === 403) {
          console.error('权限不足')
        }
        else if (status === 500) {
          console.error('服务器错误')
        }
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export { createAxiosInstance }
