'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/axios'

export default function GoogleOAuthCallback() {
  const searchParams = useSearchParams()
  const [info, setInfo] = useState<string>('Processing authentication...')

  useEffect(() => {
    try {
      const qpAccess = searchParams.get('access_token')
      const qpRefresh = searchParams.get('refresh_token')

      let hashAccess: string | null = null
      let hashRefresh: string | null = null
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        hashAccess = hash.get('access_token')
        hashRefresh = hash.get('refresh_token')
      }

      const access = qpAccess || hashAccess
      const refresh = qpRefresh || hashRefresh

      if (!access || !refresh) {
        // eslint-disable-next-line no-console
        console.warn('OAuth callback missing tokens. Query:', window.location.search, 'Hash:', window.location.hash)
        setInfo('Authentication completed, but no tokens were returned. Please check backend redirect configuration.')
      }

      if (access) {
        localStorage.setItem('access_token', access)
        api.defaults.headers.common.Authorization = `Bearer ${access}`
      }
      if (refresh) localStorage.setItem('refresh_token', refresh)

      if (window.opener && typeof window.opener.postMessage === 'function') {
        window.opener.postMessage({ type: 'oauth-success' }, '*')
        window.opener.postMessage({ type: 'auth:success' }, '*')
      }
      localStorage.setItem('auth_popup_done', Date.now().toString())

      if (access && refresh) {
        window.close()
      }
    } catch {}
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete</h2>
        <p className="text-gray-600">{info}</p>
        <button
          onClick={() => window.close()}
          className="mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Close Window
        </button>
      </div>
    </div>
  )
}
