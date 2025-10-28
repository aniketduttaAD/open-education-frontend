export interface GenerateRoadmapDto {
  prompt: string;
  level?: string;
  durationWeeks?: number;
  weeklyCommitmentHours?: number;
  techStackPrefs?: {
    technologies?: string[];
    raw?: string;
    [key: string]: unknown;
  };
  constraints?: string[];
}

export type RoadmapEditOperation =
  | "rm-main"
  | "add-main"
  | "up-main"
  | "add-sub"
  | "rm-sub"
  | "up-sub";

export interface EditChange {
  op: RoadmapEditOperation;
  id?: string;
  query?: string;
}

export interface EditRoadmapDto {
  roadmapId: string;
  changes: EditChange[];
}

export interface FinalizeRoadmapDto {
  id: string; 
}

export interface RoadmapData {
  [key: string]: string[];
}

export interface HierarchicalRoadmapData {
  id: string;
  main_topics: MainTopic[];
}

export interface MainTopic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
}

export interface ApiSuccessBase {
  success: true;
  message: string;
  timestamp: string;
}

export interface GenerateRoadmapApiResponse extends ApiSuccessBase {
  data: {
    id: string;
    data: HierarchicalRoadmapData;
  };
}

export interface EditRoadmapApiResponse extends ApiSuccessBase {
  data: {
    id: string;
    data: HierarchicalRoadmapData;
    version: number;
  };
}

export interface FinalizeRoadmapResponse {
  success: boolean;
  data: {
    id: string;
    roadmapId: string | null;
    progressId: string | null;
    sessionId: string;
    totalSections: number;
    totalSubtopics: number;
    status: 'completed';
    result: {
      success: boolean;
      courseId: string;
      totalSections: number;
      finalPayload: {
        roadmap: Record<string, string[]>;
        sections: Array<{
          id: string;
          title: string;
          index: number;
          subtopics: Array<{
            id: string;
            title: string;
            index: number;
            markdown_path: string | null;
            transcript_path: string | null;
            audio_path: string | null;
            video_url: string | null;
            status: string;
          }>;
        }>;
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
        videos: Array<{
          id: string;
          title: string;
          url: string;
          section: string;
          sectionIndex: number;
          subtopicIndex: number;
        }>;
        courseDetails: {
          id: string;
          title: string;
          tutor_user_id: string;
          price_inr: number | null;
          created_at: string;
        };
        generationSummary: {
          totalSections: number;
          totalSubtopics: number;
          totalVideos: number;
          totalQuizzes: number;
          totalFlashcards: number;
          sessionId: string;
          generatedAt: string;
        };
      };
    };
  };
  message: string;
  timestamp: string;
}

export interface PublishCourseDto {
  title: string;
  price_inr: number;
  description: string;
}

export interface PublishCourseResponse {
  success: boolean;
  data: {
    course: {
      id: string;
      title: string;
      tutor_user_id: string;
      price_inr: number | null;
      created_at: string;
      updated_at: string;
    };
    sections: Array<{
      id: string;
      course_id: string;
      index: number;
      title: string;
      created_at: string;
      updated_at: string;
    }>;
    subtopics: Array<{
      id: string;
      section_id: string;
      index: number;
      title: string;
      markdown_path: string | null;
      transcript_path: string | null;
      audio_path: string | null;
      video_url: string | null;
      status: string;
      created_at: string;
      updated_at: string;
    }>;
    videos: Array<{
      id: string;
      title: string;
      url: string;
      section: string;
      sectionIndex: number;
      subtopicIndex: number;
    }>;
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
  };
  message: string;
  timestamp: string;
}

export interface FlatRoadmapResponse {
  id: string;
  data: RoadmapData;
}

export interface RoadmapState {
  currentRoadmap: FlatRoadmapResponse | null;
  originalRoadmap: FlatRoadmapResponse | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  isEditing: boolean;
  isFinalizing: boolean;
  editingItem: {
    type: "main" | "sub";
    sectionIndex: number;
    topicIndex?: number;
    isEditing: boolean;
  } | null;
  hasChanges: boolean;
}

// Helper functions for data conversion
export function hierarchicalToFlat(
  hierarchical: HierarchicalRoadmapData
): RoadmapData {
  const flat: RoadmapData = {};
  hierarchical.main_topics.forEach((topic) => {
    flat[topic.title] = topic.subtopics.map((subtopic) => subtopic.title);
  });
  return flat;
}

export function flatToHierarchical(flat: RoadmapData): HierarchicalRoadmapData {
  const main_topics: MainTopic[] = Object.entries(flat).map(
    ([title, subtopics]) => ({
      id: `main_${Math.random().toString(36).substr(2, 9)}`,
      title,
      subtopics: subtopics.map((subtitle) => ({
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
        title: subtitle,
      })),
    })
  );

  return {
    id: "course",
    main_topics,
  };
}

export interface RoadmapActions {
  generateRoadmap: (data: GenerateRoadmapDto) => Promise<void>;
  editRoadmap: (data: EditRoadmapDto) => Promise<void>;
  finalizeRoadmap: (
    data: FinalizeRoadmapDto
  ) => Promise<FinalizeRoadmapResponse>;
  clearRoadmap: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  startEditing: (
    type: "main" | "sub",
    sectionIndex: number,
    topicIndex?: number
  ) => void;
  stopEditing: () => void;
  updateMainTopic: (sectionIndex: number, newTitle: string) => void;
  updateSubTopic: (
    sectionIndex: number,
    topicIndex: number,
    newContent: string
  ) => void;
  addSubTopic: (sectionIndex: number, content: string) => void;
  addMainTopic: (title: string) => void;
  removeSubTopic: (sectionIndex: number, topicIndex: number) => void;
  removeMainTopic: (sectionIndex: number) => void;
  saveChangesToBackend: () => Promise<void>;
  resetToOriginal: () => void;
  checkForChanges: () => boolean;
}
