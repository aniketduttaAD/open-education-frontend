import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  RoadmapState,
  RoadmapActions,
  GenerateRoadmapDto,
  EditRoadmapDto,
  FinalizeRoadmapDto,
  RoadmapData,
  hierarchicalToFlat,
  GenerateRoadmapApiResponse,
  EditRoadmapApiResponse,
  FlatRoadmapResponse,
} from "@/lib/types/roadmap";
import { roadmapApi } from "@/lib/api/roadmap";
  
// Helper function to generate edit operations from changes
function generateEditOperations(
  originalData: RoadmapData,
  currentData: RoadmapData
): Array<{
  op: "rm-main" | "add-main" | "up-main" | "add-sub" | "rm-sub" | "up-sub";
  id?: string;
  query?: string;
}> {
  const changes: Array<{
    op: "rm-main" | "add-main" | "up-main" | "add-sub" | "rm-sub" | "up-sub";
    id?: string;
    query?: string;
  }> = [];

  const originalSections = Object.entries(originalData);
  const currentSections = Object.entries(currentData);

  // Check for removed main topics
  originalSections.forEach(([title]) => {
    if (!currentData[title]) {
      changes.push({
        op: "rm-main",
        query: `Remove the section "${title}"`,
      });
    }
  });

  // Check for added main topics
  currentSections.forEach(([title, topics]) => {
    if (!originalData[title]) {
      changes.push({
        op: "add-main",
        query: `Add a new section "${title}" with the following topics: ${
          Array.isArray(topics) ? topics.join(", ") : ""
        }`,
      });
    }
  });

  // Check for updated main topics and their subtopics
  currentSections.forEach(([title, currentTopics]) => {
    const originalTopics = originalData[title];
    if (
      originalTopics &&
      Array.isArray(originalTopics) &&
      Array.isArray(currentTopics)
    ) {
      // Check if main topic title changed
      if (title !== title) {
        changes.push({
          op: "up-main",
          query: `Update section title to "${title}"`,
        });
      }

      // Check for removed subtopics
      originalTopics.forEach((originalTopic) => {
        if (!currentTopics.includes(originalTopic)) {
          changes.push({
            op: "rm-sub",
            query: `Remove the subtopic "${originalTopic}" from section "${title}"`,
          });
        }
      });

      // Check for added subtopics
      currentTopics.forEach((currentTopic) => {
        if (!originalTopics.includes(currentTopic)) {
          changes.push({
            op: "add-sub",
            query: `Add the subtopic "${currentTopic}" to section "${title}"`,
          });
        }
      });

      // Check for updated subtopics (same position, different content)
      currentTopics.forEach((currentTopic, index) => {
        if (originalTopics[index] && originalTopics[index] !== currentTopic) {
          changes.push({
            op: "up-sub",
            query: `Update subtopic from "${originalTopics[index]}" to "${currentTopic}" in section "${title}"`,
          });
        }
      });
    }
  });

  return changes;
}

