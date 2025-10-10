import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { Course, User } from '@/lib/types'

type CourseWithTutor = Course & {
  tutor_profiles: {
    name: string
  } | null
}
import { Star, Users, Play, BookOpen } from 'lucide-react'

interface FeaturedCoursesProps {
  user: User | null
}

export function FeaturedCourses({ user }: FeaturedCoursesProps) {
  const [courses, setCourses] = useState<CourseWithTutor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFeaturedCourses()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchFeaturedCourses = async () => {
    try {
      setCourses([])
    } catch (error) {
      console.error('Error fetching featured courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  // If user is not logged in, don't show courses section
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-neutral-600">
              Discover our most popular AI-generated courses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-4" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-neutral-600">
            Discover our most popular AI-generated courses
          </p>
        </motion.div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No Courses Available
              </h3>
              <p className="text-neutral-600 mb-6">
                We&apos;re working on creating amazing courses for you. Check back soon!
              </p>
              <Button variant="outline">
                Get Notified
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            View All Courses
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function CourseCard({ course }: { course: CourseWithTutor }) {
  const tutorName = course.tutor_profiles?.name || 'Unknown Tutor'

  return (
    <Card className="group h-full">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary-600 opacity-50" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold line-clamp-2">{course.title}</h3>
            <p className="text-sm opacity-90">{tutorName}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-neutral-600 mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-warning-500 fill-current" />
              <span>{course.avg_rating?.toFixed(1) || '4.5'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.total_enrollments || 0}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {formatPrice(course.price)}
          </div>
        </div>
        
        <Button className="w-full">
          Enroll Now
        </Button>
      </CardContent>
    </Card>
  )
}
