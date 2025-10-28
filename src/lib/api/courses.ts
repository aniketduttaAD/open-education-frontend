import axios from '@/lib/axios'

export interface CourseFilters {
  page?: number
  limit?: number
  search?: string
  level?: string
  category?: string
  priceRange?: { min: number; max: number }
}

export interface Course {
  id: string
  tutor_user_id?: string
  title: string
  description: string
  price_inr: number | null
  created_at: string
  updated_at: string
  sections: Section[]
  // Additional fields for frontend compatibility
  tutor?: {
    id: string
    name: string
    email: string
    image?: string
    user_type?: string
    bio?: string
    expertise_areas?: string[]
    specializations?: string[]
    teaching_experience?: string
    verification_status?: string
  }
  price: number
  avg_rating: number | null
  total_enrollments: number
  estimated_duration: number | null
  is_featured: boolean
  tutor_id: string
  status: 'published' | 'draft' | 'archived'
  total_ratings: number
  completion_rate: number | null
  difficulty_level?: string
  category?: string
  tags?: string[]
  total_revisions_requested: number
  max_revisions_allowed: number
  thumbnail_url: string | null
  published_at: string | null
  summary?: {
    totalSections: number
    totalSubtopics: number
    totalVideos: number
    totalQuizzes: number
    totalFlashcards: number
  }
}

export interface Section {
  id: string
  course_id?: string
  index: number
  title: string
  created_at?: string
  updated_at?: string
  subtopics: Subtopic[]
  quizzes?: Quiz[]
  flashcards?: Flashcard[]
}

export interface Quiz {
  id: string
  title: string
  course_id?: string
  section_id?: string
  questions: Question[]
}

export interface Question {
  id: string
  question: string
  options: string[]
  correct_index: number
  index: number
}

export interface Flashcard {
  id: string
  front: string
  back: string
  course_id?: string
  section_id?: string
  index: number
}

export interface Subtopic {
  id: string
  section_id: string
  index: number
  title: string
  markdown_path: string | null
  transcript_path: string | null
  audio_path: string | null
  video_url: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface TutorCourse extends Course {
  tutor_id: string
  status: 'published' | 'draft' | 'archived'
  total_ratings: number
  completion_rate: number
  difficulty_level: string
  category: string
  tags: string[]
}

export interface CoursesResponse {
  success: boolean
  data: {
    courses: Course[]
    total: number
    page: number
    limit: number
  }
  message: string
  timestamp: string
}

export interface TutorCoursesResponse {
  courses: TutorCourse[]
  total: number
  page: number
  limit: number
}

export const coursesApi = {
  // Get all courses from all tutors
  getAllCourses: async (filters: CourseFilters = {}): Promise<CoursesResponse> => {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.level) params.append('level', filters.level)
    if (filters.category) params.append('category', filters.category)
    if (filters.priceRange) {
      params.append('priceRange', `${filters.priceRange.min}-${filters.priceRange.max}`)
    }

    const response = await axios.get(`/courses/platform/all?${params}`)
    return response.data
  },

  // Get course by ID
  getCourseById: async (courseId: string): Promise<Course> => {
    const response = await axios.get(`/courses/${courseId}`)
    return response.data.data
  },

  // Get course details (alias for getCourseById)
  getCourse: async (courseId: string): Promise<Course> => {
    const response = await axios.get(`/courses/${courseId}`)
    return response.data.data.data.course
  },

  // Get courses by tutor
  getCoursesByTutor: async (tutorId: string, filters: CourseFilters = {}): Promise<CoursesResponse> => {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.search) params.append('search', filters.search)

    const response = await axios.get(`/courses/tutor/${tutorId}?${params}`)
    return response.data
  },

  // Get tutor courses (for tutor dashboard)
  getTutorCourses: async (tutorId: string, page: number = 1, limit: number = 12): Promise<TutorCoursesResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await axios.get(`/courses/tutor/${tutorId}?${params}`)
    return response.data.data
  },

  // Delete course
  deleteCourse: async (courseId: string): Promise<void> => {
    await axios.delete(`/courses/${courseId}`)
  }
}