"use client"

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ModalProps } from '@/lib/types'
import { animations } from '@/lib/animations'

export function Modal({ isOpen, onClose, children, className, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const body = document.body
    if (isOpen) {
      body.classList.add('overflow-hidden')
    } else {
      body.classList.remove('overflow-hidden')
    }
    return () => body.classList.remove('overflow-hidden')
  }, [isOpen, mounted])
  
  if (!mounted) return null

  return createPortal(
    (
      <AnimatePresence initial={false} mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              {...animations.modalBackdrop}
              onClick={onClose}
            />
            <motion.div
              className={cn(
                'relative bg-white rounded-xl shadow-2xl w-full',
                sizes[size],
                className
              )}
              {...animations.modalContent}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    document.body
  )
}
