'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AuthPopupCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      setMessage('Verifying your account...')
      
      // Get the session from the URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        throw new Error('No session found after authentication')
      }

      // Save user data to our database
      setMessage('Setting up your profile...')
      await auth.saveUserData(session.user)

      // Get user status to check if role selection/onboarding is needed
      const { data: statusData, error: statusError } = await auth.getUserStatus()
      
      if (statusError) {
        console.warn('Status check failed:', statusError)
        // Continue anyway, user can complete setup later
      }

      setStatus('success')
      setMessage('Authentication successful! You can now close this window.')
      
      // Close popup after a short delay
      setTimeout(() => {
        window.close()
      }, 2000)

    } catch (error) {
      console.error('Auth popup callback error:', error)
      setStatus('error')
      setMessage('Authentication failed. Please try again.')
      
      // Close popup after error
      setTimeout(() => {
        window.close()
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Completing Sign In'}
          {status === 'success' && 'Welcome to OpenEducation!'}
          {status === 'error' && 'Authentication Error'}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'loading' && (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-6">
          This window will close automatically
        </div>
      </div>
    </div>
  )
}
