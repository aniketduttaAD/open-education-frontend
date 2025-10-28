"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Edit,
  Minus,
  Plus,
  Check,
  X,
} from "lucide-react";
import { useRoadmapStore } from "@/store/roadmapStore";
import type { FlatRoadmapResponse } from "@/lib/types/roadmap";

interface RoadmapDisplayProps {
  roadmap: FlatRoadmapResponse; 
  onFinalize?: () => void;
  showActions?: boolean;
}

interface RoadmapSectionProps {
  title: string;
  topics: string[];
  isExpanded: boolean;
  onToggle: () => void;
  sectionIndex: number;
}

function RoadmapSection({
  title,
  topics,
  isExpanded,
  onToggle,
  sectionIndex,
}: RoadmapSectionProps) {
  const {
    editingItem,
    startEditing,
    stopEditing,
    updateMainTopic,
    updateSubTopic,
    addSubTopic,
    removeSubTopic,
    removeMainTopic,
  } = useRoadmapStore();

  const [editValue, setEditValue] = useState("");
  const [isAddingSubTopic, setIsAddingSubTopic] = useState(false);

  // Ensure topics is an array
  const topicsArray = Array.isArray(topics) ? topics : [];

  const isEditingMain =
    editingItem?.type === "main" && editingItem?.sectionIndex === sectionIndex;
  const isEditingSub =
    editingItem?.type === "sub" && editingItem?.sectionIndex === sectionIndex;

  const handleEditMain = () => {
    setEditValue(title);
    startEditing("main", sectionIndex);
  };

  const handleEditSub = (topicIndex: number) => {
    setEditValue(topicsArray[topicIndex]);
    startEditing("sub", sectionIndex, topicIndex);
  };

  const handleSave = () => {
    if (editValue.trim().length < 10) return;

    if (isEditingMain) {
      updateMainTopic(sectionIndex, editValue.trim());
    } else if (isEditingSub && editingItem?.topicIndex !== undefined) {
      updateSubTopic(sectionIndex, editingItem.topicIndex, editValue.trim());
    } else if (isAddingSubTopic) {
      addSubTopic(sectionIndex, editValue.trim());
      setIsAddingSubTopic(false);
    }

    setEditValue("");
    stopEditing();
  };

  const handleCancel = () => {
    setEditValue("");
    setIsAddingSubTopic(false);
    stopEditing();
  };

  const handleAddSubTopic = () => {
    setEditValue("");
    setIsAddingSubTopic(true);
  };

  const handleRemoveSubTopic = (topicIndex: number) => {
    removeSubTopic(sectionIndex, topicIndex);
  };

  const handleRemoveMain = () => {
    removeMainTopic(sectionIndex);
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div className="px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <BookOpen className="h-5 w-5 text-blue-600" />
          {isEditingMain ? (
            <div className="flex-1 relative">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course section title..."
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button
                  onClick={handleSave}
                  disabled={editValue.trim().length < 10}
                  className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {topicsArray.length} lessons
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isEditingMain && (
            <>
              <button
                onClick={handleEditMain}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="Edit section title"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleRemoveMain}
                className="p-1 text-red-600 hover:text-red-800"
                title="Remove section"
              >
                <Minus className="h-4 w-4" />
              </button>
            </>
          )}

          <button
            onClick={onToggle}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          <ul className="space-y-2">
            {topicsArray.map((topic, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                {isEditingSub && editingItem?.topicIndex === index ? (
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter lesson content..."
                      autoFocus
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <button
                        onClick={handleSave}
                        disabled={editValue.trim().length < 10}
                        className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-700 flex-1">{topic}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => handleEditSub(index)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit lesson"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveSubTopic(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remove lesson"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}

            {isAddingSubTopic && (
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new lesson content..."
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <button
                      onClick={handleSave}
                      disabled={editValue.trim().length < 10}
                      className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            )}

            {!isAddingSubTopic && (
              <li className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddSubTopic}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Lesson
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function RoadmapDisplay({
  roadmap,
  onFinalize,
  showActions = true,
}: RoadmapDisplayProps) {
  const router = useRouter();
  const {
    addMainTopic,
    hasChanges,
    isEditing,
    saveChangesToBackend,
    resetToOriginal,
    checkForChanges,
  } = useRoadmapStore();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [isAddingMainTopic, setIsAddingMainTopic] = useState(false);
  const [newMainTopicValue, setNewMainTopicValue] = useState("");

  const roadmapData = roadmap.data;
  
  console.log("RoadmapDisplay - Full roadmap:", roadmap);
  console.log("RoadmapDisplay - Extracted data:", roadmapData);

  // Convert flat structure to sections array
  const sections: [string, string[]][] = Object.entries(roadmapData || {});
  
  console.log("RoadmapDisplay - sections:", sections);

  const totalTopics = sections.reduce((sum, [, topics]) => {
    if (Array.isArray(topics)) {
      return sum + topics.length;
    }
    return sum;
  }, 0);

  console.log("RoadmapDisplay - totalTopics:", totalTopics);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const toggleAllSections = () => {
    const newExpandedState = !allExpanded;
    const newExpandedSections: Record<string, boolean> = {};

    sections.forEach(([title]) => {
      newExpandedSections[title] = newExpandedState;
    });

    setExpandedSections(newExpandedSections);
    setAllExpanded(newExpandedState);
  };

  const handleAddMainTopic = () => {
    setNewMainTopicValue("");
    setIsAddingMainTopic(true);
  };

  const handleSaveMainTopic = () => {
    if (newMainTopicValue.trim().length < 10) return;

    addMainTopic(newMainTopicValue.trim());
    setNewMainTopicValue("");
    setIsAddingMainTopic(false);
  };

  const handleCancelMainTopic = () => {
    setNewMainTopicValue("");
    setIsAddingMainTopic(false);
  };

  const handleEditRoadmap = async () => {
    try {
      await saveChangesToBackend();
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleResetRoadmap = () => {
    resetToOriginal();
  };

  // Check if there are changes
  const hasUnsavedChanges = hasChanges || checkForChanges();

  const handleFinalize = useCallback(async () => {
    if (hasUnsavedChanges) return;
    
    // Navigate to course generation page
    router.push(`/courses/generate/${roadmap.id}`);
  }, [hasUnsavedChanges, router, roadmap.id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Learning Roadmap
                </h2>
                {hasUnsavedChanges && (
                  <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded-full">
                    Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Your personalized learning path with {sections.length} sections
                and {totalTopics} topics
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleAllSections}
                variant="outline"
                className="px-4 py-2"
              >
                {allExpanded ? "Collapse All" : "Expand All"}
              </Button>
            </div>
          </div>

          {/* Roadmap ID */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Roadmap ID:</span>{" "}
              {roadmap.id || 'N/A'}
            </p>
          </div>
        </div>

        {/* Roadmap Sections */}
        {sections.length > 0 ? (
          <div className="space-y-4">
            {sections.map(([title, topics], index) => (
              <RoadmapSection
                key={title}
                title={title}
                topics={Array.isArray(topics) ? topics : []}
                isExpanded={expandedSections[title] || false}
                onToggle={() => toggleSection(title)}
                sectionIndex={index}
              />
            ))}

            {/* Add Main Topic */}
            {isAddingMainTopic ? (
              <div className="border border-gray-200 rounded-lg mb-4">
                <div className="px-4 py-3 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMainTopicValue}
                        onChange={(e) => setNewMainTopicValue(e.target.value)}
                        className="w-full px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new course section title..."
                        autoFocus
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                          onClick={handleSaveMainTopic}
                          disabled={newMainTopicValue.trim().length < 10}
                          className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelMainTopic}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleAddMainTopic}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Course Section
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Roadmap Data
            </h3>
            <p className="text-gray-600">
              The roadmap data appears to be empty or malformed.
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                This roadmap is temporary and will expire in 48 hours.
                {onFinalize && " Finalize it to save permanently."}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleEditRoadmap}
                  disabled={!hasUnsavedChanges || isEditing}
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Saving Changes...
                    </>
                  ) : (
                    "Edit Roadmap"
                  )}
                </Button>

                {hasUnsavedChanges && (
                  <Button
                    onClick={handleResetRoadmap}
                    variant="outline"
                    className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Reset Changes
                  </Button>
                )}

                <Button
                  onClick={handleFinalize}
                  disabled={hasUnsavedChanges}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalize Roadmap
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sections.length}
            </div>
            <div className="text-sm text-gray-600">Learning Sections</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalTopics}
            </div>
            <div className="text-sm text-gray-600">Total Topics</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sections.length > 0
                ? Math.round(totalTopics / sections.length)
                : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Topics/Section</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
