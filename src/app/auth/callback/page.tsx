'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usersApi } from '@/lib/api/users'
import { useToast } from '@/components/ui/ToastProvider'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setError(null)

        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        if (!accessToken) {
          throw new Error('No active session. Please sign in again.')
        }

        const user = await usersApi.getProfile()

        // If role not selected yet, open role selection
        if (!user.user_type) {
          setLoading(false)
          return
        }

        showToast('You are signed in', 'success')
        router.push('/')
      } catch (err: unknown) {
        console.error('Auth callback error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        setError(errorMessage)
        showToast(errorMessage, 'error')
        setLoading(false)
      }
    }
    run()
  }, [router, showToast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <LoadingSpinner size="xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your account</h2>
          <p className="text-gray-600">Redirecting to the homepage...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // If we're not loading or in error, ensure we are on home where global handler will show modals
  if (typeof window !== 'undefined') {
    window.location.href = '/'
    return null
  }
  return null
}
