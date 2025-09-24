# OpenEducation Platform - Frontend Implementation Guide

## Overview
Complete frontend implementation using Next.js 15, TypeScript, TailwindCSS, and Framer Motion with modern design system and smooth animations.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: TailwindCSS 3.4+
- **Animations**: Framer Motion 10.16+
- **State Management**: Zustand 4.4+
- **HTTP Client**: Axios 1.6+
- **Form Handling**: React Hook Form 7.48+
- **Validation**: Zod 3.22+

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── auth/              # Authentication components
│   ├── courses/           # Course-related components
│   ├── learning/          # Learning interface components
│   └── ai/                # AI features components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── stores/                # Zustand state stores
└── types/                 # TypeScript type definitions
```

## Design System

### Color Palette
```typescript
// src/lib/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a',
  },
  secondary: {
    50: '#faf5ff', 500: '#a855f7', 900: '#581c87',
  },
  success: {
    50: '#f0fdf4', 500: '#22c55e', 900: '#14532d',
  },
  warning: {
    50: '#fffbeb', 500: '#f59e0b', 900: '#78350f',
  },
  error: {
    50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d',
  },
  neutral: {
    50: '#fafafa', 500: '#737373', 900: '#171717',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  }
}
```

### Animation System
```typescript
// src/lib/animations.ts
export const animations = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  cardHover: {
    whileHover: {
      y: -8,
      rotateY: 2,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}
```

## Core UI Components

### Button Component
```typescript
// src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon,
  className,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus:ring-error-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <motion.button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...animations.buttonTap}
      disabled={loading}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          {...animations.loadingPulse}
        />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  )
}
```

### Card Component
```typescript
// src/components/ui/Card.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = true, onClick }: CardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden',
        hover && 'cursor-pointer',
        className
      )}
      {...(hover ? animations.cardHover : {})}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}
```

### Modal Component
```typescript
// src/components/ui/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, children, className, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            {...animations.modalBackdrop}
            onClick={onClose}
          />
          <motion.div
            className={cn('relative bg-white rounded-xl shadow-2xl w-full', sizes[size], className)}
            {...animations.modalContent}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## State Management

### Auth Store
```typescript
// src/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'tutor' | 'admin'
  avatarUrl?: string
  onboardingCompleted: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          
          if (!response.ok) throw new Error('Login failed')
          
          const data = await response.json()
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          })
          
          if (!response.ok) throw new Error('Registration failed')
          
          const data = await response.json()
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }))
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
```

## API Integration

### API Client
```typescript
// src/lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

## Page Components

### Landing Page
```typescript
// src/app/page.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCourses } from '@/components/home/FeaturedCourses'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturedCourses />
      </main>
      
      <Footer />
    </div>
  )
}
```

### Hero Section
```typescript
// src/components/home/HeroSection.tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Learn with AI-Powered
          <br />
          <span className="text-neutral-800">Education</span>
        </motion.h1>
        
        <motion.p
          className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Experience the future of learning with AI-generated courses, 
          personalized tutoring, and interactive content that adapts to your pace.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-700">
            Start Learning
          </Button>
          <Button size="lg" variant="outline">
            Explore Courses
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
```

## Configuration Files

### TailwindCSS Config
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff', 500: '#a855f7', 900: '#581c87',
        },
        success: {
          50: '#f0fdf4', 500: '#22c55e', 900: '#14532d',
        },
        warning: {
          50: '#fffbeb', 500: '#f59e0b', 900: '#78350f',
        },
        error: {
          50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

### Global CSS
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --color-secondary-50: #faf5ff;
  --color-secondary-500: #a855f7;
  --color-secondary-900: #581c87;
  
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-neutral-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-neutral-300);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-400);
}
```

## Environment Configuration

### .env.local
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_AUTH_CLIENT_ID=your-client-id

# Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_IxxM23OyUAx4Lu

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_LIVE_CLASSES=true
```

## Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## Key Features

1. **Modern Design System**: Comprehensive color palette and animation system
2. **Reusable Components**: Modular UI components with consistent styling
3. **State Management**: Zustand for global state management
4. **API Integration**: Axios-based API client with interceptors
5. **Animations**: Framer Motion animations throughout the app
6. **Responsive Design**: Mobile-first approach with TailwindCSS
7. **Type Safety**: Full TypeScript implementation
8. **Performance**: Optimized with Next.js 15 features

This implementation provides a solid foundation for building a scalable, maintainable frontend application with modern React patterns and best practices.
