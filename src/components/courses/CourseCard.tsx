
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { Course } from '@/lib/types'
import { Star, Users, Play, Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary-600 opacity-50" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold line-clamp-2">{course.title}</h3>
            <p className="text-sm opacity-90">By Tutor</p>
          </div>
          {course.is_featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6">
        <p className="text-neutral-600 mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>
        
        <div className="space-y-3 mb-4">
          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-warning-500 fill-current" />
                <span>{course.avg_rating?.toFixed(1) || '4.5'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.total_enrollments || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.estimated_duration)}</span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          {course.completion_rate && (
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-success-500" />
              <span className="text-sm text-success-600">
                {course.completion_rate}% completion rate
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary-600">
            {formatPrice(course.price)}
          </div>
          <div className="text-sm text-neutral-500">
            {course.status === 'published' ? 'Available' : 'Coming Soon'}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/courses/${course.id}`} className="flex-1">
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </Link>
          {course.status === 'published' && (
            <Button className="flex-1">
              Enroll Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
