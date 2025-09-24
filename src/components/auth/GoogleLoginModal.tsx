'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuthStore } from '@/store/authStore'

interface GoogleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function GoogleLoginModal({ isOpen, onClose, onSuccess }: GoogleLoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const popupRef = useRef<Window | null>(null)
  const startGoogleLogin = useAuthStore(s => s.startGoogleLogin)
  const pollProfileAfterLogin = useAuthStore(s => s.pollProfileAfterLogin)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event?.data?.type === 'auth:success') {
        await finalizeLogin()
      }
    }
    const handleStorage = async (e: StorageEvent) => {
      if (e.key === 'auth_popup_done') {
        await finalizeLogin()
      }
    }
    window.addEventListener('message', handleMessage)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const finalizeLogin = async () => {
    setIsLoading(false)
    await pollProfileAfterLogin()
    onSuccess?.()
    onClose()
  }

  // Cleanup on unmount: just null out ref; don't access or close cross-origin popup
  useEffect(() => {
    return () => {
      popupRef.current = null
    }
  }, [])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      const features = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`

      const popup = window.open('', 'google-login', features)
      if (!popup) {
        showToast('Please allow popups to continue with Google login', 'warning')
        setIsLoading(false)
        return
      }

      popupRef.current = popup
      startGoogleLogin()
      showToast('Opening Google login...', 'info')

      // Do not poll or access popup to avoid COOP issues; popup will signal via postMessage/localStorage
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error')
      console.error('Unexpected error during Google login:', error)
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="mx-auto mb-6">
                <Image src="/logo.png" alt="OpenEducation" width={64} height={64} className="mx-auto rounded-xl" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to OpenEducation
              </h2>
              
              <p className="text-gray-600 mb-8">
                Sign in with your Google account to start your learning journey
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-6 py-4 flex items-center justify-center space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-gray-700 font-medium">
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </button>

              <p className="text-xs text-gray-500 mt-6">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
