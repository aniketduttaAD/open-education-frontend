import { create } from "zustand";
import { usersApi } from "@/lib/api/users";
import type { User, TutorDocumentItem } from "@/lib/userTypes";

interface UserState {
  // User data
  user: User | null;
  userLoading: boolean;
  userError: string | null;
  
  // Tutor documents
  tutorDocuments: TutorDocumentItem[];
  documentsLoading: boolean;
  documentsError: string | null;
  documentsFetched: boolean;
  
  // Actions
  fetchUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearUser: () => void;
  
  // Tutor documents actions
  fetchTutorDocuments: () => Promise<void>;
  addTutorDocument: (document: TutorDocumentItem) => void;
  removeTutorDocument: (documentId: string) => void;
  clearTutorDocuments: () => void;
  
  // Utility
  isUserLoaded: () => boolean;
  hasTutorDocuments: () => boolean;
}

export const useUserStore = create<UserState>()(
  (set, get) => ({
      // Initial state
      user: null,
      userLoading: false,
      userError: null,
      
      tutorDocuments: [],
      documentsLoading: false,
      documentsError: null,
      documentsFetched: false,

      // User actions
      fetchUser: async () => {
        const state = get();
        if (state.userLoading) return; // Prevent duplicate calls
        
        set({ userLoading: true, userError: null });
        try {
          const user = await usersApi.getProfile();
          set({ user, userLoading: false });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({ 
            user: null, 
            userLoading: false, 
            userError: error instanceof Error ? error.message : 'Failed to fetch user' 
          });
        }
      },

      updateUser: (user) => {
        set({ user });
      },

      clearUser: () => {
        set({ 
          user: null, 
          userError: null,
          tutorDocuments: [],
          documentsError: null,
          documentsFetched: false
        });
      },

      // Tutor documents actions
      fetchTutorDocuments: async () => {
        const state = get();
        if (state.documentsLoading || state.documentsFetched) return; // Prevent duplicate calls
        
        set({ documentsLoading: true, documentsError: null });
        try {
          const documents = await usersApi.listTutorDocuments();
          set({ 
            tutorDocuments: Array.isArray(documents) ? documents : [], 
            documentsLoading: false,
            documentsFetched: true
          });
        } catch (error) {
          console.error('Failed to fetch tutor documents:', error);
          set({ 
            tutorDocuments: [], 
            documentsLoading: false, 
            documentsError: error instanceof Error ? error.message : 'Failed to fetch documents',
            documentsFetched: true
          });
        }
      },

      addTutorDocument: (document) => {
        set((state) => ({
          tutorDocuments: [...state.tutorDocuments, document]
        }));
      },

      removeTutorDocument: (documentId) => {
        set((state) => ({
          tutorDocuments: state.tutorDocuments.filter(doc => doc.id !== documentId)
        }));
      },

      clearTutorDocuments: () => {
        set({ tutorDocuments: [], documentsError: null });
      },

      // Utility functions
      isUserLoaded: () => {
        const state = get();
        return !!state.user && !state.userLoading;
      },

      hasTutorDocuments: () => {
        const state = get();
        return state.tutorDocuments.length > 0;
      }
    })
);
