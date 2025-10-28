"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VideoAccordion } from "@/components/course/VideoAccordion";
import { QuizPreview } from "@/components/course/QuizPreview";
import { FlashcardPreview } from "@/components/course/FlashcardPreview";
import { roadmapApi } from "@/lib/api/roadmap";
import type { PublishCourseResponse } from "@/lib/types/roadmap";
import { Play } from "lucide-react";

interface CourseGenerationFlowProps {
  roadmapId: string;
}

interface CourseGenerationData {
  courseId: string;
  sections: Array<{
    id: string;
    title: string;
    subtopics: Array<{ id: string; title: string; video_url: string | null }>;
  }>;
  videos: Array<{ id: string; title: string; url: string }>;
  quizzes: Array<{
    id: string;
    title: string;
    course_id: string;
    section_id: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct_index: number;
      index: number;
    }>;
  }>;
  flashcards: Array<{
    id: string;
    front: string;
    back: string;
    course_id: string;
    section_id: string;
    index: number;
  }>;
  courseDetails: { title: string };
  generationSummary: {
    totalSections: number;
    totalSubtopics: number;
    totalVideos: number;
    totalQuizzes: number;
    totalFlashcards: number;
  };
}

export const CourseGenerationFlow: React.FC<CourseGenerationFlowProps> = ({
  roadmapId,
}) => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generationData, setGenerationData] =
    useState<CourseGenerationData | null>(null);
  const [publishData, setPublishData] = useState<PublishCourseResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Course details form state
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseDescription, setCourseDescription] = useState("");

  // Step 1: Finalize Roadmap
  const handleFinalize = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      const response = await roadmapApi.finalize({ id: roadmapId });

      if (response.success) {
        const payload = response.data.result.finalPayload;
        setGenerationData({
          courseId: response.data.result.courseId,
          sections: payload.sections.map((s) => ({
            id: s.id,
            title: s.title,
            subtopics: s.subtopics.map((st) => ({
              id: st.id,
              title: st.title,
              video_url: st.video_url,
            })),
          })),
          videos: payload.videos.map((v) => ({
            id: v.id,
            title: v.title,
            url: v.url,
          })),
          quizzes: payload.quizzes.map((q) => ({
            id: q.id,
            title: q.title,
            course_id: q.course_id,
            section_id: q.section_id,
            questions: q.questions.map((qq) => ({
              id: qq.id,
              question: qq.question,
              options: qq.options,
              correct_index: qq.correct_index,
              index: qq.index,
            })),
          })),
          flashcards: payload.flashcards.map((f) => ({
            id: f.id,
            front: f.front,
            back: f.back,
            course_id: f.course_id,
            section_id: f.section_id,
            index: f.index,
          })),
          courseDetails: { title: payload.courseDetails.title },
          generationSummary: {
            totalSections: payload.generationSummary.totalSections,
            totalSubtopics: payload.generationSummary.totalSubtopics,
            totalVideos: payload.generationSummary.totalVideos,
            totalQuizzes: payload.generationSummary.totalQuizzes,
            totalFlashcards: payload.generationSummary.totalFlashcards,
          },
        });
        setProgress(100);

        // Pre-fill course title from generation data
        setCourseTitle(
          response.data.result.finalPayload.courseDetails.title || ""
        );
      } else {
        throw new Error(response.message || "Generation failed");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate course";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 2: Publish Course
  const handlePublish = async () => {
    if (!generationData) return;

    setIsPublishing(true);
    setError(null);

    try {
      const response = await roadmapApi.publish(roadmapId, {
        title: courseTitle,
        price_inr: coursePrice,
        description: courseDescription,
      });

      if (response.success) {
        setPublishData(response);

        // Redirect to course page
        router.push(`/courses/${response.data.course.id}`);
      } else {
        throw new Error(response.message || "Publishing failed");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to publish course";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Course Generation</h1>

      {/* Step 1: Generate Content */}
      {!generationData && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Step 1: Generate Course Content
            </h2>
            <p className="text-gray-600">
              This will generate videos, quizzes, flashcards, and embeddings for
              your course.
            </p>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">Generating content...</p>
              </div>
            )}

            <Button
              onClick={handleFinalize}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? "Generating..." : "Generate Course Content"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review Generated Content */}
      {generationData && !publishData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Step 2: Review Generated Content
              </h2>
            </CardHeader>
            <CardContent>
              {/* Generation Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {generationData.generationSummary.totalSections}
                  </div>
                  <p className="text-sm text-gray-600">Sections</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {generationData.generationSummary.totalSubtopics}
                  </div>
                  <p className="text-sm text-gray-600">Subtopics</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {generationData.generationSummary.totalVideos}
                  </div>
                  <p className="text-sm text-gray-600">Videos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {generationData.generationSummary.totalQuizzes}
                  </div>
                  <p className="text-sm text-gray-600">Quiz Questions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {generationData.generationSummary.totalFlashcards}
                  </div>
                  <p className="text-sm text-gray-600">Flashcards</p>
                </div>
              </div>

              {/* Course Details Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter price in INR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter course description"
                  />
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Preview</h3>

                {/* Video Lessons Accordion (same as course details) */}
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Video Lessons ({generationData.generationSummary.totalVideos})
                    </h2>
                    <p className="text-gray-600">
                      Click on any section to expand and view video lessons
                    </p>
                  </CardHeader>
                  <CardContent>
                    <VideoAccordion
                      sections={generationData.sections.map((s) => ({
                        ...s,
                        description: undefined,
                        subtopics: s.subtopics.map((st) => ({
                          id: st.id,
                          title: st.title,
                          video_url: st.video_url,
                          status: st.video_url ? "completed" : "in_progress",
                        })),
                      }))}
                    />
                  </CardContent>
                </Card>

                {/* Quiz Previews */}
                {generationData.quizzes.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Quiz Previews</h4>
                    {generationData.quizzes.slice(0, 2).map((quiz) => (
                      <QuizPreview key={quiz.id} quiz={quiz} />
                    ))}
                  </div>
                )}

                {/* Flashcard Previews */}
                {generationData.flashcards.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">
                      Flashcard Previews
                    </h4>
                    <FlashcardPreview
                      flashcards={generationData.flashcards.slice(0, 4)}
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handlePublish}
                disabled={isPublishing || !courseTitle}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
              >
                {isPublishing ? "Publishing..." : "Publish Course"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Success */}
      {publishData && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold mb-2">
              Course Published Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your course &quot;{publishData.data.course.title}&quot; is now live and
              ready for students.
            </p>

            <div className="space-y-2 mb-6 text-left max-w-md mx-auto">
              <p>
                <strong>Course ID:</strong> {publishData.data.course.id}
              </p>
              <p>
                <strong>Price:</strong> ₹
                {publishData.data.course.price_inr || "Free"}
              </p>
              <p>
                <strong>Sections:</strong> {publishData.data.sections.length}
              </p>
              <p>
                <strong>Videos:</strong> {publishData.data.videos.length}
              </p>
              <p>
                <strong>Quizzes:</strong> {publishData.data.quizzes.length}
              </p>
              <p>
                <strong>Flashcards:</strong>{" "}
                {publishData.data.flashcards.length}
              </p>
            </div>

            <div className="space-x-4">
              <Button
                onClick={() =>
                  router.push(`/courses/${publishData.data.course.id}`)
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Course
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="text-red-700">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
