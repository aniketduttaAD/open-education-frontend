"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuizPreview } from "@/components/course/QuizPreview";
import { FlashcardPreview } from "@/components/course/FlashcardPreview";
import { VideoAccordion } from "@/components/course/VideoAccordion";
import { coursesApi, Course } from "@/lib/api/courses";
import { useUserStore } from "@/store/userStore";
import {
  Star,
  BookOpen,
  Play,
  ArrowRight,
  User as UserIcon,
  Target,
  Zap,
  IndianRupee,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { user } = useUserStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const courseData = await coursesApi.getCourse(courseId);

      // Transform the API response to match our Course interface
      const transformedCourse: Course = {
        ...courseData,
        price: courseData.price_inr || 0,
        tutor_id: courseData.tutor?.id || courseData.tutor_user_id || "",
        avg_rating: null,
        total_enrollments: 0,
        estimated_duration: null,
        is_featured: false,
        status: "published",
        total_ratings: 0,
        completion_rate: null,
        total_revisions_requested: 0,
        max_revisions_allowed: 0,
        thumbnail_url: null,
        published_at: courseData.created_at,
        description: courseData.description || "No description available",
        summary: {
          totalSections: courseData.sections?.length || 0,
          totalSubtopics:
            courseData.sections?.reduce(
              (sum, section) => sum + (section.subtopics?.length || 0),
              0
            ) || 0,
          totalVideos:
            courseData.sections?.reduce(
              (sum, section) => sum + (section.subtopics?.length || 0),
              0
            ) || 0,
          totalQuizzes:
            courseData.sections?.reduce(
              (sum, section) => sum + (section.quizzes?.length || 0),
              0
            ) || 0,
          totalFlashcards:
            courseData.sections?.reduce(
              (sum, section) => sum + (section.flashcards?.length || 0),
              0
            ) || 0,
        },
      };

      setCourse(transformedCourse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch course data"
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    document.title = course
      ? `${course.title} - OpenEducation`
      : "Course - OpenEducation";
  }, [course]);

  const handleEditCourse = () => {
    router.push(`/tutor/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await coursesApi.deleteCourse(courseId);
      router.push("/tutor/courses");
    } catch (err) {
      alert(
        "Failed to delete course: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The course you are looking for does not exist."}
          </p>
          <Button onClick={() => router.push("/courses")}>
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === course.tutor_user_id;
  const isTutor = user?.user_type === "tutor" && course?.tutor_id === user?.id;
  const isStudent = user?.user_type === "student";
  const totalSections = course.sections?.length || 0;
  const totalVideos =
    course.sections?.reduce(
      (sum, section) => sum + (section.subtopics?.length || 0),
      0
    ) || 0;
  const totalQuizzes =
    course.sections?.reduce(
      (sum, section) => sum + (section.quizzes?.length || 0),
      0
    ) || 0;
  const totalFlashcards =
    course.sections?.reduce(
      (sum, section) => sum + (section.flashcards?.length || 0),
      0
    ) || 0;

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
                  <p className="text-lg opacity-90 max-w-2xl">
                    {course.description || "No description available"}
                  </p>
                </div>
                {isOwner && (
                  <div className="absolute top-6 right-6 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditCourse}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDeleteCourse}
                      className="bg-red-500/90 hover:bg-red-600 text-white border-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
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
              <CardHeader>
                <h2 className="text-xl font-semibold">Course Overview</h2>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid gap-4 ${
                    isStudent ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {totalSections}
                    </div>
                    <div className="text-sm text-neutral-600">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalVideos}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Video Lessons
                    </div>
                  </div>
                  {!isStudent && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {totalQuizzes}
                        </div>
                        <div className="text-sm text-neutral-600">Quizzes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {totalFlashcards}
                        </div>
                        <div className="text-sm text-neutral-600">
                          Flashcards
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            {course.sections && course.sections.length > 0 ? (
              <div className="space-y-6">
                {/* Video Lessons Accordion */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Video Lessons ({totalVideos})
                    </h2>
                    <p className="text-gray-600">
                      Click on any section to expand and view video lessons
                    </p>
                  </CardHeader>
                  <CardContent>
                    <VideoAccordion sections={course.sections} />
                  </CardContent>
                </Card>

                {/* Quizzes Section - Only show for tutors */}
                {!isStudent &&
                  course.sections.some(
                    (section) => section.quizzes && section.quizzes.length > 0
                  ) && (
                    <Card>
                      <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Quizzes ({totalQuizzes})
                        </h2>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {course.sections.map(
                          (section) =>
                            section.quizzes &&
                            section.quizzes.length > 0 && (
                              <div key={section.id}>
                                <h3 className="font-medium mb-3 text-gray-800">
                                  {section.title} Quizzes
                                </h3>
                                <div className="space-y-3">
                                  {section.quizzes.map((quiz) => (
                                    <QuizPreview key={quiz.id} quiz={quiz} />
                                  ))}
                                </div>
                              </div>
                            )
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Flashcards Section - Only show for tutors */}
                {!isStudent &&
                  course.sections.some(
                    (section) =>
                      section.flashcards && section.flashcards.length > 0
                  ) && (
                    <Card>
                      <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center">
                          <Zap className="w-5 h-5 mr-2" />
                          Flashcards ({totalFlashcards})
                        </h2>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {course.sections.map(
                          (section) =>
                            section.flashcards &&
                            section.flashcards.length > 0 && (
                              <div key={section.id}>
                                <h3 className="font-medium mb-3 text-gray-800">
                                  {section.title} Flashcards
                                </h3>
                                <FlashcardPreview
                                  flashcards={section.flashcards.map((f) => ({
                                    id: f.id,
                                    front: f.front,
                                    back: f.back,
                                    course_id: f.course_id ?? "",
                                    section_id: f.section_id ?? "",
                                    index: f.index ?? 0,
                                  }))}
                                />
                              </div>
                            )
                        )}
                      </CardContent>
                    </Card>
                  )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">
                    No course content available yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Course Details</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price</span>
                  <div className="flex items-center font-semibold">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {course.price_inr ? course.price_inr : "Free"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-sm">
                    {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Updated</span>
                  <span className="text-sm">
                    {new Date(course.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tutor Info */}
            {course.tutor && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Instructor</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {course.tutor.image ? (
                        <Image
                          src={course.tutor.image as string}
                          alt={course.tutor.name}
                          className="w-12 h-12 rounded-full object-cover"
                          width={48}
                          height={48}
                          unoptimized
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-lg">
                          {course.tutor.name}
                        </p>
                        {course.tutor.verification_status === "verified" && (
                          <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">
                              ✓
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.tutor.email}
                      </p>

                      {isStudent && course.tutor.bio && (
                        <p className="text-sm text-gray-700 mb-3">
                          {course.tutor.bio}
                        </p>
                      )}

                      {isStudent &&
                        course.tutor.expertise_areas &&
                        course.tutor.expertise_areas.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Expertise Areas:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {course.tutor.expertise_areas.map(
                                (area, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {area}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {isStudent && course.tutor.teaching_experience && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Experience:</span>{" "}
                          {course.tutor.teaching_experience}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                {isOwner ? (
                  // Course Owner Actions
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => router.push("/tutor/courses")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage Courses
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/tutor/dashboard")}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        router.push(`/tutor/courses/${courseId}/edit`)
                      }
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Course
                    </Button>
                  </div>
                ) : isTutor ? (
                  // Other Tutor Actions
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => router.push("/tutor/courses")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View My Courses
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/tutor/dashboard")}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/courses")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse All Courses
                    </Button>
                  </div>
                ) : isStudent ? (
                  // Student Actions
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      {course.price_inr
                        ? `Enroll for ₹${course.price_inr}`
                        : "Enroll for Free"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Star className="w-4 h-4 mr-2" />
                      Add to Wishlist
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/courses")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse More Courses
                    </Button>
                  </div>
                ) : (
                  // Guest/Not Logged In Actions
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => router.push("/login")}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Login to Enroll
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/courses")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse All Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