export const useRoadmapStore = create<RoadmapState & RoadmapActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentRoadmap: null,
      originalRoadmap: null,
      isLoading: false,
      error: null,
      isGenerating: false,
      isEditing: false,
      isFinalizing: false,
      editingItem: null,
      hasChanges: false,

      // Actions
      generateRoadmap: async (data: GenerateRoadmapDto) => {
        set({ isGenerating: true, error: null, isLoading: true });

        try {
          const response: GenerateRoadmapApiResponse = await roadmapApi.generate(
            data
          );

          const flatData: RoadmapData = hierarchicalToFlat(
            response.data.data
          );

          const transformedResponse: FlatRoadmapResponse = {
            id: String(response.data.id),
            data: flatData,
          };

          set({
            currentRoadmap: transformedResponse,
            originalRoadmap: transformedResponse,
            isGenerating: false,
            isLoading: false,
            error: null,
            hasChanges: false,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Failed to generate roadmap"
              : "Failed to generate roadmap";
          set({
            error: errorMessage,
            isGenerating: false,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      editRoadmap: async (data: EditRoadmapDto) => {
        set({ isEditing: true, error: null, isLoading: true });

        try {
          const response: EditRoadmapApiResponse = await roadmapApi.edit(data);

          const flatData: RoadmapData = hierarchicalToFlat(
            response.data.data
          );

          set({
            currentRoadmap: {
              id: response.data.id,
              data: flatData,
            },
            isEditing: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Failed to edit roadmap"
              : "Failed to edit roadmap";
          set({
            error: errorMessage,
            isEditing: false,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      finalizeRoadmap: async (data: FinalizeRoadmapDto) => {
        set({ isFinalizing: true, error: null, isLoading: true });

        try {
          const response = await roadmapApi.finalize(data);

          set({
            isFinalizing: false,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Failed to finalize roadmap"
              : "Failed to finalize roadmap";
          set({
            error: errorMessage,
            isFinalizing: false,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      clearRoadmap: () => {
        set({
          currentRoadmap: null,
          error: null,
          isLoading: false,
          isGenerating: false,
          isEditing: false,
          isFinalizing: false,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      startEditing: (
        type: "main" | "sub",
        sectionIndex: number,
        topicIndex?: number
      ) => {
        set({
          editingItem: {
            type,
            sectionIndex,
            topicIndex,
            isEditing: true,
          },
        });
      },

      stopEditing: () => {
        set({ editingItem: null });
      },

      updateMainTopic: (sectionIndex: number, newTitle: string) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const sections = Object.entries(currentRoadmap.data);
        const newSections = [...sections];
        const [, topics] = newSections[sectionIndex];
        newSections[sectionIndex] = [newTitle, topics];

        const newData = Object.fromEntries(newSections);
        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          editingItem: null,
          hasChanges: true,
        });
      },

      updateSubTopic: (
        sectionIndex: number,
        topicIndex: number,
        newContent: string
      ) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const sections = Object.entries(currentRoadmap.data);
        const newSections = [...sections];
        const [title, topics] = newSections[sectionIndex];
        const newTopics = [...topics];
        newTopics[topicIndex] = newContent;
        newSections[sectionIndex] = [title, newTopics];

        const newData = Object.fromEntries(newSections);
        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          editingItem: null,
          hasChanges: true,
        });
      },

      addSubTopic: (sectionIndex: number, content: string) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const sections = Object.entries(currentRoadmap.data);
        const newSections = [...sections];
        const [title, topics] = newSections[sectionIndex];
        const newTopics = [...topics, content];
        newSections[sectionIndex] = [title, newTopics];

        const newData = Object.fromEntries(newSections);
        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          editingItem: null,
          hasChanges: true,
        });
      },

      addMainTopic: (title: string) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const newData = {
          ...currentRoadmap.data,
          [title]: [],
        };

        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          editingItem: null,
          hasChanges: true,
        });
      },

      removeSubTopic: (sectionIndex: number, topicIndex: number) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const sections = Object.entries(currentRoadmap.data);
        const newSections = [...sections];
        const [title, topics] = newSections[sectionIndex];
        const newTopics = topics.filter((_, index) => index !== topicIndex);
        newSections[sectionIndex] = [title, newTopics];

        const newData = Object.fromEntries(newSections);
        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          hasChanges: true,
        });
      },

      removeMainTopic: (sectionIndex: number) => {
        const { currentRoadmap } = get();
        if (!currentRoadmap) return;

        const sections = Object.entries(currentRoadmap.data);
        const newSections = sections.filter(
          (_, index) => index !== sectionIndex
        );
        const newData = Object.fromEntries(newSections);

        set({
          currentRoadmap: {
            ...currentRoadmap,
            data: newData,
          },
          hasChanges: true,
        });
      },

      checkForChanges: () => {
        const { currentRoadmap, originalRoadmap } = get();
        if (!currentRoadmap || !originalRoadmap) return false;

        return (
          JSON.stringify(currentRoadmap.data) !==
          JSON.stringify(originalRoadmap.data)
        );
      },

      saveChangesToBackend: async () => {
        const { currentRoadmap, originalRoadmap } = get();
        if (!currentRoadmap || !originalRoadmap) return;

        set({ isEditing: true, error: null });

        try {
          // Convert changes to edit operations
          const changes = generateEditOperations(
            originalRoadmap.data,
            currentRoadmap.data
          );

          if (changes.length === 0) {
            set({ isEditing: false });
            return;
          }

          const editData: EditRoadmapDto = {
            roadmapId: currentRoadmap.id,
            changes: changes,
          };

          const response: EditRoadmapApiResponse = await roadmapApi.edit(
            editData
          );

          const flatData: RoadmapData = hierarchicalToFlat(
            response.data.data
          );

          // Update with the response from backend
          set({
            currentRoadmap: {
              id: response.data.id,
              data: flatData,
            },
            originalRoadmap: {
              id: response.data.id,
              data: flatData,
            },
            isEditing: false,
            hasChanges: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Failed to save changes"
              : "Failed to save changes";
          set({
            error: errorMessage,
            isEditing: false,
          });
        }
      },

      resetToOriginal: () => {
        const { originalRoadmap } = get();
        if (!originalRoadmap) return;

        set({
          currentRoadmap: originalRoadmap,
          hasChanges: false,
          editingItem: null,
        });
      },
    }),
    {
      name: "roadmap-store",
    }
  )
);
