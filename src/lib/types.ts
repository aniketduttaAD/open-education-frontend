// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor' | 'admin';
  onboarding_completed: boolean;
  role_selected_at: string | null;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'student' | 'tutor' | 'admin';

// Profile types
export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  gender: string | null;
  latest_degree: string | null;
  college_university: string | null;
  created_at: string;
  updated_at: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  expertise: string[] | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  bank_account_number: string | null;
  ifsc_code: string | null;
  payment_verified: boolean;
  onboarding_fee_paid: boolean;
  avg_rating: number | null;
  total_students: number;
  total_courses: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
}

// Course types
export interface Course {
  id: string;
  tutor_id: string;
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  avg_rating: number | null;
  total_ratings: number;
  total_enrollments: number;
  completion_rate: number | null;
  estimated_duration: number | null;
  total_revisions_requested: number;
  max_revisions_allowed: number;
  thumbnail_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export type CourseStatus = 'draft' | 'published' | 'archived';

// Course with tutor information
export type CourseWithTutor = Course & {
  tutor_profiles: {
    id: string;
    name: string;
    bio?: string;
    avg_rating?: number;
    total_students?: number;
  } | null;
};

// Enrollment types
export interface CourseEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  total_topics: number;
  completed_topics: number;
  total_subtopics: number;
  completed_subtopics: number;
  is_completed: boolean;
  completed_at: string | null;
  certificate_generated: boolean;
  created_at: string;
  updated_at: string;
}

// Tutor status
export type TutorStatus = 'pending' | 'verified' | 'rejected';

// Component prop types
export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  [key: string]: unknown;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

export interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: "primary" | "success" | "warning" | "error";
}

// Form types
export interface StudentOnboardingForm {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  latestDegree: string;
  collegeUniversity: string;
}

export interface TutorOnboardingForm {
  firstName: string;
  lastName: string;
  bio: string;
  bankAccountNumber: string;
  ifscCode: string;
  documents: File[];
}

// Course creation types
export interface CourseCreationForm {
  title: string;
  description: string;
  price: number;
  category: string;
}

// Payment types
export interface PaymentForm {
  courseId: string;
  amount: number;
  currency: string;
}

// Analytics types
export interface TutorStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  monthlyEarnings: number;
}

export interface StudentStats {
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  averageQuizScore: number;
  loginStreak: number;
  totalAchievements: number;
}

// Achievement types
export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  earnedAt?: Date;
}

// Notification types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: Date;
}

// Search and filter types
export interface CourseFilters {
  search?: string;
  category?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  duration?: string;
  level?: string;
}

export interface SearchParams {
  query: string;
  filters: CourseFilters;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Admin types
export interface OwnerToken {
  token: string;
  owner: {
    id: string;
    email: string;
    name: string;
    isOwner: boolean;
    permissions: string[];
  };
  expires_in: string;
  permissions: string[];
}

export interface PendingTutor {
  id: string;
  name: string;
  email: string;
  image?: string;
  created_at: string;
  tutor_details?: {
    bio?: string;
    dob?: string;
    gender?: string;
    bank_details?: {
      verified: boolean;
      bank_name?: string;
      ifsc_code?: string;
      account_type?: string;
      account_number?: string;
      account_holder_name?: string;
    };
    qualifications?: {
      year?: string;
      degree?: string;
      additional?: string;
      institution?: string;
    };
    expertise_areas?: string[];
    specializations?: string[];
    languages_spoken?: string[];
    register_fees_paid?: boolean;
    teaching_experience?: string;
    verification_status?: string;
  };
  document_count?: number;
  has_required_documents?: boolean;
  missing_documents?: string[];
  uploaded_documents?: unknown[];
}

export interface VerificationStats {
  total_pending: number;
  total_verified: number;
  total_rejected: number;
  pending_this_week: number;
  verified_this_week: number;
}

export interface ApiTestResult {
  endpoint: string;
  status: 'success' | 'error';
  response?: unknown;
  error?: string;
}