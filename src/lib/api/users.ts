import api from "@/lib/axios";
import type {
  User,
  UserType,
  StudentDetails,
  TutorDetailsUpdate,
  TutorDocumentItem,
  TutorDocumentType,
  TutorDocumentUploadResponse,
} from "@/lib/userTypes";

function extractData<T>(res: {
  data?: { data?: T; [key: string]: unknown };
}): T {
  return (res.data?.data ?? res.data) as T;
}

function normalizeUser(raw: Record<string, unknown>): User {
  // Some backends may nest tutor_details twice; there can be flags at container and inner levels
  const tutorContainer =
    (raw?.tutor_details as Record<string, unknown> | null) ?? null;
  const innerTutor =
    (tutorContainer?.tutor_details as Record<string, unknown> | null) ?? null;
  const td = innerTutor ?? tutorContainer ?? null;

  // Prefer container-level flags, then inner, then user-level (rare), then defaults
  const registerFeesPaid =
    (typeof tutorContainer?.register_fees_paid === "boolean"
      ? tutorContainer.register_fees_paid
      : undefined) ??
    (typeof innerTutor?.register_fees_paid === "boolean"
      ? innerTutor.register_fees_paid
      : undefined) ??
    (typeof raw?.register_fees_paid === "boolean"
      ? raw.register_fees_paid
      : undefined) ??
    false;

  const resolvedVerificationStatus =
    (tutorContainer?.verification_status as "pending" | "verified" | "rejected" | undefined) ??
    (innerTutor?.verification_status as "pending" | "verified" | "rejected" | undefined) ??
    (raw?.verification_status as "pending" | "verified" | "rejected" | undefined) ??
    "pending";

  const normalized: User = {
    id: raw.id as string,
    email: raw.email as string,
    name: raw.name as string,
    image: (raw.image as string | null) ?? null,
    gender: (raw.gender as "male" | "female" | "other" | null) ?? null,
    bio: (raw.bio as string | null) ?? null,
    dob: (raw.dob as string | null) ?? null,
    user_type: raw.user_type as "student" | "tutor" | "admin",
    tutor_details: td
      ? {
          // Spread all fields from the tutor_details object
          ...(td as Record<string, unknown>),
          // Override with normalized values
          register_fees_paid: !!registerFeesPaid,
          verification_status: resolvedVerificationStatus,
        }
      : null,
    student_details: raw.student_details as StudentDetails | null,
    onboarding_complete: (raw.onboarding_complete as boolean | null) ?? false,
    document_verification: (raw.document_verification as "pending" | "verified" | "rejected" | null) ?? null,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  };
  return normalized;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const res = await api.get("/users/profile");
    const payload = extractData(res);
    return normalizeUser(payload as Record<string, unknown>);
  },
  updateProfile: async (
    payload: Partial<Pick<User, "name" | "image" | "bio" | "dob" | "gender">>
  ): Promise<User> => {
    const res = await api.put("/users/profile", payload);
    const data = extractData(res);
    return normalizeUser(data as Record<string, unknown>);
  },
  setOnboardingComplete: async (): Promise<User> => {
    const res = await api.put("/users/onboarding", {
      onboarding_complete: true,
    });
    const data = extractData(res);
    return normalizeUser(data as Record<string, unknown>);
  },
  updateUserType: async (
    user_type: Exclude<UserType, "admin">
  ): Promise<User> => {
    const res = await api.put("/users/profile", { user_type });
    const data = extractData(res);
    return normalizeUser(data as Record<string, unknown>);
  },
  updateStudentDetails: async (
    student_details: StudentDetails
  ): Promise<User> => {
    const res = await api.put("/users/student-details", student_details);
    const data = extractData(res);
    return normalizeUser(data as Record<string, unknown>);
  },
  updateTutorDetails: async (
    tutor_details: TutorDetailsUpdate
  ): Promise<User> => {
    const res = await api.put("/users/tutor-details", tutor_details);
    const data = extractData(res);
    return normalizeUser(data as Record<string, unknown>);
  },

  // Tutor verification documents APIs
  listTutorDocuments: async (): Promise<TutorDocumentItem[]> => {
    const res = await api.get("/users/tutors/documents");
    // Handle nested response structure
    const responseData = res.data?.data?.data || res.data?.data || res.data;
    return Array.isArray(responseData) ? responseData as TutorDocumentItem[] : [];
  },

  getTutorDocumentUrl: async (documentId: string): Promise<string> => {
    const res = await api.get(`/users/tutors/documents/${documentId}/url`);
    const data = extractData(res);
    return (data as { url?: string })?.url as string;
  },

  uploadTutorDocument: async (
    file: File,
    file_type: TutorDocumentType,
    description?: string
  ): Promise<TutorDocumentUploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    form.append("file_type", file_type);
    if (description) form.append("description", String(description));

    const res = await api.post("/users/tutors/documents/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = extractData(res);
    return data as TutorDocumentUploadResponse;
  },

  updateTutorDocument: async (
    documentId: string,
    payload: Partial<{ description: string; document_type: TutorDocumentType }>
  ): Promise<TutorDocumentItem> => {
    const res = await api.put(`/users/tutors/documents/${documentId}`, payload);
    const data = extractData(res);
    return data as TutorDocumentItem;
  },

  deleteTutorDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/users/tutors/documents/${documentId}`);
  },

  downloadTutorDocument: async (documentId: string): Promise<Blob> => {
    const res = await api.get(`/users/tutors/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return res.data as Blob;
  },
};
