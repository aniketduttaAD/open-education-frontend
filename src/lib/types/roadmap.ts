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
  roadmapId: string;
  courseId: string;
  totalSections: number;
  totalSubtopics: number;
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
    ([title, subtopics], _index) => ({
      id: `main_${Math.random().toString(36).substr(2, 9)}`,
      title,
      subtopics: subtopics.map((subtitle, _subIndex) => ({
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
