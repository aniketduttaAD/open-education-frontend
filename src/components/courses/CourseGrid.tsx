import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CourseCard } from './CourseCard'
import { CourseFilters } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Course } from '@/lib/types'

interface CourseGridProps {
  courses: Course[]
  filters?: CourseFilters
  onFiltersChange?: (filters: CourseFilters) => void
  loading?: boolean
}

export function CourseGrid({ courses, filters, onFiltersChange, loading = false }: CourseGridProps) {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<CourseFilters>(filters || {})

  // Apply filters and search
  const applyFilters = useCallback((newFilters: CourseFilters, query: string) => {
    let filtered = courses

    // Apply search query
    if (query.trim()) {
      const searchLower = query.toLowerCase()
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply price range filter
    if (newFilters.priceRange) {
      filtered = filtered.filter(c => 
        c.price >= newFilters.priceRange!.min && 
        c.price <= newFilters.priceRange!.max
      )
    }

    // Apply rating filter
    if (newFilters.rating) {
      filtered = filtered.filter(c => 
        (c.avg_rating || 0) >= newFilters.rating!
      )
    }

    // Apply duration filter
    if (newFilters.duration) {
      filtered = filtered.filter(c => {
        const duration = c.estimated_duration || 0
        switch (newFilters.duration) {
          case 'short': return duration <= 60 // 1 hour
          case 'medium': return duration > 60 && duration <= 300 // 1-5 hours
          case 'long': return duration > 300 // 5+ hours
          default: return true
        }
      })
    }

    setFilteredCourses(filtered)
  }, [courses])

  // Update filters when props change
  useEffect(() => {
    applyFilters(localFilters, searchQuery)
  }, [localFilters, searchQuery, applyFilters])

  // Update local filters when props change
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters)
    }
  }, [filters])

  const handleFilterChange = (key: keyof CourseFilters, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: CourseFilters = {}
    setLocalFilters(clearedFilters)
    setSearchQuery('')
    onFiltersChange?.(clearedFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(v => v !== undefined) || searchQuery.trim()

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={localFilters.priceRange ? `${localFilters.priceRange.min}-${localFilters.priceRange.max}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [min, max] = e.target.value.split('-').map(Number)
                        handleFilterChange('priceRange', { min, max })
                      } else {
                        handleFilterChange('priceRange', undefined)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Prices</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000-5000">₹2000+</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={localFilters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={localFilters.duration || ''}
                    onChange={(e) => handleFilterChange('duration', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Duration</option>
                    <option value="short">Short (1 hour or less)</option>
                    <option value="medium">Medium (1-5 hours)</option>
                    <option value="long">Long (5 hours or more)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

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
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
