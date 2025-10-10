"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoadmapStore } from "@/store/roadmapStore";
import RoadmapGenerationForm from "@/components/roadmap/RoadmapGenerationForm";
import RoadmapDisplay from "@/components/roadmap/RoadmapDisplay";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Plus } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const { currentRoadmap, finalizeRoadmap, clearRoadmap } = useRoadmapStore();
  const [step, setStep] = useState<"form" | "roadmap" | "finalize">("form");
  const [isFinalizingCourse, setIsFinalizingCourse] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("CreateCoursePage - currentRoadmap:", currentRoadmap);
    console.log("CreateCoursePage - step:", step);
  }, [currentRoadmap, step]);

  // Set page title
  useEffect(() => {
    document.title = "Create Course - OpenEdu";
  }, []);

  const handleRoadmapGenerated = () => {
    setStep("roadmap");
  };

  const handleFinalizeRoadmap = async () => {
    if (!currentRoadmap) return;

    try {
      setIsFinalizingCourse(true);
      const roadmapId = currentRoadmap.id;
      await finalizeRoadmap({ id: roadmapId });
      setStep("finalize");
    } catch (error) {
      console.error("Failed to finalize roadmap:", error);
    } finally {
      setIsFinalizingCourse(false);
    }
  };

  const handleCreateAnother = () => {
    clearRoadmap();
    setStep("form");
  };

  const handleBackToDashboard = () => {
    router.push("/tutor/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              <div
                className={`flex items-center ${
                  step === "form"
                    ? "text-blue-600"
                    : step === "roadmap" || step === "finalize"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "form"
                      ? "bg-blue-600 text-white"
                      : step === "roadmap" || step === "finalize"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Generate Roadmap</span>
              </div>

              <div
                className={`w-16 h-0.5 ${
                  step === "roadmap" || step === "finalize"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />

              <div
                className={`flex items-center ${
                  step === "roadmap"
                    ? "text-blue-600"
                    : step === "finalize"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "roadmap"
                      ? "bg-blue-600 text-white"
                      : step === "finalize"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Review Roadmap</span>
              </div>

              <div
                className={`w-16 h-0.5 ${
                  step === "finalize" ? "bg-green-600" : "bg-gray-300"
                }`}
              />

              <div
                className={`flex items-center ${
                  step === "finalize" ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === "finalize"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Finalize Course</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        {step === "form" && (
          <RoadmapGenerationForm onRoadmapGenerated={handleRoadmapGenerated} />
        )}

        {step === "roadmap" && currentRoadmap && (
          <div className="space-y-6">
            <RoadmapDisplay
              roadmap={currentRoadmap}
              onFinalize={handleFinalizeRoadmap}
              showActions={true}
            />

            {isFinalizingCourse && (
              <Card className="p-6 text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">
                  Finalizing your course roadmap...
                </p>
              </Card>
            )}
          </div>
        )}

        {step === "roadmap" && !currentRoadmap && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Roadmap Found
              </h2>

              <p className="text-gray-600 mb-6">
                It looks like the roadmap generation didn&apos;t complete
                successfully. Please try generating the roadmap again.
              </p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setStep("form")} className="px-6 py-3">
                  Generate Roadmap Again
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "finalize" && (
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Course Roadmap Created Successfully!
              </h2>

              <p className="text-gray-600 mb-6">
                Your learning roadmap has been finalized and is ready to be used
                for your course. The roadmap will help structure your course
                content and provide a clear learning path for your students.
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleCreateAnother}
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <Plus className="h-4 w-4" />
                  Create Another Course
                </Button>

                <Button
                  onClick={handleBackToDashboard}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
