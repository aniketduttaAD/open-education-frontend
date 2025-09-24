export type UserType = 'student' | 'tutor' | 'admin'
export type GenderType = 'male' | 'female' | 'other'

export interface TutorBankDetails {
  account_holder_name: string
  account_number: string
  ifsc_code: string
  bank_name: string
  account_type: 'savings' | 'current'
  verified: boolean
}

export interface TutorDetails {
  register_fees_paid: boolean
  bio?: string
  qualifications?: string
  teaching_experience?: string
  specializations?: string[]
  languages_spoken?: string[]
  expertise_areas?: string[]
  verification_status: 'pending' | 'verified' | 'rejected'
  bank_details?: TutorBankDetails
}

// Payload used by FE when updating tutor details; backend controls payment flags

export type TutorDocumentType = 'degree' | 'certificate' | 'id_proof' | 'address_proof' | 'other'

export interface TutorDocumentItem {
  id: string
  file_name: string
  file_type: TutorDocumentType
  size_bytes: number
  created_at: string
  updated_at: string
  // Some backends wrap data; url retrieved via presigned URL endpoint
  url?: string | null
  metadata?: Record<string, any>
}

export interface TutorDocumentUploadResponse {
  id: string
  file_name: string
  file_type: TutorDocumentType
}
export type TutorDetailsUpdate = Omit<TutorDetails, 'register_fees_paid' | 'verification_status'>

export interface StudentDetails {
  degree?: string
  college_name?: string
  interests?: string[]
  learning_goals?: string[]
  preferred_languages?: string[]
  education_level?: string
  experience_level?: string
}

export interface User {
  id: string
  email: string
  name: string
  image?: string | null
  gender?: GenderType | null
  bio?: string | null
  dob?: string | null
  user_type: UserType
  tutor_details?: TutorDetails | null
  student_details?: StudentDetails | null
  onboarding_complete?: boolean | null
  created_at: string
  updated_at: string
}
