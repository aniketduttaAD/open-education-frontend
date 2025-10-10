import { useState, useEffect, useCallback, useRef } from "react";
import {
  createWebSocketService,
  defaultWebSocketConfig,
} from "@/lib/services/websocket.service";
import {
  UseCourseGenerationOptions,
  UseCourseGenerationReturn,
  CourseGenerationState,
  WebSocketEvent,
  WebSocketProgressEvent,
  WebSocketPhaseEvent,
  WebSocketFinalizeEvent,
  WebSocketService,
  // GENERATION_PHASES
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
  const wsServiceRef = useRef<WebSocketService | null>(null);
  const isGeneratingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        console.log('WS init token type/preview:', typeof options.token, options.token?.slice?.(0, 10));
        const config = {
          ...defaultWebSocketConfig,
          token: options.token,
        };

        wsServiceRef.current = createWebSocketService(config);
        await wsServiceRef.current.connect();

        console.log("WebSocket initialized for course generation");
      } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to connect to real-time updates",
        }));
      }
    };

    initializeWebSocket();

    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [options.token]);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (!wsServiceRef.current) return;

    const handleWebSocketEvent = (event: WebSocketEvent) => {
      console.log("WebSocket event received:", event);

      switch (event.type) {
        case "content_generation_progress":
          handleProgressEvent(event as WebSocketProgressEvent);
          break;
        case "job_started":
        case "markdown_done":
        case "transcript_done":
        case "slides_done":
        case "audio_done":
        case "video_done":
        case "upload_done":
        case "job_completed":
        case "job_failed":
          handlePhaseEvent(event as WebSocketPhaseEvent);
          break;
        case "finalize_started":
        case "finalize_done":
          handleFinalizeEvent(event as WebSocketFinalizeEvent);
          break;
      }
    };

    // If course-backed subscribe explicitly, else generic events will still flow
    if (options.courseId) {
      wsServiceRef.current.subscribeProgress({ courseId: options.courseId });
      wsServiceRef.current.onCourseProgress(
        options.courseId,
        handleWebSocketEvent
      );
    }

    // Listen for general events
    wsServiceRef.current.onEvent(
      "content_generation_progress",
      (data: Record<string, unknown>) => {
        handleWebSocketEvent(data as unknown as WebSocketEvent);
      }
    );
    wsServiceRef.current.onEvent(
      "job_started",
      (data: Record<string, unknown>) => {
        handleWebSocketEvent(data as unknown as WebSocketEvent);
      }
    );
    wsServiceRef.current.onEvent(
      "job_completed",
      (data: Record<string, unknown>) => {
        handleWebSocketEvent(data as unknown as WebSocketEvent);
      }
    );
    wsServiceRef.current.onEvent(
      "job_failed",
      (data: Record<string, unknown>) => {
        handleWebSocketEvent(data as unknown as WebSocketEvent);
      }
    );
  }, [options.courseId]);

  const handleProgressEvent = useCallback(
    (event: WebSocketProgressEvent) => {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        progress: event.progressPercentage,
        currentTask: event.currentTask,
        estimatedTimeRemaining: event.estimatedTimeRemaining,
        error: null,
      }));

      // Call progress callback if provided
      if (options.onProgress) {
        options.onProgress(event.progressPercentage, event.currentTask);
      }
    },
    [options.onProgress]
  );

  const handlePhaseEvent = useCallback(
    (event: WebSocketPhaseEvent) => {
      const phaseName = event.type.replace("_done", "").replace("job_", "");

      setState((prev) => ({
        ...prev,
        phase: phaseName,
        isGenerating:
          event.type !== "job_completed" && event.type !== "job_failed",
        error:
          event.type === "job_failed"
            ? event.error || "Generation failed"
            : null,
      }));

      if (event.type === "job_completed") {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          progress: 100,
          currentTask: "Generation completed!",
          phase: "completed",
        }));

        if (options.onComplete) {
          options.onComplete(options.courseId);
        }
      } else if (event.type === "job_failed") {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: event.error || "Generation failed",
        }));

        if (options.onError) {
          options.onError(event.error || "Generation failed");
        }
      }
    },
    [options.courseId, options.onComplete, options.onError]
  );

  const handleFinalizeEvent = useCallback((event: WebSocketFinalizeEvent) => {
    console.log("Finalize event:", event);

    if (event.type === "finalize_done") {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        currentTask: "Course generation completed!",
        phase: "completed",
      }));
    }
  }, []);

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

      // Call the finalize API endpoint
      const response = await roadmapApi.finalize({ id: options.roadmapId });

      setState((prev) => ({
        ...prev,
        sessionId: response.roadmapId,
        totalSections: response.totalSections,
        totalSubtopics: response.totalSubtopics,
        currentTask: "Generation started, waiting for progress updates...",
      }));

      console.log("Course generation started:", response);
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
    isConnected: wsServiceRef.current?.isConnected() || false,
  };
};
