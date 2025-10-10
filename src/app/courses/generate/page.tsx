"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseGeneration } from "@/components/course/CourseGeneration";
import { useRoadmapStore } from "@/store/roadmapStore";
import { useUserStore } from "@/store/userStore";

export default function CourseGenerationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const { currentRoadmap, error: roadmapError } = useRoadmapStore();

  const [courseId, setCourseId] = useState<string | null>(null);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get roadmap ID from URL params or store
  useEffect(() => {
    const urlRoadmapId = searchParams.get("roadmapId");
    const urlCourseId = searchParams.get("courseId");

    if (urlRoadmapId) {
      setRoadmapId(urlRoadmapId);
    } else if (currentRoadmap?.id) {
      setRoadmapId(currentRoadmap.id);
    }

    if (urlCourseId) {
      setCourseId(urlCourseId);
    }

    setIsLoading(false);
  }, [searchParams, currentRoadmap]);

  // Redirect if no roadmap available
  useEffect(() => {
    if (!isLoading && !roadmapId && !currentRoadmap) {
      router.push("/tutor/courses/create");
    }
  }, [isLoading, roadmapId, currentRoadmap, router]);

  // Handle generation completion
  const handleGenerationComplete = (completedCourseId: string) => {
    console.log("Course generation completed:", completedCourseId);
    setCourseId(completedCourseId);

    // Show success message
    // You can add a toast notification here

    // Optionally redirect to the course page
    // router.push(`/courses/${completedCourseId}`);
  };

  // Handle generation error
  const handleGenerationError = (error: string) => {
    console.error("Course generation error:", error);

    // You can add error handling here, like showing a toast
    // toast.error(`Generation failed: ${error}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course generation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no roadmap
  if (!roadmapId && !currentRoadmap) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            No Roadmap Available
          </h2>
          <p className="text-red-600 mb-6">
            Please create a roadmap first before generating course content.
          </p>
          <button
            onClick={() => router.push("/tutor/courses/create")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Show roadmap error
  if (roadmapError) {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Roadmap Error
          </h2>
          <p className="text-red-600 mb-6">{roadmapError}</p>
          <button
            onClick={() => router.push("/tutor/courses/create")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show unauthorized access
  if (!user || user.user_type !== "tutor") {
    return (
      <div className="max-w-4xl mx-auto p-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600 mb-6">
            Only tutors can generate course content.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Login as Tutor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <button
            onClick={() => router.back()}
            className="bg-none border-none text-blue-500 cursor-pointer text-sm p-2 rounded transition-colors hover:bg-gray-100 hover:text-blue-700"
          >
            ← Back
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Course Generation</span>
        </div>
      </div>

      <CourseGeneration
        courseId={courseId || ""}
        roadmapId={roadmapId || currentRoadmap?.id || ""}
        onComplete={handleGenerationComplete}
        onError={handleGenerationError}
        className=""
      />
    </div>
  );
}
