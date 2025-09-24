'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'


import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { usePayment } from '@/lib/payments'
import { formatPrice } from '@/lib/utils'
import { CourseEnrollment, CourseWithTutor } from '@/lib/types'
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Award,
  ArrowRight,
  Calendar,
  User as UserIcon,
  Target,
  Zap
} from 'lucide-react'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<CourseWithTutor | null>(null)
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [user, setUser] = useState<{
    id: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
    onboarding_completed: boolean;
    role_selected_at: string | null;
    created_at: string;
    updated_at: string;
  } | null>(null)
  
  const { processPayment } = usePayment()

  const fetchCourseData = useCallback(async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          tutor_profiles (
            id,
            name,
            bio,
            avg_rating,
            total_students
          )
        `)
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Check if user is enrolled
      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('student_id', user.id)
          .single()

        if (!enrollmentError && enrollmentData) {
          setEnrollment(enrollmentData)
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }, [courseId, user])

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && courseId) {
      fetchCourseData()
    }
  }, [user, courseId, fetchCourseData])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      // Create a proper User object for the Header component
      const userObj = {
        id: session.user.id,
        email: session.user.email || '',
        role: 'student' as const, // Default role
        onboarding_completed: false,
        role_selected_at: null,
        created_at: session.user.created_at || new Date().toISOString(),
        updated_at: session.user.updated_at || new Date().toISOString()
      }
      setUser(userObj)
    }
  }



  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/callback')
      return
    }

    if (!course) return

    setEnrolling(true)
    try {
      await processPayment(course.id, course.price, course.title)
      
      // Refresh enrollment data
      await fetchCourseData()
      
      // Show success message
      alert('Successfully enrolled in the course!')
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Failed to enroll. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <p className="text-gray-600 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  const isEnrolled = !!enrollment
  const canEnroll = course.status === 'published' && !isEnrolled

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-lg opacity-90 max-w-2xl">{course.description}</p>
                </div>
                {course.is_featured && (
                  <div className="absolute top-6 right-6 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured Course
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-2">
                      <Star className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-lg font-semibold">{course.avg_rating?.toFixed(1) || '4.5'}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-full mx-auto mb-2">
                      <Users className="w-6 h-6 text-success-600" />
                    </div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="text-lg font-semibold">{course.total_enrollments || 0}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mx-auto mb-2">
                      <Clock className="w-6 h-6 text-secondary-600" />
                    </div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold">{formatDuration(course.estimated_duration)}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-full mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-warning-600" />
                    </div>
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="text-lg font-semibold">{course.completion_rate || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">What you&apos;ll learn</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered personalized learning experience</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Interactive quizzes and assessments</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">24/7 AI learning assistant</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Certificate upon completion</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Lifetime access to course content</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Requirements */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Requirements</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Basic computer skills and internet access</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">No prior experience required - suitable for beginners</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Dedication to learn and practice regularly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Course Description</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    This comprehensive course is designed to provide you with a solid foundation and practical skills. 
                    Our AI-powered learning system adapts to your pace and learning style, ensuring you get the most 
                    out of your educational journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                        <span className="text-success-800 font-medium">You&apos;re enrolled!</span>
                      </div>
                    </div>
                    
                    {enrollment && (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Progress</p>
                          <ProgressBar 
                            progress={enrollment.progress_percentage || 0} 
                            showLabel={false}
                            className="mt-1"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {enrollment.completed_subtopics || 0} of {enrollment.total_subtopics || 0} lessons completed
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      onClick={() => router.push(`/courses/${course.id}/learn`)}
                    >
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleEnroll}
                      loading={enrolling}
                      disabled={!canEnroll}
                    >
                      {canEnroll ? 'Enroll Now' : 'Coming Soon'}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        30-Day Money-Back Guarantee
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Play className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Video lessons</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Quizzes & assessments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">AI learning assistant</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tutor Info */}
            {course.tutor_profiles && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">About the Instructor</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{course.tutor_profiles.name}</p>
                      <p className="text-sm text-gray-600">
                        {course.tutor_profiles.total_students || 0} students enrolled
                      </p>
                    </div>
                  </div>
                  {course.tutor_profiles.bio && (
                    <p className="text-sm text-gray-600">{course.tutor_profiles.bio}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
