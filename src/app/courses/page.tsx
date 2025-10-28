"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { coursesApi, Course, CourseFilters } from "@/lib/api/courses";
import {
  BookOpen,
  TrendingUp,
  Star,
  Users,
  Filter,
  Search,
  Grid,
  List,
  Play,
} from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 20,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (searchFilters?: CourseFilters) => {
    try {
      setLoading(true);
      const currentFilters = searchFilters || filters;
      const response = await coursesApi.getAllCourses(currentFilters);

      // Transform the API response to match frontend expectations
      const transformedCourses = response.data.courses.map((course) => {
        // Calculate real data from API response
        const totalSections = course.sections?.length || 0;
        const totalVideos = course.sections?.reduce((sum, section) => sum + (section.subtopics?.length || 0), 0) || 0;
        const totalQuizzes = course.sections?.reduce((sum, section) => sum + (section.quizzes?.length || 0), 0) || 0;
        const totalFlashcards = course.sections?.reduce((sum, section) => sum + (section.flashcards?.length || 0), 0) || 0;
        
        return {
          ...course,
          description: course.description || "No description available",
          price: course.price_inr || 0,
          // Use real data instead of mock data
          avg_rating: null, // Will be updated when API provides this data
          total_enrollments: 0, // Will be updated when API provides this data
          estimated_duration: totalVideos * 15, // Estimate 15 minutes per video
          is_featured: false, // Will be updated when API provides this data
          // Add missing fields for compatibility
          tutor_id: course.tutor?.id || '',
          status: "published" as const,
          total_ratings: 0, // Will be updated when API provides this data
          completion_rate: null, // Will be updated when API provides this data
          difficulty_level: "intermediate", // Default for now
          category: "general",
          tags: course.tutor?.expertise_areas || ["programming"],
          total_revisions_requested: 0,
          max_revisions_allowed: 3,
          thumbnail_url: null,
          published_at: course.created_at,
          // Add summary data
          summary: {
            totalSections,
            totalSubtopics: totalVideos,
            totalVideos,
            totalQuizzes,
            totalFlashcards
          }
        };
      });

      setCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
      setTotalCourses(response.data.total);
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: CourseFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // For now, we'll handle sorting on the frontend
    // In a real app, you might want to send sort parameters to the API
    applySorting(newSortBy);
  };

  const applySorting = (currentSortBy: string) => {
    let sorted = [...courses];

    switch (currentSortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        sorted.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        break;
      case "popular":
        sorted.sort(
          (a, b) => (b.total_enrollments || 0) - (a.total_enrollments || 0)
        );
        break;
      default:
        break;
    }

    setFilteredCourses(sorted);
  };

  const handleSearch = (searchTerm: string) => {
    const updatedFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchCourses(updatedFilters);
  };

  const getStats = () => {
    // Calculate real stats from the courses data
    const totalCoursesCount = totalCourses || courses.length;
    
    // Calculate total sections and videos from all courses
    const totalSections = courses.reduce((sum, course) => sum + (course.sections?.length || 0), 0);
    const totalVideos = courses.reduce((sum, course) => {
      return sum + (course.sections?.reduce((sectionSum, section) => 
        sectionSum + (section.subtopics?.length || 0), 0) || 0);
    }, 0);
    
    // Calculate featured courses (courses with content)
    const featuredCourses = courses.filter(course => 
      course.sections && course.sections.length > 0
    ).length;
    
    return {
      totalCourses: totalCoursesCount,
      totalStudents: 0, // Will be updated when API provides this data
      avgRating: 0, // Will be updated when API provides this data
      featuredCourses,
      totalSections,
      totalVideos
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Courses
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover AI-powered courses designed to accelerate your learning
              journey
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-lg font-semibold">
                      {stats.totalCourses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sections</p>
                    <p className="text-lg font-semibold">
                      {stats.totalSections}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Videos</p>
                    <p className="text-lg font-semibold">
                      {stats.totalVideos}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Featured</p>
                    <p className="text-lg font-semibold">
                      {stats.featuredCourses || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={filters.search || ""}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>

                {/* View and Sort Controls */}
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CourseGrid
            courses={filteredCourses}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        </motion.div>

        {/* Pagination */}
        {!loading && filteredCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2"
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(totalCourses / (filters.limit || 20))
                    ),
                  },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="px-3 py-2 min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage >= Math.ceil(totalCourses / (filters.limit || 20))
                }
                className="px-3 py-2"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Card>
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what
                  you&apos;re looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const clearedFilters = { page: 1, limit: 20 };
                    setFilters(clearedFilters);
                    setSortBy("newest");
                    fetchCourses(clearedFilters);
                  }}
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
