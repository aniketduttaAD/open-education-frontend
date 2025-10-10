export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'tutor' | 'admin'
  onboarding_completed: boolean
  role_selected_at?: string
  created_at: string
  updated_at: string
}

export interface UserStatus {
  user: User
  needsRoleSelection: boolean
  needsOnboarding: boolean
  role: string | null
  profile: Record<string, unknown> | null
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

export interface ProfileData {
  name: string
  age: number
  gender: string
  latestDegree: string
  collegeUniversity: string
  bio?: string
  bankAccountNumber?: string
  ifscCode?: string
}

export const auth = {
  getSession: async () => {
    return { session: null, error: null }
  },

  signInWithGoogle: async () => {
    return { data: null, error: 'Authentication not available' }
  },

  signOut: async () => {
    return { error: null }
  },

  getUserStatus: async (): Promise<{ data: UserStatus | null; error: string | null }> => {
    return { data: null, error: 'User status not available' }
  },

  updateUserRole: async (): Promise<{ data: Record<string, unknown> | null; error: string | null }> => {
    return { data: null, error: 'Role update not available' }
  },

  completeOnboarding: async (): Promise<{ data: Record<string, unknown> | null; error: string | null }> => {
    return { data: null, error: 'Onboarding not available' }
  },

  saveUserData: async () => {
    // No implementation
  },

  createUserProfile: async () => {
    // No implementation
  }
}