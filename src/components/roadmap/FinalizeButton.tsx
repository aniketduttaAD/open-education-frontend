import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoadmapStore } from "@/store/roadmapStore";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/userStore";

interface FinalizeButtonProps {
  className?: string;
  onFinalize?: (courseId: string) => void;
  onError?: (error: string) => void;
}

export const FinalizeButton: React.FC<FinalizeButtonProps> = ({
  className = "",
  onFinalize,
  onError,
}) => {
  const router = useRouter();
  const { user } = useUserStore();
  const {
    currentRoadmap,
    isFinalizing,
    error: roadmapError,
    finalizeRoadmap,
  } = useRoadmapStore();

  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user can finalize
  const canFinalize =
    user?.user_type === "tutor" &&
    currentRoadmap &&
    !isFinalizing &&
    !isProcessing;

  // Handle finalize action
  const handleFinalize = async () => {
    if (!currentRoadmap || !user) {
      onError?.("No roadmap available or user not authenticated");
      return;
    }

    try {
      setIsProcessing(true);

      // Call the finalize API
      const response = await finalizeRoadmap({ id: currentRoadmap.id });

      if (response.success) {
        console.log("Roadmap finalized successfully:", response);

        // Redirect to course generation page
        const courseId = response.data.result.courseId;
        const generateUrl = `/courses/generate?roadmapId=${currentRoadmap.id}&courseId=${courseId}`;
        router.push(generateUrl);

        // Call success callback
        onFinalize?.(courseId);
      } else {
        throw new Error(response?.success || "Failed to finalize roadmap");
      }
    } catch (error: unknown) {
      console.error("Finalize failed:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to finalize roadmap";

      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show error state
  if (roadmapError) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">⚠️</span>
          <span className="font-medium text-red-800">{roadmapError}</span>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show unauthorized state
  if (user?.user_type !== "tutor") {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔒</span>
          <span className="font-medium text-red-800">
            Only tutors can finalize roadmaps
          </span>
        </div>
      </div>
    );
  }

  // Show no roadmap state
  if (!currentRoadmap) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <span className="font-medium text-red-800">
            No roadmap available to finalize
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg ${className}`}
    >
      <div className="mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Ready to Generate Course?
          </h3>
          <p className="text-gray-600">
            This will create a comprehensive course with videos, audio, and
            interactive content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Estimated Time
            </span>
            <span className="text-sm font-semibold text-gray-800">
              8+ minutes per topic
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Content Type
            </span>
            <span className="text-sm font-semibold text-gray-800">
              Videos, Audio, Slides, Assessments
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Storage
            </span>
            <span className="text-sm font-semibold text-gray-800">
              Secure cloud storage
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleFinalize}
          disabled={!canFinalize}
          loading={isFinalizing || isProcessing}
          variant="primary"
          size="lg"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 min-w-[250px] mb-4"
        >
          {isFinalizing || isProcessing
            ? "Finalizing..."
            : "Finalize & Generate Course"}
        </Button>

        <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">
            This process cannot be undone. Make sure your roadmap is complete.
          </span>
        </div>
      </div>
    </div>
  );
};
