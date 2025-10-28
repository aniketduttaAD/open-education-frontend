import { z } from "zod";

export const StudentOnboardingSchema = z.object({
  dob: z
    .string()
    .refine((v) => /\d{4}-\d{2}-\d{2}/.test(v), "Valid date is required (YYYY-MM-DD)")
    .refine((v) => {
      const today = new Date();
      const dob = new Date(v);
      const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      return age >= 15;
    }, "You must be at least 15 years old"),
  degree: z.string().trim().min(1, "Degree is required"),
  college_name: z.string().trim().min(1, "College/University is required"),
  interests: z.array(z.string().trim()).min(1, "Select at least one interest"),
  learning_goals: z.array(z.string().trim()).min(1, "Add at least one goal"),
  preferred_languages: z.array(z.string().trim()).min(1, "Choose at least one language"),
  education_level: z.string().trim().min(1, "Education level is required"),
  experience_level: z.string().trim().min(1, "Experience level is required"),
});

export type StudentOnboardingInput = z.infer<typeof StudentOnboardingSchema>;

export const TutorBankSchema = z.object({
  account_holder_name: z.string().trim().min(3, "Account holder name is required"),
  account_number: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^[0-9]+$/.test(v), "Account number must be digits only")
    .refine((v) => v.length >= 9 && v.length <= 18, "Account number must be 9-18 digits"),
  ifsc_code: z
    .string()
    .transform((v) => v.toUpperCase().trim())
    .refine((v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v), "Enter a valid IFSC (e.g., HDFC0001234)"),
  bank_name: z.string().trim().min(2, "Bank name is required"),
  account_type: z.enum(["savings", "current"], {
    required_error: "Account type is required",
  }),
  verified: z.boolean().optional(),
});

export const TutorDetailsSchema = z.object({
  bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
  qualifications: z.union([
    z.string().trim().min(1, "Qualifications is required"),
    z.object({
      education: z.string().trim().min(1, "Education is required"),
      certifications: z.array(z.string().trim()).default([]),
      experience_years: z.number().min(0, "Experience must be >= 0"),
    })
  ]),
  teaching_experience: z.string().trim().min(1, "Teaching experience is required"),
  specializations: z.array(z.string().trim()).min(1, "Add at least one specialization"),
  languages_spoken: z.array(z.string().trim()).min(1, "Select at least one language"),
  expertise_areas: z.array(z.string().trim()).min(1, "Add at least one expertise area"),
  verification_status: z.enum(["pending", "verified", "rejected"]),
  bank_details: TutorBankSchema,
});

export type TutorDetailsInput = z.infer<typeof TutorDetailsSchema>;


