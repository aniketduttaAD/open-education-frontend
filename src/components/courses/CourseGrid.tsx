import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CourseCard } from './CourseCard'
import { CourseFilters } from '@/lib/types'
import { Course } from '@/lib/api/courses'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface CourseGridProps {
  courses: Course[]
  filters?: CourseFilters
  onFiltersChange?: (filters: CourseFilters) => void
  loading?: boolean
}

export function CourseGrid({ courses, filters, onFiltersChange, loading = false }: CourseGridProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)

  // Update filtered courses when courses prop changes
  useEffect(() => {
    setFilteredCourses(courses)
  }, [courses])

  const hasActiveFilters = filters ? Object.values(filters).some(v => v !== undefined) : false

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
              <div className="p-6">
                <div className="h-5 bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-6" />
                <div className="flex gap-3 mb-4">
                  <div className="h-8 bg-gray-200 rounded-lg w-20" />
                  <div className="h-8 bg-gray-200 rounded-lg w-20" />
                  <div className="h-8 bg-gray-200 rounded-lg w-20" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                  <div className="h-10 bg-gray-200 rounded-lg flex-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </p>
        {hasActiveFilters && (
          <p className="text-sm text-gray-500">
            Filtered from {courses.length} total courses
          </p>
        )}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
