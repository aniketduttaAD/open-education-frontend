import Axios from 'axios'
import { loadingBus } from '@/lib/loadingBus'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081'

export const api = Axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Initialize default Authorization header from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('access_token')
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
}

// Attach access token from localStorage for each request
api.interceptors.request.use((config) => {
  loadingBus.increment()
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 by attempting refresh if refresh_token exists
let isRefreshing = false
let pendingQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => {
    loadingBus.decrement()
    return response
  },
  async (error) => {
    loadingBus.decrement()
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const storedRefresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
      if (!storedRefresh) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            originalRequest._retry = true
            return api(originalRequest)
          })
      }

      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await api.post<{ access_token: string; refresh_token?: string }>('/auth/refresh', { refresh_token: storedRefresh })
        const newAccess = data.access_token
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', newAccess)
          if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
        }
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`
        processQueue(null, newAccess)
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
