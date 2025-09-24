import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usersApi } from '@/lib/api/users'
import { authApi } from '@/lib/api/auth'
import type { User, UserType, StudentDetails, TutorDetails } from '@/lib/userTypes'

interface AuthState {
  user: User | null
  loading: boolean
  showLoginModal: boolean
  showRoleModal: boolean
  showStudentOnboarding: boolean
  showTutorOnboarding: boolean
  setUser: (u: User | null) => void
  openLogin: () => void
  closeLogin: () => void
  startGoogleLogin: () => void
  pollProfileAfterLogin: () => Promise<void>
  fetchProfile: () => Promise<void>
  selectRole: (role: Exclude<UserType, 'admin'>) => Promise<void>
  saveStudentDetails: (details: StudentDetails) => Promise<void>
  saveTutorDetails: (details: TutorDetails) => Promise<void>
  completeOnboarding: () => Promise<void>
  logout: () => Promise<void>
}

function needsTutorOnboarding(user: User): boolean {
  if (user.user_type !== 'tutor') return false
  const td = user.tutor_details || undefined
  if (!td) return true
  if (!td.register_fees_paid) return true
  if (!td.bank_details) return true
  return !user.onboarding_complete
}

function needsStudentOnboarding(user: User): boolean {
  if (user.user_type !== 'student') return false
  return !user.onboarding_complete
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  loading: false,
  showLoginModal: false,
  showRoleModal: false,
  showStudentOnboarding: false,
  showTutorOnboarding: false,

  setUser: (u) => set({ user: u }),

  openLogin: () => set({ showLoginModal: true }),
  closeLogin: () => set({ showLoginModal: false }),

  startGoogleLogin: () => {
    authApi.googleStart()
  },

  pollProfileAfterLogin: async () => {
    set({ loading: true })
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      if (!token) {
        set({ loading: false })
        return
      }
      const profile = await usersApi.getProfile()
      set({ user: profile, loading: false, showLoginModal: false })

      if (!profile.user_type) {
        set({ showRoleModal: true })
        return
      }

      // Ensure role modal is closed when role exists
      set({ showRoleModal: false })

      if (needsStudentOnboarding(profile)) set({ showStudentOnboarding: true })
      if (needsTutorOnboarding(profile)) set({ showTutorOnboarding: true })
    } catch {
      set({ loading: false })
    }
  },

  fetchProfile: async () => {
    set({ loading: true })
    try {
      const user = await usersApi.getProfile()
      set({ user })
      if (!user.user_type) {
        set({ showRoleModal: true })
      } else {
        // Ensure role modal is closed when role exists
        set({ showRoleModal: false })
        if (needsStudentOnboarding(user)) set({ showStudentOnboarding: true })
        if (needsTutorOnboarding(user)) set({ showTutorOnboarding: true })
      }
    } finally {
      set({ loading: false })
    }
  },

  selectRole: async (role) => {
    set({ loading: true })
    const updated = await usersApi.updateUserType(role)
    set({ user: updated, showRoleModal: false })
    // Navigate to details page after role selection
    if (typeof window !== 'undefined') {
      if (updated.user_type === 'student') {
        window.location.href = '/student/onboarding'
      } else if (updated.user_type === 'tutor') {
        window.location.href = '/tutor/onboarding'
      }
    }
    set({ loading: false })
  },

  saveStudentDetails: async (details) => {
    set({ loading: true })
    const updated = await usersApi.updateStudentDetails(details)
    set({ user: updated })
    set({ loading: false })
  },

  saveTutorDetails: async (details) => {
    set({ loading: true })
    const updated = await usersApi.updateTutorDetails(details)
    set({ user: updated })
    set({ loading: false })
  },

  completeOnboarding: async () => {
    set({ loading: true })
    const updated = await usersApi.setOnboardingComplete()
    set({ user: updated, showStudentOnboarding: false, showTutorOnboarding: false })
    set({ loading: false })
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null })
  },
}), { name: 'auth-store' }))
