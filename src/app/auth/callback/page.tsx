'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { auth, ProfileData } from '@/lib/auth'
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

      // Get the session from the URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        throw new Error('No session found')
      }

      // Save user data to our database
      await auth.saveUserData(session.user)

      // Get user status to check if role selection/onboarding is needed
      const { data: statusData, error: statusError } = await auth.getUserStatus()
      
      if (statusError) {
        throw new Error(statusError)
      }

      if (!statusData) {
        throw new Error('Failed to get user status')
      }

      // Check if user needs role selection
      if (statusData.needsRoleSelection) {
        setShowRoleSelection(true)
        setLoading(false)
        return
      }

      // Check if user needs onboarding
      if (statusData.needsOnboarding) {
        if (statusData.role === 'student') {
          setShowStudentOnboarding(true)
        } else {
          // For tutors, redirect to tutor onboarding
          router.push('/tutor/onboarding')
        }
        setLoading(false)
        return
      }

      // User is fully set up, show success toast and redirect to appropriate dashboard
      showToast('Successfully signed in!', 'success')
      
      if (statusData.role === 'student') {
        router.push('/student/dashboard')
      } else if (statusData.role === 'tutor') {
        router.push('/tutor/dashboard')
      } else {
        router.push('/')
      }

    } catch (err: unknown) {
      console.error('Auth callback error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    handleAuthCallback()
  }, [handleAuthCallback])

  const handleRoleSelect = async (role: 'student' | 'tutor') => {
    try {
      setLoading(true)
      
      const { error } = await auth.updateUserRole(role)
      
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

  const handleStudentOnboardingComplete = async (profileData: ProfileData) => {
    try {
      setLoading(true)
      
      const { error } = await auth.completeOnboarding(profileData)
      
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
