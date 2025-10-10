'use client'

import { useEffect, useState } from 'react'
import { loadingBus } from '@/lib/loadingBus'

export function LoadingOverlay() {
  const [count, setCount] = useState(0)
  const isActive = count > 0

  useEffect(() => {
    const unsubscribe = loadingBus.subscribe(setCount)
    return unsubscribe
  }, [])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
          <p className="mt-3 text-sm text-neutral-700">Loading...</p>
        </div>
      </div>
    </div>
  )
}


