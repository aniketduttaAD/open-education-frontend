import { supabase } from './supabase'

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
  // Get current user session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get user status (role selection and onboarding)
  getUserStatus: async (): Promise<{ data: UserStatus | null; error: string | null }> => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { data: null, error: 'No session found' }
    }

    const { data, error } = await supabase.functions.invoke('get-user-status', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    return { data: data?.data || null, error }
  },

  // Update user role
  updateUserRole: async (role: 'student' | 'tutor'): Promise<{ data: Record<string, unknown> | null; error: string | null }> => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { data: null, error: 'No session found' }
    }

    const { data, error } = await supabase.functions.invoke('update-user-role', {
      body: { role },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    return { data: data?.data || null, error }
  },

  // Complete onboarding
  completeOnboarding: async (profileData: ProfileData): Promise<{ data: Record<string, unknown> | null; error: string | null }> => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { data: null, error: 'No session found' }
    }

    const { data, error } = await supabase.functions.invoke('complete-onboarding', {
      body: { profileData },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    return { data: data?.data || null, error }
  },

  // Save user data after OAuth (legacy function for compatibility)
  saveUserData: async (authUser: AuthUser) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (!existingUser) {
        // Create new user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            role: 'student',
            onboarding_completed: false
          })

        if (insertError) {
          console.error('Error creating user:', insertError)
        }
      } else {
        // Update existing user with latest data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: authUser.user_metadata?.name || existingUser.name,
            avatar_url: authUser.user_metadata?.avatar_url || existingUser.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', authUser.id)

        if (updateError) {
          console.error('Error updating user:', updateError)
        }
      }
    } catch (error) {
      console.error('Error saving user data:', error)
    }
  },

  // Create user profile (legacy function for compatibility)
  createUserProfile: async (authUser: AuthUser) => {
    await auth.saveUserData(authUser)
  }
}
