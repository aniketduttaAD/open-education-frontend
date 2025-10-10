import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  CourseGenerationState,
  CourseContent,
  WebSocketEvent,
  WebSocketService,
} from "@/lib/types/courseGeneration";
import {
  createWebSocketService,
  defaultWebSocketConfig,
} from "@/lib/services/websocket.service";

interface CourseGenerationStore {
  // State
  generationState: CourseGenerationState;
  courseContent: CourseContent | null;
  isConnected: boolean;
  error: string | null;

  // Actions
  startGeneration: (
    courseId: string,
    roadmapId: string,
    token: string
  ) => Promise<void>;
  stopGeneration: () => void;
  resetGeneration: () => void;
  updateProgress: (event: WebSocketEvent) => void;
  setCourseContent: (content: CourseContent) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  connectWebSocket: (token: string) => Promise<void>;
  disconnectWebSocket: () => void;
}

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

export const useCourseGenerationStore = create<CourseGenerationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      generationState: initialState,
      courseContent: null,
      isConnected: false,
      error: null,

      // Start generation
      startGeneration: async (
        courseId: string,
        roadmapId: string,
        token: string
      ) => {
        set({
          generationState: {
            ...initialState,
            isGenerating: true,
            courseId,
            roadmapId,
            currentTask: "Starting generation...",
            phase: "starting",
          },
          error: null,
        });

        try {
          // Connect to WebSocket if not connected
          if (!get().isConnected) {
            await get().connectWebSocket(token);
          }

          // Start listening for course-specific events
          const wsService = (
            window as unknown as { __wsService?: WebSocketService }
          ).__wsService;
          if (wsService) {
            wsService.onCourseProgress(courseId, (event: WebSocketEvent) => {
              get().updateProgress(event);
            });
          }

          console.log("Course generation started for:", {
            courseId,
            roadmapId,
          });
        } catch (error: unknown) {
          console.error("Failed to start generation:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to start generation";
          set({
            error: errorMessage,
            generationState: {
              ...get().generationState,
              isGenerating: false,
              error: errorMessage,
            },
          });
        }
      },

      // Stop generation
      stopGeneration: () => {
        set({
          generationState: {
            ...get().generationState,
            isGenerating: false,
            currentTask: "Generation stopped",
            phase: "stopped",
          },
        });
      },

      // Reset generation
      resetGeneration: () => {
        set({
          generationState: initialState,
          courseContent: null,
          error: null,
        });
      },

      // Update progress from WebSocket events
      updateProgress: (event: WebSocketEvent) => {
        const currentState = get().generationState;

        switch (event.type) {
          case "content_generation_progress":
            set({
              generationState: {
                ...currentState,
                progress: event.progressPercentage,
                currentTask: event.currentTask,
                estimatedTimeRemaining: event.estimatedTimeRemaining,
                error: null,
              },
            });
            break;

          case "job_started":
            set({
              generationState: {
                ...currentState,
                isGenerating: true,
                phase: "started",
                currentTask: "Generation started",
              },
            });
            break;

          case "markdown_done":
            set({
              generationState: {
                ...currentState,
                phase: "markdown",
                currentTask: "Markdown generation completed",
              },
            });
            break;

          case "transcript_done":
            set({
              generationState: {
                ...currentState,
                phase: "transcript",
                currentTask: "Transcript generation completed",
              },
            });
            break;

          case "slides_done":
            set({
              generationState: {
                ...currentState,
                phase: "slides",
                currentTask: "Slides generation completed",
              },
            });
            break;

          case "audio_done":
            set({
              generationState: {
                ...currentState,
                phase: "audio",
                currentTask: "Audio generation completed",
              },
            });
            break;

          case "video_done":
            set({
              generationState: {
                ...currentState,
                phase: "video",
                currentTask: "Video compilation completed",
              },
            });
            break;

          case "upload_done":
            set({
              generationState: {
                ...currentState,
                phase: "upload",
                currentTask: "Upload completed",
              },
            });
            break;

          case "job_completed":
            set({
              generationState: {
                ...currentState,
                isGenerating: false,
                progress: 100,
                phase: "completed",
                currentTask: "Generation completed successfully!",
              },
            });
            break;

          case "job_failed":
            set({
              generationState: {
                ...currentState,
                isGenerating: false,
                phase: "failed",
                error: event.error || "Generation failed",
              },
              error: event.error || "Generation failed",
            });
            break;

          case "finalize_started":
            set({
              generationState: {
                ...currentState,
                currentTask: "Finalizing course...",
              },
            });
            break;

          case "finalize_done":
            set({
              generationState: {
                ...currentState,
                isGenerating: false,
                progress: 100,
                phase: "completed",
                currentTask: "Course generation completed!",
              },
            });
            break;
        }
      },

      // Set course content
      setCourseContent: (content: CourseContent) => {
        set({ courseContent: content });
      },

      // Set error
      setError: (error: string | null) => {
        set({ error });
      },

      // Set connection status
      setConnected: (connected: boolean) => {
        set({ isConnected: connected });
      },

      // Connect WebSocket
      connectWebSocket: async (token: string) => {
        try {
          const config = {
            ...defaultWebSocketConfig,
            token,
          };

          const wsService = createWebSocketService(config);
          await wsService.connect();

          // Store service globally for access
          (
            window as unknown as { __wsService?: WebSocketService }
          ).__wsService = wsService;

          set({ isConnected: true, error: null });

          console.log("WebSocket connected successfully");
        } catch (error: unknown) {
          console.error("WebSocket connection failed:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to connect to real-time updates";
          set({
            isConnected: false,
            error: errorMessage,
          });
        }
      },

      // Disconnect WebSocket
      disconnectWebSocket: () => {
        const wsService = (
          window as unknown as { __wsService?: WebSocketService }
        ).__wsService;
        if (wsService) {
          wsService.disconnect();
          (
            window as unknown as { __wsService?: WebSocketService }
          ).__wsService = undefined;
        }
        set({ isConnected: false });
      },
    }),
    {
      name: "course-generation-store",
    }
  )
);
