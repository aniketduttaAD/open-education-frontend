import React from "react";
import RoadmapDisplay from "./RoadmapDisplay";
import { FinalizeButton } from "./FinalizeButton";
import { useRoadmapStore } from "@/store/roadmapStore";
import { useUserStore } from "@/store/userStore";

interface RoadmapDisplayWithFinalizeProps {
  className?: string;
  showFinalizeButton?: boolean;
  onFinalize?: (courseId: string) => void;
  onError?: (error: string) => void;
}

export const RoadmapDisplayWithFinalize: React.FC<
  RoadmapDisplayWithFinalizeProps
> = ({ className = "", showFinalizeButton = true, onFinalize, onError }) => {
  const { user } = useUserStore();
  const { currentRoadmap, hasChanges } = useRoadmapStore();

  // Only show finalize button for tutors with a roadmap
  const shouldShowFinalize =
    showFinalizeButton && user?.user_type === "tutor" && currentRoadmap;

  if (!currentRoadmap) {
    return null;
  }

  return (
    <div className={`roadmap-display-with-finalize ${className}`}>
      <RoadmapDisplay roadmap={currentRoadmap} />

      {shouldShowFinalize && (
        <div className="finalize-section">
          {hasChanges && (
            <div className="changes-warning">
              <div className="warning-content">
                <span className="warning-icon">⚠️</span>
                <div className="warning-text">
                  <h4>Unsaved Changes</h4>
                  <p>
                    You have unsaved changes to your roadmap. Please save your
                    changes before finalizing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!hasChanges && (
            <FinalizeButton
              className="finalize-button-section"
              onFinalize={onFinalize}
              onError={onError}
            />
          )}
        </div>
      )}
    </div>
  );
};
