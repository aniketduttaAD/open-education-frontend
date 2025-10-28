"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  BookOpen,
  Plus,
  Trash2,
  Eye,
  IndianRupee,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  Filter,
  Search,
  Grid,
  List,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { coursesApi, TutorCourse } from "@/lib/api/courses";
import { motion } from "framer-motion";

export default function TutorCoursesPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 12;

  useEffect(() => {
    document.title = "Course Management - OpenEducation";
  }, []);

  useEffect(() => {
    if (user?.user_type === "tutor" && user.id) {
      fetchCourses();
    }
  }, [user, page]);

  const fetchCourses = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await coursesApi.getTutorCourses(user.id, page, limit);
      setCourses(response.courses);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    router.push("/tutor/courses/create");
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/tutor/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      await coursesApi.deleteCourse(courseId);
      await fetchCourses();
    } catch (err: any) {
      alert(err.message || "Failed to delete course");
    } finally {
      setDeletingCourseId(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);
  const totalSections =
    courses?.reduce((sum, course) => sum + (course.sections?.length || 0), 0) ||
    0;
  const paidCourses =
    courses?.filter((course) => course.price_inr && course.price_inr > 0)
      .length || 0;
  const freeCourses = total - paidCourses;

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading your courses...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-neutral-200/50 backdrop-blur-sm">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5" />

            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-200/30 to-primary-200/30 rounded-full blur-xl" />

            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-800 bg-clip-text text-transparent">
                        Course Management
                      </span>
                    </h1>
                    <p className="text-xl text-neutral-600 mb-6 leading-relaxed">
                      Create, manage, and track all your published courses with
                      powerful analytics and insights
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-wrap items-center gap-6 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                      <BookOpen className="w-4 h-4 text-primary-600" />
                      <span className="font-semibold text-primary-700">
                        {total} Total Courses
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary-50 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse delay-75" />
                      <Users className="w-4 h-4 text-secondary-600" />
                      <span className="font-semibold text-secondary-700">
                        {totalSections} Sections
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-success-50 px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse delay-150" />
                      <TrendingUp className="w-4 h-4 text-success-600" />
                      <span className="font-semibold text-success-700">
                        {paidCourses} Premium
                      </span>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => router.push("/tutor/dashboard")}
                    className="flex items-center gap-2 px-6 py-3 border-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleCreateCourse}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Create Course
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Total Courses Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-primary-100 text-sm font-medium mb-1">
                      Total Courses
                    </p>
                    <p className="text-4xl font-bold mb-2">{total}</p>
                    <p className="text-primary-200 text-xs">
                      All published courses
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Sections Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-neutral-500 via-neutral-600 to-neutral-700 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-neutral-100 text-sm font-medium mb-1">
                      Total Sections
                    </p>
                    <p className="text-4xl font-bold mb-2">{totalSections}</p>
                    <p className="text-neutral-200 text-xs">Learning modules</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paid Courses Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-secondary-100 text-sm font-medium mb-1">
                      Premium Courses
                    </p>
                    <p className="text-4xl font-bold mb-2">{paidCourses}</p>
                    <p className="text-secondary-200 text-xs">Paid content</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IndianRupee className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Free Courses Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-emerald-100 text-sm font-medium mb-1">
                      Free Courses
                    </p>
                    <p className="text-4xl font-bold mb-2">{freeCourses}</p>
                    <p className="text-emerald-200 text-xs">Open access</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                    <input
                      type="text"
                      placeholder="Search your courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-neutral-400"
                    />
                  </div>

                  {/* Filter Button */}
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-3 border-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-primary-600 hover:bg-white hover:text-primary-600"
                        : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-200"
                    }`}
                  >
                    <Grid
                      className={`w-4 h-4 ${
                        viewMode === "grid"
                          ? "text-primary-600"
                          : "text-neutral-600"
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-primary-600 hover:bg-white hover:text-primary-600"
                        : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-200"
                    }`}
                  >
                    <List
                      className={`w-4 h-4 ${
                        viewMode === "list"
                          ? "text-primary-600"
                          : "text-neutral-600"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4 text-red-700">
                <p>{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Courses Content */}
        {!courses || courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="text-center py-20 border-2 border-neutral-200/50 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent>
                <div className="relative mb-8">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-50 animate-pulse" />
                  </div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Start Your Teaching Journey
                  </span>
                </h3>
                <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Create your first course and share your knowledge with
                  students worldwide. Build engaging content with our AI-powered
                  tools and start earning from your expertise.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleCreateCourse}
                    size="lg"
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Create Your First Course
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 border-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300 font-semibold text-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    View Examples
                  </Button>
                </div>

                {/* Feature highlights */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      AI-Powered
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Generate content with AI assistance
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-3">
                      <BarChart3 className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Analytics
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Track student progress and engagement
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mb-3">
                      <IndianRupee className="w-6 h-6 text-success-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-900 mb-2">
                      Monetize
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Earn from your knowledge and skills
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Courses Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {viewMode === "grid" ? (
                    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-primary-200 shadow-lg bg-white overflow-hidden h-full relative">
                      {/* Course Header with Gradient */}
                      <div className="h-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600"></div>

                      {/* Course Status Badge - Only for Free Courses */}
                      {!course.price_inr && (
                        <div className="absolute -top-2 -right-2 z-20">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 text-sm font-semibold shadow-lg rounded-lg">
                            FREE
                          </div>
                        </div>
                      )}

                      <CardHeader className="pb-0 pt-8 border-b-0">
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <BookOpen className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {course.title}
                              </h3>
                              <div className="flex items-center text-sm text-neutral-500 mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(
                                  course.created_at
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-neutral-600">
                                <Target className="w-4 h-4 mr-2" />
                                {course.sections?.length || 0} sections
                              </div>
                            </div>
                          </div>

                          {course.price_inr && (
                            <div className="flex items-center justify-between">
                              <div className="text-right w-full">
                                <div className="text-2xl font-bold mb-1">
                                  <span className="bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                                    ₹{course.price_inr.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 pb-8">
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCourse(course.id)}
                            className="flex-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 py-3 font-semibold border-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Course
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={deletingCourseId === course.id}
                            className="text-error-600 hover:bg-error-50 hover:border-error-200 transition-all duration-300 px-4 py-3 border-2"
                          >
                            {deletingCourseId === course.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-primary-200 shadow-lg bg-white relative">
                      <div className="h-3 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600"></div>
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 flex-1">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <BookOpen className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                  {course.title}
                                </h3>
                                {!course.price_inr && (
                                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 text-sm font-semibold shadow-lg rounded-lg">
                                    FREE
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-6 text-sm text-neutral-500">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(
                                    course.created_at
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  {course.sections?.length || 0} sections
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {course.price_inr && (
                              <div className="text-right">
                                <div className="text-xl font-bold">
                                  <span className="bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                                    ₹{course.price_inr.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCourse(course.id)}
                                className="hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 px-4 py-2 border-2"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                                disabled={deletingCourseId === course.id}
                                className="text-error-600 hover:bg-error-50 hover:border-error-200 transition-all duration-300 px-4 py-2 border-2"
                              >
                                {deletingCourseId === course.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center space-x-3 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 border-2 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                          page === pageNum
                            ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                            : "border-2 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-6 py-3 border-2 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
