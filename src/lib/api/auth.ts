import api from '@/lib/axios'
import type { User } from '@/lib/userTypes'

export const authApi = {
  // Optional: keep for popup flow, but can be removed in One Tap-only flow
  googleStart: () => {
    const url = `${api.defaults.baseURL}/auth/google`
    window.open(url, 'google-login', 'width=500,height=600,scrollbars=yes,resizable=yes')
  },

  // One Tap: send id token, persist tokens from response
  googleOneTapLogin: async (token: string): Promise<{ user: User }> => {
    const { data } = await api.post<{ user: User; access_token: string; refresh_token: string }>('/auth/google/login', { token })
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
    }
    return { user: data.user }
  },

  // Only call refresh if we have refresh_token
  refresh: async (): Promise<{ user: User; access_token: string; refresh_token?: string }> => {
    const rt = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    if (!rt) throw new Error('No refresh token')
    const { data } = await api.post<{ user: User; access_token: string; refresh_token?: string }>('/auth/refresh', { refresh_token: rt })
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token)
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
    }
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }
}
