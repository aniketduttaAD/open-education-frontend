// Course Generation Types and Interfaces

// WebSocket Event Types
export interface WebSocketProgressEvent {
  type: "content_generation_progress";
  progressPercentage: number;
  currentTask: string;
  estimatedTimeRemaining: number;
  timestamp: string;
}

export interface WebSocketPhaseEvent {
  type:
    | "job_started"
    | "markdown_done"
    | "transcript_done"
    | "slides_done"
    | "audio_done"
    | "video_done"
    | "upload_done"
    | "job_completed"
    | "job_failed";
  data?: Record<string, unknown>;
  error?: string;
}

export interface WebSocketFinalizeEvent {
  type: "finalize_started" | "finalize_done";
  data?: Record<string, unknown>;
}

export type WebSocketEvent =
  | WebSocketProgressEvent
  | WebSocketPhaseEvent
  | WebSocketFinalizeEvent;

// Course Generation State
export interface CourseGenerationState {
  isGenerating: boolean;
  progress: number;
  currentTask: string;
  estimatedTimeRemaining: number;
  phase: string;
  error: string | null;
  sessionId: string | null;
  courseId: string | null;
  roadmapId: string | null;
  totalSections: number;
  totalSubtopics: number;
}

// Course Content Types
export interface CourseSection {
  id: string;
  title: string;
  index: number;
  subtopics: CourseSubtopic[];
  status: "pending" | "processing" | "completed" | "failed";
}

export interface CourseSubtopic {
  id: string;
  title: string;
  index: number;
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
  audio_url?: string;
  slides_url?: string;
  document_url?: string;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseContent {
  courseId: string;
  sections: CourseSection[];
  totalSections: number;
  totalSubtopics: number;
  completedSections: number;
  completedSubtopics: number;
  overallProgress: number;
}

// Presigned URL Types
export interface PresignedUrlRequest {
  courseId: string;
  sectionId?: string;
  subtopicId?: string;
  mediaType: "video" | "audio" | "slides" | "document";
  expiresIn?: number;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  expiresIn: number;
  mediaType: string;
  courseId: string;
  sectionId?: string;
  subtopicId?: string;
  expiresAt: string;
}

// Video Player Types
export interface VideoPlayerProps {
  courseId: string;
  sectionId: string;
  subtopicId: string;
  videoTitle: string;
  autoPlay?: boolean;
  controls?: boolean;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export interface VideoPlayerState {
  videoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

// Progress Tracking Types
export interface ProgressPhase {
  name: string;
  percentage: number;
  description: string;
  estimatedDuration: number;
}

export const GENERATION_PHASES: ProgressPhase[] = [
  {
    name: "markdown",
    percentage: 0,
    description: "Generating course content structure",
    estimatedDuration: 2,
  },
  {
    name: "transcript",
    percentage: 25,
    description: "Creating detailed transcripts",
    estimatedDuration: 3,
  },
  {
    name: "audio",
    percentage: 45,
    description: "Generating audio with text-to-speech",
    estimatedDuration: 2,
  },
  {
    name: "slides",
    percentage: 65,
    description: "Creating visual slides",
    estimatedDuration: 1,
  },
  {
    name: "video",
    percentage: 75,
    description: "Compiling final videos",
    estimatedDuration: 2,
  },
  {
    name: "upload",
    percentage: 85,
    description: "Uploading to storage",
    estimatedDuration: 1,
  },
  {
    name: "embeddings",
    percentage: 95,
    description: "Generating search embeddings",
    estimatedDuration: 1,
  },
];

// WebSocket Service Types
export interface WebSocketServiceConfig {
  url: string;
  token: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface WebSocketService {
  connect(): Promise<void>;
  disconnect(): void;
  onCourseProgress(
    courseId: string,
    callback: (data: WebSocketEvent) => void
  ): void;
  onEvent(
    event: string,
    callback: (data: Record<string, unknown>) => void
  ): void;
  emit(event: string, data?: Record<string, unknown>): void;
  isConnected(): boolean;
  joinCourse(courseId: string): void;
  joinSession(sessionId: string): void;
  subscribeProgress(params: { courseId?: string; sessionId?: string }): void;
}

// Course Generation Hook Types
export interface UseCourseGenerationOptions {
  courseId: string;
  roadmapId: string;
  token: string;
  autoStart?: boolean;
  onComplete?: (courseId: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number, task: string) => void;
}

export interface UseCourseGenerationReturn {
  state: CourseGenerationState;
  startGeneration: () => Promise<void>;
  stopGeneration: () => void;
  resetGeneration: () => void;
  isConnected: boolean;
}

// Component Props Types
export interface CourseGenerationComponentProps {
  courseId: string;
  roadmapId: string;
  onComplete?: (courseId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface CourseContentComponentProps {
  courseId: string;
  onVideoSelect?: (sectionId: string, subtopicId: string) => void;
  selectedSubtopic?: string;
}

export interface ProgressDisplayProps {
  progress: number;
  currentTask: string;
  estimatedTimeRemaining: number;
  phase: string;
  isGenerating: boolean;
  className?: string;
}

export interface VideoPlayerComponentProps extends VideoPlayerProps {
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

// API Response Types
export interface CourseGenerationResponse {
  id: string;
  roadmapId: string;
  progressId: string;
  sessionId: string;
  totalSections: number;
  totalSubtopics: number;
}

export interface CourseContentResponse {
  success: boolean;
  data: CourseContent;
  message: string;
}

// Error Types
export interface CourseGenerationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Utility Types
export type MediaType = "video" | "audio" | "slides" | "document";
export type GenerationStatus =
  | "idle"
  | "starting"
  | "generating"
  | "completed"
  | "failed";
export type PhaseStatus = "pending" | "processing" | "completed" | "failed";

// Event Handler Types
export type ProgressEventHandler = (event: WebSocketProgressEvent) => void;
export type PhaseEventHandler = (event: WebSocketPhaseEvent) => void;
export type FinalizeEventHandler = (event: WebSocketFinalizeEvent) => void;
export type ErrorEventHandler = (error: CourseGenerationError) => void;
