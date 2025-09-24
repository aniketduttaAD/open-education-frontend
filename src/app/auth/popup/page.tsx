'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AuthPopupPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Initializing authentication...')

  useEffect(() => {
    handleAuth()
  }, [])

  const handleAuth = async () => {
    try {
      setMessage('Checking authentication status...')
      
      // Get the session from the URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        // No session found, initiate Google OAuth
        setMessage('Redirecting to Google...')
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/popup/callback`
          }
        })

        if (error) {
          throw error
        }

        // The redirect will happen automatically
        return
      }

      // Session exists, save user data and close popup
      setMessage('Setting up your account...')
      
      await auth.saveUserData(session.user)
      
      setStatus('success')
      setMessage('Authentication successful! Closing window...')
      
      // Close popup after a short delay
      setTimeout(() => {
        window.close()
      }, 1500)

    } catch (error) {
      console.error('Auth popup error:', error)
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Signing in with Google'}
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
