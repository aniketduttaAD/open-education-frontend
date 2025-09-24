import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types based on the complete schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'student' | 'tutor' | 'admin'
          onboarding_completed: boolean
          role_selected_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'student' | 'tutor' | 'admin'
          onboarding_completed?: boolean
          role_selected_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'tutor' | 'admin'
          onboarding_completed?: boolean
          role_selected_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number | null
          gender: string | null
          latest_degree: string | null
          college_university: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age?: number | null
          gender?: string | null
          latest_degree?: string | null
          college_university?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number | null
          gender?: string | null
          latest_degree?: string | null
          college_university?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tutor_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          bio: string | null
          expertise: string[] | null
          verification_status: 'pending' | 'verified' | 'rejected'
          bank_account_number: string | null
          ifsc_code: string | null
          payment_verified: boolean
          onboarding_fee_paid: boolean
          avg_rating: number | null
          total_students: number
          total_courses: number
          total_earnings: number
          created_at: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          bio?: string | null
          expertise?: string[] | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          bank_account_number?: string | null
          ifsc_code?: string | null
          payment_verified?: boolean
          onboarding_fee_paid?: boolean
          avg_rating?: number | null
          total_students?: number
          total_courses?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          bio?: string | null
          expertise?: string[] | null
          verification_status?: 'pending' | 'verified' | 'rejected'
          bank_account_number?: string | null
          ifsc_code?: string | null
          payment_verified?: boolean
          onboarding_fee_paid?: boolean
          avg_rating?: number | null
          total_students?: number
          total_courses?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
          verified_at?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          tutor_id: string
          title: string
          description: string
          price: number
          status: 'draft' | 'published' | 'archived'
          avg_rating: number | null
          total_ratings: number
          total_enrollments: number
          completion_rate: number | null
          estimated_duration: number | null
          total_revisions_requested: number
          max_revisions_allowed: number
          thumbnail_url: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          tutor_id: string
          title: string
          description: string
          price: number
          status?: 'draft' | 'published' | 'archived'
          avg_rating?: number | null
          total_ratings?: number
          total_enrollments?: number
          completion_rate?: number | null
          estimated_duration?: number | null
          total_revisions_requested?: number
          max_revisions_allowed?: number
          thumbnail_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          tutor_id?: string
          title?: string
          description?: string
          price?: number
          status?: 'draft' | 'published' | 'archived'
          avg_rating?: number | null
          total_ratings?: number
          total_enrollments?: number
          completion_rate?: number | null
          estimated_duration?: number | null
          total_revisions_requested?: number
          max_revisions_allowed?: number
          thumbnail_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      course_enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          enrolled_at: string
          progress_percentage: number
          total_topics: number
          completed_topics: number
          total_subtopics: number
          completed_subtopics: number
          is_completed: boolean
          completed_at: string | null
          certificate_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          enrolled_at?: string
          progress_percentage?: number
          total_topics?: number
          completed_topics?: number
          total_subtopics?: number
          completed_subtopics?: number
          is_completed?: boolean
          completed_at?: string | null
          certificate_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          enrolled_at?: string
          progress_percentage?: number
          total_topics?: number
          completed_topics?: number
          total_subtopics?: number
          completed_subtopics?: number
          is_completed?: boolean
          completed_at?: string | null
          certificate_generated?: boolean
          created_at?: string
          updated_at?: string
        },
        payments: {
          Row: {
            id: string
            payer_id: string
            course_id: string | null
            razorpay_order_id: string
            razorpay_payment_id: string | null
            amount: number
            currency: string
            status: 'pending' | 'completed' | 'failed' | 'refunded'
            payment_type: string
            razorpay_signature: string | null
            failure_reason: string | null
            webhook_verified: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            payer_id: string
            course_id?: string | null
            razorpay_order_id: string
            razorpay_payment_id?: string | null
            amount: number
            currency?: string
            status?: 'pending' | 'completed' | 'failed' | 'refunded'
            payment_type: string
            razorpay_signature?: string | null
            failure_reason?: string | null
            webhook_verified?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            payer_id?: string
            course_id?: string | null
            razorpay_order_id?: string
            razorpay_payment_id?: string | null
            amount?: number
            currency?: string
            status?: 'pending' | 'completed' | 'failed' | 'refunded'
            payment_type?: string
            razorpay_signature?: string | null
            failure_reason?: string | null
            webhook_verified?: boolean
            created_at?: string
            updated_at?: string
          }
        },
        video_progress: {
          Row: {
            id: string
            student_id: string
            subtopic_id: string
            enrollment_id: string
            status: 'started' | 'in_progress' | 'completed' | 'not_started'
            watch_time_seconds: number
            total_duration_seconds: number
            progress_percentage: number
            last_position_seconds: number
            is_completed: boolean
            max_playback_speed_used: number
            skip_attempts: number
            integrity_verified: boolean
            playback_sessions: unknown | null
            started_at: string | null
            completed_at: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            student_id: string
            subtopic_id: string
            enrollment_id: string
            status?: 'started' | 'in_progress' | 'completed' | 'not_started'
            watch_time_seconds?: number
            total_duration_seconds?: number
            progress_percentage?: number
            last_position_seconds?: number
            is_completed?: boolean
            max_playback_speed_used?: number
            skip_attempts?: number
            integrity_verified?: boolean
            playback_sessions?: unknown | null
            started_at?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            subtopic_id?: string
            enrollment_id?: string
            status?: 'started' | 'in_progress' | 'completed' | 'not_started'
            watch_time_seconds?: number
            total_duration_seconds?: number
            progress_percentage?: number
            last_position_seconds?: number
            is_completed?: boolean
            max_playback_speed_used?: number
            skip_attempts?: number
            integrity_verified?: boolean
            playback_sessions?: unknown | null
            started_at?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
        },
        quizzes: {
          Row: {
            id: string
            topic_id: string
            title: string
            description: string | null
            questions: unknown
            passing_score: number
            time_limit_minutes: number | null
            max_attempts: number | null
            display_order: number
            is_mandatory: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            topic_id: string
            title: string
            description?: string | null
            questions: unknown
            passing_score?: number
            time_limit_minutes?: number | null
            max_attempts?: number | null
            display_order: number
            is_mandatory?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            topic_id?: string
            title?: string
            description?: string | null
            questions?: unknown
            passing_score?: number
            time_limit_minutes?: number | null
            max_attempts?: number | null
            display_order?: number
            is_mandatory?: boolean
            created_at?: string
            updated_at?: string
          }
        },
        quiz_attempts: {
          Row: {
            id: string
            student_id: string
            quiz_id: string
            enrollment_id: string
            answers: unknown
            score: number
            max_score: number
            percentage_score: number
            status: 'not_started' | 'in_progress' | 'passed' | 'failed'
            time_taken_minutes: number | null
            attempt_number: number
            started_at: string | null
            completed_at: string | null
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            quiz_id: string
            enrollment_id: string
            answers: unknown
            score: number
            max_score: number
            percentage_score: number
            status: 'not_started' | 'in_progress' | 'passed' | 'failed'
            time_taken_minutes?: number | null
            attempt_number?: number
            started_at?: string | null
            completed_at?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            quiz_id?: string
            enrollment_id?: string
            answers?: unknown
            score?: number
            max_score?: number
            percentage_score?: number
            status?: 'not_started' | 'in_progress' | 'passed' | 'failed'
            time_taken_minutes?: number | null
            attempt_number?: number
            started_at?: string | null
            completed_at?: string | null
            created_at?: string
          }
        }
        student_achievements: {
          Row: {
            id: string
            student_id: string
            achievement_id: string
            earned_at: string
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            achievement_id: string
            earned_at?: string
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            achievement_id?: string
            earned_at?: string
            created_at?: string
          }
        }
        achievement_definitions: {
          Row: {
            id: string
            name: string
            description: string
            icon: string
            criteria: unknown
            points: number
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            description: string
            icon: string
            criteria: unknown
            points: number
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            description?: string
            icon?: string
            criteria?: unknown
            points?: number
            created_at?: string
          }
        }
        certificates: {
          Row: {
            id: string
            student_id: string
            course_id: string
            enrollment_id: string
            certificate_url: string
            issued_at: string
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            enrollment_id: string
            certificate_url: string
            issued_at?: string
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            enrollment_id?: string
            certificate_url?: string
            issued_at?: string
            created_at?: string
          }
        }
        live_classes: {
          Row: {
            id: string
            tutor_id: string
            course_id: string
            title: string
            description: string | null
            scheduled_at: string
            duration_minutes: number
            max_participants: number
            meeting_url: string | null
            status: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            tutor_id: string
            course_id: string
            title: string
            description?: string | null
            scheduled_at: string
            duration_minutes: number
            max_participants: number
            meeting_url?: string | null
            status?: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            tutor_id?: string
            course_id?: string
            title?: string
            description?: string | null
            scheduled_at?: string
            duration_minutes?: number
            max_participants?: number
            meeting_url?: string | null
            status?: string
            created_at?: string
            updated_at?: string
          }
        }
        ai_buddy_usage: {
          Row: {
            id: string
            student_id: string
            course_id: string
            conversation_id: string
            tokens_used: number
            cost_inr: number
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            conversation_id: string
            tokens_used: number
            cost_inr: number
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            conversation_id?: string
            tokens_used?: number
            cost_inr?: number
            created_at?: string
          }
        }
        ai_buddy_conversations: {
          Row: {
            id: string
            student_id: string
            course_id: string
            status: 'active' | 'archived' | 'resolved' | 'flagged'
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            status?: 'active' | 'archived' | 'resolved' | 'flagged'
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            status?: 'active' | 'archived' | 'resolved' | 'flagged'
            created_at?: string
            updated_at?: string
          }
        }
        ai_buddy_messages: {
          Row: {
            id: string
            conversation_id: string
            role: 'user' | 'assistant' | 'system' | 'function'
            content: string
            tokens_used: number
            created_at: string
          }
          Insert: {
            id?: string
            conversation_id: string
            role: 'user' | 'assistant' | 'system' | 'function'
            content: string
            tokens_used: number
            created_at?: string
          }
          Update: {
            id?: string
            conversation_id?: string
            role?: 'user' | 'assistant' | 'system' | 'function'
            content?: string
            tokens_used?: number
            created_at?: string
          }
        }
        course_categories: {
          Row: {
            id: string
            name: string
            description: string | null
            icon: string | null
            is_active: boolean
            display_order: number | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            name: string
            description?: string | null
            icon?: string | null
            is_active?: boolean
            display_order?: number | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            name?: string
            description?: string | null
            icon?: string | null
            is_active?: boolean
            display_order?: number | null
            created_at?: string
            updated_at?: string
          }
        }
        course_category_relations: {
          Row: {
            id: string
            course_id: string
            category_id: string
            created_at: string
          }
          Insert: {
            id?: string
            course_id: string
            category_id: string
            created_at?: string
          }
          Update: {
            id?: string
            course_id?: string
            category_id?: string
            created_at?: string
          }
        }
        course_topics: {
          Row: {
            id: string
            course_id: string
            title: string
            description: string | null
            display_order: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            course_id: string
            title: string
            description?: string | null
            display_order: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            course_id?: string
            title?: string
            description?: string | null
            display_order?: number
            created_at?: string
            updated_at?: string
          }
        }
        course_subtopics: {
          Row: {
            id: string
            topic_id: string
            title: string
            description: string | null
            content_markdown: string | null
            video_url: string | null
            video_duration: number | null
            thumbnail_url: string | null
            display_order: number
            is_preview: boolean
            video_transcript: string | null
            ai_generated_summary: string | null
            key_concepts: string[] | null
            difficulty_level: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            topic_id: string
            title: string
            description?: string | null
            content_markdown?: string | null
            video_url?: string | null
            video_duration?: number | null
            thumbnail_url?: string | null
            display_order: number
            is_preview?: boolean
            video_transcript?: string | null
            ai_generated_summary?: string | null
            key_concepts?: string[] | null
            difficulty_level?: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            topic_id?: string
            title?: string
            description?: string | null
            content_markdown?: string | null
            video_url?: string | null
            video_duration?: number | null
            thumbnail_url?: string | null
            display_order?: number
            is_preview?: boolean
            video_transcript?: string | null
            ai_generated_summary?: string | null
            key_concepts?: string[] | null
            difficulty_level?: number
            created_at?: string
            updated_at?: string
          }
        }
        tutor_earnings: {
          Row: {
            id: string
            tutor_id: string
            payment_id: string
            course_id: string
            gross_amount: number
            platform_commission_percentage: number
            platform_commission_amount: number
            net_earnings: number
            payout_status: string
            payout_date: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            tutor_id: string
            payment_id: string
            course_id: string
            gross_amount: number
            platform_commission_percentage?: number
            platform_commission_amount: number
            net_earnings: number
            payout_status?: string
            payout_date?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            tutor_id?: string
            payment_id?: string
            course_id?: string
            gross_amount?: number
            platform_commission_percentage?: number
            platform_commission_amount?: number
            net_earnings?: number
            payout_status?: string
            payout_date?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        flashcards: {
          Row: {
            id: string
            topic_id: string
            question: string
            answer: string
            display_order: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            topic_id: string
            question: string
            answer: string
            display_order: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            topic_id?: string
            question?: string
            answer?: string
            display_order?: number
            created_at?: string
            updated_at?: string
          }
        }
        course_reviews: {
          Row: {
            id: string
            student_id: string
            course_id: string
            rating: number
            review_text: string | null
            is_verified_purchase: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            rating: number
            review_text?: string | null
            is_verified_purchase?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            rating?: number
            review_text?: string | null
            is_verified_purchase?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        review_replies: {
          Row: {
            id: string
            review_id: string
            tutor_id: string
            reply_text: string
            created_at: string
          }
          Insert: {
            id?: string
            review_id: string
            tutor_id: string
            reply_text: string
            created_at?: string
          }
          Update: {
            id?: string
            review_id?: string
            tutor_id?: string
            reply_text?: string
            created_at?: string
          }
        },
        notifications: {
          Row: {
            id: string
            user_id: string
            title: string
            message: string
            type: string
            is_read: boolean
            related_entity_id: string | null
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            title: string
            message: string
            type: string
            is_read?: boolean
            related_entity_id?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            title?: string
            message?: string
            type?: string
            is_read?: boolean
            related_entity_id?: string | null
            created_at?: string
          }
        }
        course_content_embeddings: {
          Row: {
            id: string
            course_id: string
            content_type: 'topic' | 'subtopic' | 'markdown_notes' | 'video_transcript' | 'quiz' | 'flashcard' | 'slide_content'
            content_id: string
            content_text: string
            embedding: unknown
            created_at: string
          }
          Insert: {
            id?: string
            course_id: string
            content_type: 'topic' | 'subtopic' | 'markdown_notes' | 'video_transcript' | 'quiz' | 'flashcard' | 'slide_content'
            content_id: string
            content_text: string
            embedding: unknown
            created_at?: string
          }
          Update: {
            id?: string
            course_id?: string
            content_type?: 'topic' | 'subtopic' | 'markdown_notes' | 'video_transcript' | 'quiz' | 'flashcard' | 'slide_content'
            content_id?: string
            content_text?: string
            embedding?: unknown
            created_at?: string
          }
        }
        ai_buddy_message_feedback: {
          Row: {
            id: string
            message_id: string
            feedback_type: 'helpful' | 'not_helpful' | 'incorrect' | 'too_complex' | 'too_simple'
            created_at: string
          }
          Insert: {
            id?: string
            message_id: string
            feedback_type: 'helpful' | 'not_helpful' | 'incorrect' | 'too_complex' | 'too_simple'
            created_at?: string
          }
          Update: {
            id?: string
            message_id?: string
            feedback_type?: 'helpful' | 'not_helpful' | 'incorrect' | 'too_complex' | 'too_simple'
            created_at?: string
          }
        }
        ai_buddy_learning_analytics: {
          Row: {
            id: string
            student_id: string
            course_id: string
            conversation_id: string
            learning_objective: string
            progress_metrics: unknown
            difficulty_level: number
            time_spent_minutes: number
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            conversation_id: string
            learning_objective: string
            progress_metrics: unknown
            difficulty_level: number
            time_spent_minutes: number
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            conversation_id?: string
            learning_objective?: string
            progress_metrics?: unknown
            difficulty_level?: number
            time_spent_minutes?: number
            created_at?: string
          }
        }
        ai_buddy_smart_suggestions: {
          Row: {
            id: string
            student_id: string
            course_id: string
            suggestion_type: string
            suggestion_content: string
            relevance_score: number
            is_implemented: boolean
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            suggestion_type: string
            suggestion_content: string
            relevance_score: number
            is_implemented?: boolean
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            suggestion_type?: string
            suggestion_content?: string
            relevance_score?: number
            is_implemented?: boolean
            created_at?: string
          }
        }
        course_knowledge_graph: {
          Row: {
            id: string
            course_id: string
            node_id: string
            node_type: string
            node_content: string
            connections: unknown
            created_at: string
          }
          Insert: {
            id?: string
            course_id: string
            node_id: string
            node_type: string
            node_content: string
            connections: unknown
            created_at?: string
          }
          Update: {
            id?: string
            course_id?: string
            node_id?: string
            node_type?: string
            node_content?: string
            connections?: unknown
            created_at?: string
          }
        }
        course_revisions: {
          Row: {
            id: string
            course_id: string
            revision_type: string
            revision_details: string
            requested_by: string
            status: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            course_id: string
            revision_type: string
            revision_details: string
            requested_by: string
            status?: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            course_id?: string
            revision_type?: string
            revision_details?: string
            requested_by?: string
            status?: string
            created_at?: string
            updated_at?: string
          }
        }
        tutor_leaderboard: {
          Row: {
            id: string
            tutor_id: string
            total_earnings: number
            total_students: number
            avg_rating: number
            period: string
            rank: number
            created_at: string
          }
          Insert: {
            id?: string
            tutor_id: string
            total_earnings: number
            total_students: number
            avg_rating: number
            period: string
            rank: number
            created_at?: string
          }
          Update: {
            id?: string
            tutor_id?: string
            total_earnings?: number
            total_students?: number
            avg_rating?: number
            period?: string
            rank?: number
            created_at?: string
          }
        }
        student_login_streaks: {
          Row: {
            id: string
            student_id: string
            current_streak: number
            longest_streak: number
            last_login_date: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            student_id: string
            current_streak?: number
            longest_streak?: number
            last_login_date: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            current_streak?: number
            longest_streak?: number
            last_login_date?: string
            created_at?: string
            updated_at?: string
          }
        }
        course_recommendations: {
          Row: {
            id: string
            student_id: string
            course_id: string
            recommendation_score: number
            recommendation_reason: string
            is_viewed: boolean
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            recommendation_score: number
            recommendation_reason: string
            is_viewed?: boolean
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            recommendation_score?: number
            recommendation_reason?: string
            is_viewed?: boolean
            created_at?: string
          }
        }
        quiz_streaks: {
          Row: {
            id: string
            student_id: string
            current_streak: number
            longest_streak: number
            last_quiz_date: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            student_id: string
            current_streak?: number
            longest_streak?: number
            last_quiz_date: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            current_streak?: number
            longest_streak?: number
            last_quiz_date?: string
            created_at?: string
            updated_at?: string
          }
        }
        tutor_withdrawals: {
          Row: {
            id: string
            tutor_id: string
            amount: number
            bank_account_number: string
            ifsc_code: string
            status: string
            processed_at: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            tutor_id: string
            amount: number
            bank_account_number: string
            ifsc_code: string
            status?: string
            processed_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            tutor_id?: string
            amount?: number
            bank_account_number?: string
            ifsc_code?: string
            status?: string
            processed_at?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        student_wishlist: {
          Row: {
            id: string
            student_id: string
            course_id: string
            added_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            added_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            added_at?: string
          }
        }
        course_completion_certificates: {
          Row: {
            id: string
            student_id: string
            course_id: string
            enrollment_id: string
            certificate_url: string
            issued_at: string
            verification_code: string
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            course_id: string
            enrollment_id: string
            certificate_url: string
            issued_at?: string
            verification_code: string
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            course_id?: string
            enrollment_id?: string
            certificate_url?: string
            issued_at?: string
            verification_code?: string
            created_at?: string
          }
        }
        tutor_documents: {
          Row: {
            id: string
            tutor_id: string
            document_type: string
            document_url: string
            verification_status: string
            uploaded_at: string
            verified_at: string | null
            created_at: string
          }
          Insert: {
            id?: string
            tutor_id: string
            document_type: string
            document_url: string
            verification_status?: string
            uploaded_at?: string
            verified_at?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            tutor_id?: string
            document_type?: string
            document_url?: string
            verification_status?: string
            uploaded_at?: string
            verified_at?: string | null
            created_at?: string
          }
        }
        live_class_attendees: {
          Row: {
            id: string
            live_class_id: string
            student_id: string
            joined_at: string | null
            left_at: string | null
            attendance_duration: number | null
            created_at: string
          }
          Insert: {
            id?: string
            live_class_id: string
            student_id: string
            joined_at?: string | null
            left_at?: string | null
            attendance_duration?: number | null
            created_at?: string
          }
          Update: {
            id?: string
            live_class_id?: string
            student_id?: string
            joined_at?: string | null
            left_at?: string | null
            attendance_duration?: number | null
            created_at?: string
          }
        }
        student_token_allocations: {
          Row: {
            id: string
            student_id: string
            tokens_allocated: number
            tokens_used: number
            allocation_date: string
            expiry_date: string | null
            created_at: string
          }
          Insert: {
            id?: string
            student_id: string
            tokens_allocated: number
            tokens_used?: number
            allocation_date: string
            expiry_date?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            student_id?: string
            tokens_allocated?: number
            tokens_used?: number
            allocation_date?: string
            expiry_date?: string | null
            created_at?: string
          }
        }
        notification_delivery_logs: {
          Row: {
            id: string
            notification_id: string
            delivery_method: string
            delivery_status: string
            delivery_time: string | null
            error_message: string | null
            created_at: string
          }
          Insert: {
            id?: string
            notification_id: string
            delivery_method: string
            delivery_status: string
            delivery_time?: string | null
            error_message?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            notification_id?: string
            delivery_method?: string
            delivery_status?: string
            delivery_time?: string | null
            error_message?: string | null
            created_at?: string
          }
        }
        certificate_verification_logs: {
          Row: {
            id: string
            certificate_id: string
            verification_code: string
            verification_status: string
            verified_at: string | null
            ip_address: string | null
            user_agent: string | null
            created_at: string
          }
          Insert: {
            id?: string
            certificate_id: string
            verification_code: string
            verification_status: string
            verified_at?: string | null
            ip_address?: string | null
            user_agent?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            certificate_id?: string
            verification_code?: string
            verification_status?: string
            verified_at?: string | null
            ip_address?: string | null
            user_agent?: string | null
            created_at?: string
          }
        }
      }
    }
    Enums: {
      user_role: 'student' | 'tutor' | 'admin'
      tutor_status: 'pending' | 'verified' | 'rejected'
      course_status: 'draft' | 'published' | 'archived'
      video_status: 'started' | 'in_progress' | 'completed' | 'not_started'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      quiz_status: 'not_started' | 'in_progress' | 'passed' | 'failed'
      ai_message_role: 'user' | 'assistant' | 'system' | 'function'
      content_type: 'topic' | 'subtopic' | 'markdown_notes' | 'video_transcript' | 'quiz' | 'flashcard' | 'slide_content'
      conversation_status: 'active' | 'archived' | 'resolved' | 'flagged'
      message_feedback_type: 'helpful' | 'not_helpful' | 'incorrect' | 'too_complex' | 'too_simple'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
