import { create } from "zustand";
import { usersApi } from "@/lib/api/users";
import { authApi } from "@/lib/api/auth";
import { useUserStore } from "./userStore";
import type {
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

export const useAuthStore = create<AuthState>()(
  (set) => ({
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

          // Single redirect: let OnboardingHandler handle modals and routing
          if (typeof window !== 'undefined') {
            window.location.href = '/';
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
