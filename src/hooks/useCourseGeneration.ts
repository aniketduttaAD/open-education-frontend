import { useState, useEffect, useCallback, useRef } from "react";
import {
  UseCourseGenerationOptions,
  UseCourseGenerationReturn,
  CourseGenerationState,
} from "@/lib/types/courseGeneration";
import { roadmapApi } from "@/lib/api/roadmap";

const initialState: CourseGenerationState = {
  isGenerating: false,
  progress: 0,
  currentTask: "",
  estimatedTimeRemaining: 0,
  phase: "",
  error: null,
  sessionId: null,
  courseId: null,
  roadmapId: null,
  totalSections: 0,
  totalSubtopics: 0,
};

export const useCourseGeneration = (
  options: UseCourseGenerationOptions
): UseCourseGenerationReturn => {
  const [state, setState] = useState<CourseGenerationState>(initialState);
  const isGeneratingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startGeneration = useCallback(async () => {
    if (isGeneratingRef.current) {
      console.warn("Generation already in progress");
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        progress: 0,
        currentTask: "Starting generation...",
        phase: "starting",
        error: null,
        roadmapId: options.roadmapId,
        courseId: options.courseId,
      }));

      isGeneratingRef.current = true;

      // Call the finalize API endpoint synchronously
      const response = await roadmapApi.finalize({ id: options.roadmapId });

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        currentTask: "Generation completed!",
        phase: "completed",
        sessionId: response.data.sessionId,
        totalSections: response.data.totalSections,
        totalSubtopics: response.data.totalSubtopics,
        courseId: response.data.id,
      }));

      if (options.onComplete) {
        options.onComplete(response.data.id);
      }
    } catch (error: unknown) {
      console.error("Failed to start course generation:", error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to start course generation";

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));

      if (options.onError) {
        options.onError(errorMessage);
      }
    } finally {
      isGeneratingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.roadmapId, options.courseId, options.onError]);

  const stopGeneration = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGenerating: false,
      currentTask: "Generation stopped",
      phase: "stopped",
    }));

    isGeneratingRef.current = false;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setState(initialState);
    isGeneratingRef.current = false;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Auto-start generation if enabled
  useEffect(() => {
    if (options.autoStart && !isGeneratingRef.current && !state.isGenerating) {
      startGeneration();
    }
  }, [options.autoStart, startGeneration, state.isGenerating]);

  return {
    state,
    startGeneration,
    stopGeneration,
    resetGeneration,
    isConnected: true, // Always connected for synchronous API calls
  };
};
