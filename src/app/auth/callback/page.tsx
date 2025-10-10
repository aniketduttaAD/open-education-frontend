'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RoleSelectionModal } from '@/components/auth/RoleSelectionModal'
import { StudentOnboardingModal } from '@/components/auth/StudentOnboardingModal'
import { useToast } from '@/components/ui/ToastProvider'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [showStudentOnboarding, setShowStudentOnboarding] = useState(false)

  const handleAuthCallback = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get URL parameters from OAuth callback
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const error = urlParams.get('error')
      
      if (error) {
        throw new Error(`OAuth error: ${error}`)
      }
      
      if (!code) {
        throw new Error('No authorization code received')
      }

      // Exchange code for tokens (this would be handled by your backend)
      // For now, just redirect to home since authentication is handled by backend
      showToast('Authentication successful!', 'success')
      router.push('/')

    } catch (err: unknown) {
      console.error('Auth callback error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      setLoading(false)
    }
  }, [showToast, router])

  useEffect(() => {
    handleAuthCallback()
  }, [handleAuthCallback])

  const handleRoleSelect = async (role: 'student' | 'tutor') => {
    try {
      setLoading(true)
      
      const { error } = await auth.updateUserRole()
      
      if (error) {
        throw new Error(error)
      }

      setShowRoleSelection(false)
      
      // If student, show onboarding
      if (role === 'student') {
        setShowStudentOnboarding(true)
      } else {
        // For tutors, redirect to tutor onboarding
        router.push('/tutor/onboarding')
      }
      
      setLoading(false)
    } catch (err: unknown) {
      console.error('Role selection error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      setLoading(false)
    }
  }

  const handleStudentOnboardingComplete = async () => {
    try {
      setLoading(true)
      
      const { error } = await auth.completeOnboarding()
      
      if (error) {
        throw new Error(error)
      }

      setShowStudentOnboarding(false)
      
      // Redirect to student dashboard
      router.push('/student/dashboard')
      
    } catch (err: unknown) {
      console.error('Onboarding error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <LoadingSpinner size="xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your account</h2>
          <p className="text-gray-600">Please wait while we configure your profile...</p>
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

  return (
    <>
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onRoleSelect={handleRoleSelect}
        loading={loading}
      />
      
      <StudentOnboardingModal
        isOpen={showStudentOnboarding}
        onComplete={handleStudentOnboardingComplete}
        loading={loading}
      />
    </>
  )
}
