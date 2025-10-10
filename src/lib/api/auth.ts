import api from '@/lib/axios'
import type { User } from '@/lib/userTypes'

interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    refresh_token: string
    user: User
  }
  message: string
  timestamp: string
}

interface RefreshResponse {
  success: boolean
  data: {
    access_token: string
    refresh_token?: string
    user: User
  }
  message: string
  timestamp: string
}

export const authApi = {
  // Google One Tap login - matches backend /auth/google/login endpoint
  googleOneTapLogin: async (token: string): Promise<{ user: User }> => {
    console.log('Sending Google One Tap login request to backend...')
    const { data } = await api.post<LoginResponse>('/auth/google/login', { token })
    console.log('Backend response:', data)
    
    if (!data.success || !data.data || !data.data.user) {
      throw new Error('Invalid response: missing user data')
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.data.access_token)
      localStorage.setItem('refresh_token', data.data.refresh_token)
      // Update axios default headers
      api.defaults.headers.common.Authorization = `Bearer ${data.data.access_token}`
    }
    
    return { user: data.data.user }
  },

  // Token refresh - matches backend /auth/refresh endpoint
  refresh: async (): Promise<{ user: User; access_token: string; refresh_token?: string }> => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    if (!refreshToken) throw new Error('No refresh token available')
    
    const { data } = await api.post<RefreshResponse>('/auth/refresh', { 
      refresh_token: refreshToken 
    })
    
    if (!data.success || !data.data) {
      throw new Error('Invalid refresh response')
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.data.access_token)
      if (data.data.refresh_token) {
        localStorage.setItem('refresh_token', data.data.refresh_token)
      }
      // Update axios default headers
      api.defaults.headers.common.Authorization = `Bearer ${data.data.access_token}`
    }
    
    return {
      user: data.data.user,
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token
    }
  },

  // Logout - matches backend /auth/logout endpoint
  logout: async (): Promise<void> => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    
    if (accessToken) {
      try {
        await api.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      } catch (error) {
        console.warn('Logout request failed, but clearing local tokens:', error)
      }
    }
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common.Authorization
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('access_token')
  },

  // Get stored access token
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  }
}
