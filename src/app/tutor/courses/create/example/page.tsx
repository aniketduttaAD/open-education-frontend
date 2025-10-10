"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseGeneration } from "@/components/course/CourseGeneration";
import { RoadmapDisplayWithFinalize } from "@/components/roadmap/RoadmapDisplayWithFinalize";
import { useUserStore } from "@/store/userStore";
import { useRoadmapStore } from "@/store/roadmapStore";
import { toast } from "react-hot-toast";

/**
 * Example page showing complete course generation workflow
 * This demonstrates how to integrate all components together
 */
export default function CourseGenerationExample() {
  const router = useRouter();
  const { user } = useUserStore();
  const { currentRoadmap, hasChanges, saveChangesToBackend } =
    useRoadmapStore();

  const [currentStep, setCurrentStep] = useState<
    "roadmap" | "generation" | "content"
  >("roadmap");
  const [generatedCourseId, setGeneratedCourseId] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated or not a tutor
  if (!user || user.user_type !== "tutor") {
    router.push("/login");
    return null;
  }

  // Handle roadmap finalize
  const handleRoadmapFinalize = async (courseId: string) => {
    try {
      toast.success("Roadmap finalized successfully!");
      setGeneratedCourseId(courseId);
      setCurrentStep("generation");
    } catch (error: unknown) {
      toast.error(
        `Failed to finalize roadmap: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Handle roadmap finalize error
  const handleRoadmapError = (error: string) => {
    toast.error(`Roadmap finalize failed: ${error}`);
  };

  // Handle course generation complete
  const handleGenerationComplete = (courseId: string) => {
    toast.success("Course generation completed successfully!");
    setCurrentStep("content");
  };

  // Handle course generation error
  const handleGenerationError = (error: string) => {
    toast.error(`Course generation failed: ${error}`);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      await saveChangesToBackend();
      toast.success("Changes saved successfully!");
    } catch (error: unknown) {
      toast.error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle back to roadmap
  const handleBackToRoadmap = () => {
    setCurrentStep("roadmap");
    setGeneratedCourseId(null);
  };

  // Handle back to generation
  const handleBackToGeneration = () => {
    setCurrentStep("generation");
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <button
              onClick={() => router.back()}
              className="bg-none border-none text-blue-500 cursor-pointer text-sm p-2 rounded transition-colors hover:bg-gray-100 hover:text-blue-700"
            >
              ← Back
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              Course Generation Example
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  currentStep === "roadmap"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <span className="font-medium text-sm">Roadmap</span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  currentStep === "generation"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <span className="font-medium text-sm">Generation</span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  currentStep === "content"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <span className="font-medium text-sm">Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[600px]">
        {currentStep === "roadmap" && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Step 1: Create and Finalize Roadmap
              </h1>
              <p className="text-gray-600">
                Design your course structure and finalize it to begin
                generation.
              </p>
            </div>

            {hasChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="text-yellow-800 font-semibold mb-1">
                      Unsaved Changes
                    </h4>
                    <p className="text-yellow-700 mb-4">
                      You have unsaved changes to your roadmap. Please save your
                      changes before finalizing.
                    </p>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!currentRoadmap ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8 bg-gray-50 rounded-xl max-w-md">
                  <div className="text-4xl mb-4 opacity-50">📝</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Roadmap Available
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please create a roadmap first before generating course
                    content.
                  </p>
                  <button
                    onClick={() => router.push("/tutor/courses/create")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    Create Roadmap
                  </button>
                </div>
              </div>
            ) : (
              <RoadmapDisplayWithFinalize
                className=""
                showFinalizeButton={!hasChanges}
                onFinalize={handleRoadmapFinalize}
                onError={handleRoadmapError}
              />
            )}
          </div>
        )}

        {currentStep === "generation" && generatedCourseId && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Step 2: Generate Course Content
              </h1>
              <p className="text-gray-600 mb-4">
                AI-powered generation of videos, audio, slides, and assessments.
              </p>
              <button
                onClick={handleBackToRoadmap}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ← Back to Roadmap
              </button>
            </div>

            <CourseGeneration
              courseId={generatedCourseId}
              roadmapId={currentRoadmap?.id || ""}
              onComplete={handleGenerationComplete}
              onError={handleGenerationError}
              className=""
            />
          </div>
        )}

        {currentStep === "content" && generatedCourseId && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Step 3: View Generated Content
              </h1>
              <p className="text-gray-600 mb-6">
                Browse and interact with your generated course content.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleBackToGeneration}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ← Back to Generation
                </button>
                <button
                  onClick={() => router.push(`/courses/${generatedCourseId}`)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
                >
                  View Full Course →
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Course Content Preview
                </h3>
                <p className="text-gray-600 mb-6">
                  Your course has been successfully generated with the following
                  content:
                </p>
                <ul className="space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-center gap-2 text-gray-700">
                    ✅ Video lessons with AI narration
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    ✅ Interactive slides and presentations
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    ✅ Audio transcripts and notes
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    ✅ Assessment quizzes and exercises
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    ✅ Progress tracking and analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
