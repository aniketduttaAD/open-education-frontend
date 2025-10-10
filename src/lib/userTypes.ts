export type UserType = "student" | "tutor" | "admin";
export type GenderType = "male" | "female" | "other";

export interface TutorBankDetails {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  account_type: "savings" | "current";
  verified: boolean;
}

export interface TutorDetails {
  register_fees_paid: boolean;
  bio?: string;
  gender?: string;
  dob?: string;
  qualifications?: {
    degree: string;
    institution: string;
    year: string;
    additional: string;
  };
  teaching_experience?: string;
  specializations?: string[];
  languages_spoken?: string[];
  expertise_areas?: string[];
  verification_status: "pending" | "verified" | "rejected";
  bank_details?: TutorBankDetails;
}

// Payload used by FE when updating tutor details; backend controls payment flags

export type TutorDocumentType =
  | "degree"
  | "certificate"
  | "id_proof"
  | "address_proof"
  | "other";

export interface TutorDocumentItem {
  id: string;
  user_id: string;
  file_name: string;
  original_name: string;
  file_type: TutorDocumentType;
  mime_type: string;
  file_size: string;
  file_url: string;
  bucket_name: string;
  object_key: string;
  status: string;
  is_public: boolean;
  metadata?: Record<string, unknown>;
  thumbnail_url?: string | null;
  preview_url?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TutorDocumentUploadResponse {
  id: string;
  file_name: string;
  file_type: TutorDocumentType;
}
export interface TutorDetailsUpdate {
  gender: GenderType;
  dob: string; // Date in YYYY-MM-DD format
  bio: string;
  qualifications: {
    degree: string;
    institution: string;
    year: string;
    additional: string;
  };
  teaching_experience: string;
  specializations?: string[];
  languages_spoken?: string[];
  expertise_areas?: string[];
  bank_details: TutorBankDetails;
}

export interface StudentDetails {
  gender: GenderType;
  dob: string; // Date in YYYY-MM-DD format
  degree?: string;
  college_name?: string;
  interests?: string[];
  learning_goals?: string[];
  preferred_languages?: string[];
  education_level?: string;
  experience_level?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  gender?: GenderType | null;
  bio?: string | null;
  dob?: string | null; // Date in YYYY-MM-DD format
  user_type: UserType | null;
  tutor_details?: TutorDetails | null;
  student_details?: StudentDetails | null;
  onboarding_complete?: boolean | null;
  document_verification?: 'pending' | 'verified' | 'rejected' | null;
  created_at: string;
  updated_at: string;
}
