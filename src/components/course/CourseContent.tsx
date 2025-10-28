import React, { useState, useEffect, useCallback } from "react";
import {
  CourseContentComponentProps,
  CourseContent as CourseContentType,
} from "@/lib/types/courseGeneration";
import { VideoPlayer } from "./VideoPlayer";
import { api } from "@/lib/axios";

interface CourseContentProps extends CourseContentComponentProps {
  className?: string;
}

const CourseContent: React.FC<CourseContentProps> = ({
  courseId,
  onVideoSelect,
  // selectedSubtopic,
  className = "",
}) => {
  const [content, setContent] = useState<CourseContentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(
    new Set()
  );

  // Fetch course content
  const fetchCourseContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<CourseContentType>(
        `/api/courses/${courseId}/content`
      );

      if (response.data) {
        setContent(response.data);

        // Auto-expand first section if available
        if (response.data.sections.length > 0) {
          setExpandedSections(new Set([response.data.sections[0].id]));
        }
      }
    } catch (error: unknown) {
      console.error("Failed to fetch course content:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to load course content";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Load content on mount
  useEffect(() => {
    fetchCourseContent();
  }, [fetchCourseContent]);

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Toggle subtopic expansion
  const toggleSubtopic = useCallback(
    (subtopicId: string) => {
      setExpandedSubtopics((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(subtopicId)) {
          newSet.delete(subtopicId);
        } else {
          newSet.add(subtopicId);
        }
        return newSet;
      });

      // Call video select callback
      if (onVideoSelect) {
        const section = content?.sections.find((s) =>
          s.subtopics.some((st) => st.id === subtopicId)
        );
        if (section) {
          onVideoSelect(section.id, subtopicId);
        }
      }
    },
    [onVideoSelect, content]
  );

  // Get status badge class
  // const getStatusClass = (status: string) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'status-completed';
  //     case 'processing':
  //       return 'status-processing';
  //     case 'failed':
  //       return 'status-failed';
  //     default:
  //       return 'status-pending';
  //   }
  // };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "⏸️";
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg ${className}`}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
      >
        <div className="text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Content
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCourseContent}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!content || content.sections.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg ${className}`}
      >
        <div className="text-center">
          <div className="text-4xl mb-4 opacity-50">📚</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Content Available
          </h3>
          <p className="text-gray-600">
            This course doesn&apos;t have any content yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Course Content
        </h2>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            <span className="text-sm text-gray-600">
              <strong className="text-gray-800">
                {content.completedSections}
              </strong>{" "}
              / {content.totalSections} Sections
            </span>
            <span className="text-sm text-gray-600">
              <strong className="text-gray-800">
                {content.completedSubtopics}
              </strong>{" "}
              / {content.totalSubtopics} Topics
            </span>
            <span className="text-sm text-gray-600">
              <strong className="text-gray-800">
                {Math.round(content.overallProgress)}%
              </strong>{" "}
              Complete
            </span>
          </div>
          <div className="w-full lg:w-80">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${content.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {content.sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {section.index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    section.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : section.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : section.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getStatusIcon(section.status)}
                </span>
              </div>
              <div className="text-gray-500 text-lg transition-transform">
                {expandedSections.has(section.id) ? "▼" : "▶"}
              </div>
            </div>

            {expandedSections.has(section.id) && (
              <div className="p-4 bg-gray-50">
                {section.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="bg-white rounded-lg mb-2 last:mb-0 border border-gray-200"
                  >
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSubtopic(subtopic.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                          {subtopic.index + 1}
                        </span>
                        <h4 className="font-medium text-gray-800">
                          {subtopic.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subtopic.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : subtopic.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : subtopic.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusIcon(subtopic.status)}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {expandedSubtopics.has(subtopic.id) ? "▼" : "▶"}
                      </div>
                    </div>

                    {expandedSubtopics.has(subtopic.id) && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        {subtopic.status === "completed" &&
                          subtopic.video_url && (
                            <div className="mb-4">
                              <VideoPlayer
                                videoUrl={subtopic.video_url}
                                title={subtopic.title}
                                className="rounded-lg"
                              />
                            </div>
                          )}

                        {subtopic.status === "processing" && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-gray-600">
                              Generating content...
                            </p>
                          </div>
                        )}

                        {subtopic.status === "failed" && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                            <div className="text-red-500">❌</div>
                            <p className="text-red-600">
                              Content generation failed. Please try again.
                            </p>
                          </div>
                        )}

                        {subtopic.status === "pending" && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                            <div className="text-gray-500">⏸️</div>
                            <p className="text-gray-600">
                              Content not yet generated.
                            </p>
                          </div>
                        )}

                        {subtopic.duration && (
                          <div className="mt-3">
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              Duration: {Math.floor(subtopic.duration / 60)}:
                              {(subtopic.duration % 60)
                                .toFixed(0)
                                .padStart(2, "0")}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { CourseContent };
