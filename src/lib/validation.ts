import { z } from 'zod'

export const GenderSchema = z.enum(['male','female','other']).optional().nullable()
export const UserTypeSchema = z.enum(['student','tutor','admin'])

export const TutorBankDetailsSchema = z.object({
  account_holder_name: z.string().min(1),
  account_number: z.string().min(6),
  ifsc_code: z.string().min(4),
  bank_name: z.string().min(1),
  account_type: z.enum(['savings','current']),
  verified: z.boolean()
})

export const TutorDetailsSchema = z.object({
  register_fees_paid: z.boolean(),
  bio: z.string().optional(),
  qualifications: z.string().optional(),
  teaching_experience: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  languages_spoken: z.array(z.string()).optional(),
  expertise_areas: z.array(z.string()).optional(),
  verification_status: z.enum(['pending','verified','rejected']),
  bank_details: TutorBankDetailsSchema.optional()
})

export const StudentDetailsSchema = z.object({
  degree: z.string().optional(),
  college_name: z.string().optional(),
  interests: z.array(z.string()).optional(),
  learning_goals: z.array(z.string()).optional(),
  preferred_languages: z.array(z.string()).optional(),
  education_level: z.string().optional(),
  experience_level: z.string().optional(),
})

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  image: z.string().url().optional().nullable(),
  gender: GenderSchema,
  bio: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  user_type: UserTypeSchema,
  tutor_details: TutorDetailsSchema.optional().nullable(),
  student_details: StudentDetailsSchema.optional().nullable(),
  onboarding_complete: z.boolean().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string()
})

export type TutorBankDetailsInput = z.infer<typeof TutorBankDetailsSchema>
export type TutorDetailsInput = z.infer<typeof TutorDetailsSchema>
export type StudentDetailsInput = z.infer<typeof StudentDetailsSchema>
