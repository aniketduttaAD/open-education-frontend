import api from '@/lib/axios'
import type {
  User,
  UserType,
  StudentDetails,
  TutorDetailsUpdate,
  TutorDocumentItem,
  TutorDocumentType,
  TutorDocumentUploadResponse,
} from '@/lib/userTypes'

function normalizeUser(raw: any): User {
  // Some backends may nest tutor_details twice; there can be flags at container and inner levels
  const tutorContainer = raw?.tutor_details ?? null
  const innerTutor = tutorContainer?.tutor_details ?? null
  const td = innerTutor ?? tutorContainer ?? null

  // Prefer container-level flags, then inner, then user-level (rare), then defaults
  const registerFeesPaid =
    (typeof tutorContainer?.register_fees_paid === 'boolean' ? tutorContainer.register_fees_paid : undefined) ??
    (typeof innerTutor?.register_fees_paid === 'boolean' ? innerTutor.register_fees_paid : undefined) ??
    (typeof raw?.register_fees_paid === 'boolean' ? raw.register_fees_paid : undefined) ??
    false

  const resolvedVerificationStatus =
    (tutorContainer?.verification_status as string | undefined) ??
    (innerTutor?.verification_status as string | undefined) ??
    (raw?.verification_status as string | undefined) ??
    'pending'

  const normalized: User = {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    image: raw.image ?? null,
    gender: raw.gender ?? null,
    bio: raw.bio ?? null,
    dob: raw.dob ?? null,
    user_type: raw.user_type,
    tutor_details: td
      ? {
          ...(innerTutor || {}),
          register_fees_paid: !!registerFeesPaid,
          verification_status: resolvedVerificationStatus,
          // include bank_details and other inner fields if present
          ...(innerTutor?.bank_details ? { bank_details: innerTutor.bank_details } : {}),
        }
      : null,
    student_details: raw.student_details ?? null,
    onboarding_complete: raw.onboarding_complete ?? false,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  }
  return normalized
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/profile')
    const payload = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(payload)
  },
  updateProfile: async (payload: Partial<Pick<User, 'name' | 'image' | 'bio' | 'dob' | 'gender'>>): Promise<User> => {
    const res = await api.put('/users/profile', payload)
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(data)
  },
  setOnboardingComplete: async (): Promise<User> => {
    const res = await api.put('/users/onboarding', { onboarding_complete: true })
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(data)
  },
  updateUserType: async (user_type: Exclude<UserType, 'admin'>): Promise<User> => {
    const res = await api.put('/users/profile', { user_type })
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(data)
  },
  updateStudentDetails: async (student_details: StudentDetails): Promise<User> => {
    const res = await api.put('/users/student-details', student_details)
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(data)
  },
  updateTutorDetails: async (tutor_details: TutorDetailsUpdate): Promise<User> => {
    const res = await api.put('/users/tutor-details', tutor_details)
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return normalizeUser(data)
  },

  // Tutor verification documents APIs
  listTutorDocuments: async (): Promise<TutorDocumentItem[]> => {
    const res = await api.get('/users/tutors/documents')
    const data = (res as any)?.data?.data ?? (res as any)?.data ?? []
    return data as TutorDocumentItem[]
  },

  getTutorDocumentUrl: async (documentId: string): Promise<string> => {
    const res = await api.get(`/users/tutors/documents/${documentId}/url`)
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return data?.url as string
  },

  uploadTutorDocument: async (
    file: File,
    file_type: TutorDocumentType,
    description?: string
  ): Promise<TutorDocumentUploadResponse> => {
    const form = new FormData()
    form.append('file', file)
    form.append('file_type', file_type)
    if (description) form.append('description', String(description))

    const res = await api.post('/users/tutors/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return data as TutorDocumentUploadResponse
  },

  updateTutorDocument: async (
    documentId: string,
    payload: Partial<{ description: string; document_type: TutorDocumentType }>
  ): Promise<TutorDocumentItem> => {
    const res = await api.put(`/users/tutors/documents/${documentId}`, payload)
    const data = (res as any)?.data?.data ?? (res as any)?.data
    return data as TutorDocumentItem
  },

  deleteTutorDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/users/tutors/documents/${documentId}`)
  }
}
