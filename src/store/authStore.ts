import { create } from "zustand";
import { usersApi } from "@/lib/api/users";
import { authApi } from "@/lib/api/auth";
import { useUserStore } from "./userStore";
import type {
  User,
  UserType,
  StudentDetails,
  TutorDetailsUpdate,
} from "@/lib/userTypes";

interface AuthState {
  loading: boolean;
  showLoginModal: boolean;
  showRoleModal: boolean;
  showStudentOnboarding: boolean;
  showTutorOnboarding: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openRoleModal: () => void;
  closeRoleModal: () => void;
  googleOneTapLogin: (token: string) => Promise<void>;
  selectRole: (role: Exclude<UserType, "admin">) => Promise<void>;
  saveStudentDetails: (details: StudentDetails) => Promise<void>;
  saveTutorDetails: (details: TutorDetailsUpdate) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
}

function needsTutorOnboarding(user: User): boolean {
  if (user.user_type !== "tutor") return false;
  
  // If onboarding is already complete, check for document verification
  if (user.onboarding_complete) {
    // If document verification is pending, need onboarding
    if (user.document_verification === 'pending') return true;
    // Otherwise, no onboarding needed
    return false;
  }
  
  const td = user.tutor_details;
  
  // If no tutor details at all, need onboarding
  if (!td) return true;
  
  // If register fees not paid, need to show payment page
  if (!td.register_fees_paid) return true;
  
  // If no bank details, need to collect bank details
  if (!td.bank_details) return true;
  
  // If no DOB, need to collect personal details
  if (!user.dob) return true;
  
  // All prerequisites satisfied -> no onboarding needed
  return false;
}

function needsStudentOnboarding(user: User): boolean {
  if (user.user_type !== "student") return false;
  
  // If onboarding is already complete, no need for onboarding
  if (user.onboarding_complete) return false;
  
  // If no DOB, need to collect personal details
  if (!user.dob) return true;
  
  return true; // Need onboarding if we reach here
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
      loading: false,
      showLoginModal: false,
      showRoleModal: false,
      showStudentOnboarding: false,
      showTutorOnboarding: false,

      openLogin: () => set({ showLoginModal: true }),
      closeLogin: () => set({ showLoginModal: false }),
      openRoleModal: () => set({ showRoleModal: true }),
      closeRoleModal: () => set({ showRoleModal: false }),

      // Google One Tap login
      googleOneTapLogin: async (token: string) => {
        set({ loading: true });
        try {
          const response = await authApi.googleOneTapLogin(token);
          console.log('Google One Tap login response:', response);
          
          // Handle the response structure properly
          const { user } = response;
          if (!user) {
            throw new Error('No user data received from server');
          }
          
          // Update user store with the new user data
          useUserStore.getState().updateUser(user);
          
          set({ loading: false, showLoginModal: false });

          // Handle different user states and redirect immediately
          if (!user.user_type) {
            // No user type - redirect to role selection
            set({ showRoleModal: true });
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/callback';
            }
            return;
          }

          // Ensure role modal is closed when role exists
          set({ showRoleModal: false });

          // Check if onboarding is needed and redirect immediately
          if (needsStudentOnboarding(user)) {
            set({ showStudentOnboarding: true });
            if (typeof window !== 'undefined') {
              window.location.href = '/student/onboarding';
            }
          } else if (needsTutorOnboarding(user)) {
            set({ showTutorOnboarding: true });
            if (typeof window !== 'undefined') {
              window.location.href = '/tutor/onboarding';
            }
          } else {
            // User is fully onboarded, redirect to dashboard
            if (typeof window !== 'undefined') {
              if (user.user_type === 'student') {
                window.location.href = '/student/dashboard';
              } else if (user.user_type === 'tutor') {
                window.location.href = '/tutor/dashboard';
              } else {
                window.location.href = '/';
              }
            }
          }
        } catch (error) {
          console.error('Google One Tap login failed:', error);
          set({ loading: false });
          throw error;
        }
      },



      selectRole: async (role) => {
        set({ loading: true });
        try {
          const updated = await usersApi.updateUserType(role);
          useUserStore.getState().updateUser(updated);
          set({ showRoleModal: false, loading: false });
          
          // Navigate to onboarding page immediately after role selection
          if (typeof window !== "undefined") {
            if (updated.user_type === "student") {
              window.location.href = "/student/onboarding";
            } else if (updated.user_type === "tutor") {
              window.location.href = "/tutor/onboarding";
            }
          }
        } catch (error) {
          console.error('Failed to select role:', error);
          set({ loading: false });
          throw error;
        }
      },

      saveStudentDetails: async (details) => {
        set({ loading: true });
        const updated = await usersApi.updateStudentDetails(details);
        useUserStore.getState().updateUser(updated);
        set({ loading: false });
      },

      saveTutorDetails: async (details) => {
        set({ loading: true });
        const updated = await usersApi.updateTutorDetails(details);
        useUserStore.getState().updateUser(updated);
        set({ loading: false });
      },

      completeOnboarding: async () => {
        set({ loading: true });
        try {
          const updated = await usersApi.setOnboardingComplete();
          useUserStore.getState().updateUser(updated);
          set({
            showStudentOnboarding: false,
            showTutorOnboarding: false,
            loading: false,
          });
          
          // Let the calling page handle navigation - don't auto-redirect
        } catch (error) {
          console.error('Failed to complete onboarding:', error);
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authApi.logout();
          useUserStore.getState().clearUser();
          set({ 
            showLoginModal: false,
            showRoleModal: false,
            showStudentOnboarding: false,
            showTutorOnboarding: false,
            loading: false 
          });
        } catch (error) {
          console.error('Logout failed:', error);
          // Still clear local state even if API call fails
          useUserStore.getState().clearUser();
          set({ 
            showLoginModal: false,
            showRoleModal: false,
            showStudentOnboarding: false,
            showTutorOnboarding: false,
            loading: false 
          });
        }
      },
    })
);
