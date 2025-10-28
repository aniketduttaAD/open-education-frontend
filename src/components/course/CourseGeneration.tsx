import React, { useState, useEffect, useCallback } from "react";
import { CourseGenerationComponentProps } from "@/lib/types/courseGeneration";
import { useCourseGeneration } from "@/hooks/useCourseGeneration";
import { CourseContent } from "./CourseContent";
import { ProgressDisplay } from "./ProgressDisplay";

export const CourseGeneration: React.FC<CourseGenerationComponentProps> = ({
  courseId,
  roadmapId,
  onComplete,
  onError,
  className = "",
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  // Get auth token
  useEffect(() => {
    // Align with API token storage key used by axios interceptor
    const access = localStorage.getItem("access_token");
    if (access) {
      setToken(access);
    }
  }, []);

  // Course generation hook
  const {
    state,
    startGeneration,
    stopGeneration,
    resetGeneration,
  } = useCourseGeneration({
    courseId,
    roadmapId,
    token,
    autoStart: false,
    onComplete: (completedCourseId) => {
      setHasStarted(false);
      if (onComplete) {
        onComplete(completedCourseId);
      }
    },
    onError: (error) => {
      console.error("Course generation error:", error);
      if (onError) {
        onError(error);
      }
    },
  });

  // Handle generation start
  const handleStartGeneration = useCallback(async () => {
    try {
      await startGeneration();
      setHasStarted(true);
    } catch (error) {
      console.error("Failed to start generation:", error);
    }
  }, [startGeneration]);

  // Handle generation stop
  const handleStopGeneration = useCallback(() => {
    stopGeneration();
    setHasStarted(false);
  }, [stopGeneration]);

  // Handle generation reset
  const handleResetGeneration = useCallback(() => {
    resetGeneration();
    setHasStarted(false);
    setSelectedSubtopic(null);
  }, [resetGeneration]);

  // Handle video selection
  const handleVideoSelect = useCallback(
    (sectionId: string, subtopicId: string) => {
      setSelectedSubtopic(subtopicId);
    },
    []
  );

  // Show different UI based on generation state
  if (!hasStarted && !state.isGenerating) {
    return (
      <div
        className={`max-w-4xl mx-auto p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl ${className}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Course Generation</h1>
            <p className="text-xl opacity-90">
              Generate comprehensive course content with AI-powered video
              creation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                What will be generated?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  📝 Detailed course content and transcripts
                </li>
                <li className="flex items-center gap-2">
                  🎵 High-quality audio narration
                </li>
                <li className="flex items-center gap-2">
                  🎨 Visual slides and presentations
                </li>
                <li className="flex items-center gap-2">
                  🎥 Professional video compilation
                </li>
                <li className="flex items-center gap-2">
                  📊 Interactive assessments and quizzes
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Generation Process</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  ⏱️ Estimated time: 8+ minutes per topic
                </li>
                <li className="flex items-center gap-2">
                  🔄 Real-time progress tracking
                </li>
                <li className="flex items-center gap-2">
                  ☁️ Secure cloud storage
                </li>
                <li className="flex items-center gap-2">
                  📱 Mobile-friendly videos
                </li>
              </ul>
            </div>
          </div>

          {/* removed real-time connection status */}

          <div className="text-center">
            <button
              onClick={handleStartGeneration}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 bg-green-500 hover:bg-green-600 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 text-white"
            >
              Start Course Generation
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.isGenerating || hasStarted) {
    return (
      <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Generating Course Content
            </h1>
            <button
              onClick={handleStopGeneration}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Stop Generation
            </button>
          </div>

          <ProgressDisplay
            progress={state.progress}
            currentTask={state.currentTask}
            estimatedTimeRemaining={state.estimatedTimeRemaining}
            phase={state.phase}
            isGenerating={state.isGenerating}
            className="mb-6"
          />

          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Generation Error
                </h3>
                <p className="text-red-600 mb-4">{state.error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleResetGeneration}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleStopGeneration}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {!state.error && state.progress > 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Session ID
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {state.sessionId || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Total Sections
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {state.totalSections}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Total Topics
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {state.totalSubtopics}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!state.isGenerating && !state.error && state.progress === 100) {
    return (
      <div
        className={`bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 ${className}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold mb-4">
              Course Generation Complete!
            </h1>
            <p className="text-xl opacity-90">
              Your course content has been successfully generated and is ready
              for viewing.
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleResetGeneration}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Generate Another Course
            </button>
          </div>

          <CourseContent
            courseId={courseId}
            onVideoSelect={handleVideoSelect}
            selectedSubtopic={selectedSubtopic || undefined}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-xl p-8 ${className}`}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-red-600 mb-6">
          Please try again or contact support if the issue persists.
        </p>
        <button
          onClick={handleResetGeneration}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
