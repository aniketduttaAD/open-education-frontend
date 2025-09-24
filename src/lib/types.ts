import { Database } from "./supabase";

// User types
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserRole = Database["public"]["Enums"]["user_role"];

// Profile types
export type StudentProfile =
  Database["public"]["Tables"]["student_profiles"]["Row"];
export type TutorProfile =
  Database["public"]["Tables"]["tutor_profiles"]["Row"];

// Course types
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseStatus = Database["public"]["Enums"]["course_status"];

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
export type CourseEnrollment =
  Database["public"]["Tables"]["course_enrollments"]["Row"];

// Payment types - temporarily commented out until database schema is updated
// export type Payment = Database["public"]["Tables"]["payments"]["Row"];
// export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
// export type Order = Database["public"]["Tables"]["orders"]["Row"];

// Notification types - temporarily commented out due to TypeScript cache issue
// export type Notification = Database['public']['Tables']['notifications']['Row']

// Tutor status
export type TutorStatus = Database["public"]["Enums"]["tutor_status"];

// Video progress types - temporarily commented out due to TypeScript cache issue
// export type VideoProgress = Database['public']['Tables']['video_progress']['Row']
// export type VideoStatus = Database['public']['Enums']['video_status']

// Quiz types - temporarily commented out due to TypeScript cache issue
// export type Quiz = Database['public']['Tables']['quizzes']['Row']
// export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
// export type QuizStatus = Database['public']['Enums']['quiz_status']

// Achievement types - temporarily commented out due to TypeScript cache issue
// export type StudentAchievement = Database['public']['Tables']['student_achievements']['Row']
// export type AchievementDefinition = Database['public']['Tables']['achievement_definitions']['Row']

// Certificate types - temporarily commented out due to TypeScript cache issue
// export type Certificate = Database['public']['Tables']['certificates']['Row']

// Live class types - temporarily commented out due to TypeScript cache issue
// export type LiveClass = Database['public']['Tables']['live_classes']['Row']

// AI Buddy types - temporarily commented out due to TypeScript cache issue
// export type AIBuddyUsage = Database['public']['Tables']['ai_buddy_usage']['Row']
// export type AIBuddyConversation = Database['public']['Tables']['ai_buddy_conversations']['Row']
// export type AIBuddyMessage = Database['public']['Tables']['ai_buddy_messages']['Row']

// Content embedding types - temporarily commented out
// export type CourseContentEmbedding = Database['public']['Tables']['course_content_embeddings']['Row']
// export type ContentType = Database['public']['Enums']['content_type']

// Knowledge graph types - temporarily commented out
// export type CourseKnowledgeGraph = Database['public']['Tables']['course_knowledge_graph']['Row']

// Review types - temporarily commented out
// export type CourseReview = Database['public']['Tables']['course_reviews']['Row']
// export type ReviewReply = Database['public']['Tables']['review_replies']['Row']

// Streak types - temporarily commented out
// export type StudentLoginStreak = Database['public']['Tables']['student_login_streaks']['Row']
// export type QuizStreak = Database['public']['Tables']['quiz_streaks']['Row']

// Leaderboard types - temporarily commented out
// export type TutorLeaderboard = Database['public']['Tables']['tutor_leaderboard']['Row']

// Recommendation types - temporarily commented out
// export type CourseRecommendation = Database['public']['Tables']['course_recommendations']['Row']

// Withdrawal types - temporarily commented out
// export type TutorWithdrawal = Database['public']['Tables']['tutor_withdrawals']['Row']

// Document types - temporarily commented out
// export type TutorDocument = Database['public']['Tables']['tutor_documents']['Row']

// Live class attendee types - temporarily commented out
// export type LiveClassAttendee = Database['public']['Tables']['live_class_attendees']['Row']

// Token allocation types - temporarily commented out
// export type StudentTokenAllocation = Database['public']['Tables']['student_token_allocations']['Row']

// Notification delivery types - temporarily commented out
// export type NotificationDeliveryLog = Database['public']['Tables']['notification_delivery_logs']['Row']

// Certificate verification types - temporarily commented out
// export type CertificateVerificationLog = Database['public']['Tables']['certificate_verification_logs']['Row']

// Wishlist types - temporarily commented out
// export type StudentWishlist = Database['public']['Tables']['student_wishlist']['Row']

// Course completion certificate types - temporarily commented out
// export type CourseCompletionCertificate = Database['public']['Tables']['course_completion_certificates']['Row']

// Course revision types - temporarily commented out
// export type CourseRevision = Database['public']['Tables']['course_revisions']['Row']

// AI Buddy configuration types - temporarily commented out
// export type AIBuddyCourseConfig = Database['public']['Tables']['ai_buddy_course_config']['Row']

// AI Buddy learning analytics types - temporarily commented out
// export type AIBuddyLearningAnalytics = Database['public']['Tables']['ai_buddy_learning_analytics']['Row']

// AI Buddy smart suggestions types - temporarily commented out
// export type AIBuddySmartSuggestion = Database['public']['Tables']['ai_buddy_smart_suggestions']['Row']

// AI Buddy message feedback types - temporarily commented out
// export type AIBuddyMessageFeedback = Database['public']['Tables']['ai_buddy_message_feedback']['Row']
// export type MessageFeedbackType = Database['public']['Enums']['message_feedback_type']

// Conversation status types - temporarily commented out
// export type ConversationStatus = Database['public']['Enums']['conversation_status']

// AI message role types - temporarily commented out
// export type AIMessageRole = Database['public']['Enums']['ai_message_role']

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

// AI Buddy types - temporarily commented out
// export interface AIBuddyMessage {
//   id: string
//   role: 'user' | 'assistant'
//   content: string
//   timestamp: Date
//   feedback?: MessageFeedbackType
// }

// export interface AIBuddyConversation {
//   id: string
//   studentId: string
//   courseId: string
//   messages: AIBuddyMessage[]
//   status: ConversationStatus
//   createdAt: Date
//   updatedAt: Date
// }

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
