"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateRoadmapSchema,
  GenerateRoadmapFormData,
} from "@/lib/validation/roadmap";
import { useRoadmapStore } from "@/store/roadmapStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface RoadmapGenerationFormProps {
  onRoadmapGenerated?: () => void;
}

export default function RoadmapGenerationForm({
  onRoadmapGenerated,
}: RoadmapGenerationFormProps) {
  const { generateRoadmap, isGenerating, error, setError } = useRoadmapStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GenerateRoadmapFormData>({
    resolver: zodResolver(generateRoadmapSchema),
    mode: "onSubmit",
  });

  const watchedPrompt = watch("prompt");
  const isPromptValid =
    watchedPrompt && watchedPrompt.length >= 10 && watchedPrompt.length <= 500;

  const watchedValues = watch();

  const onSubmit = async (data: GenerateRoadmapFormData) => {
    try {
      setError(null);

      // Transform form data to match API expectations
      const techStackObject = ((): { technologies?: string[]; raw?: string } | undefined => {
        const raw = data.techStackPrefs?.trim();
        if (!raw) return undefined;
        // Split by comma and normalize
        const technologies = raw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        return {
          technologies: technologies.length > 0 ? technologies : undefined,
          raw,
        };
      })();

      const transformedData = {
        prompt: data.prompt,
        level: data.level && data.level.trim() !== "" ? data.level : undefined,
        durationWeeks:
          data.durationWeeks && data.durationWeeks.trim() !== ""
            ? Number(data.durationWeeks)
            : undefined,
        weeklyCommitmentHours:
          data.weeklyCommitmentHours && data.weeklyCommitmentHours.trim() !== ""
            ? Number(data.weeklyCommitmentHours)
            : undefined,
        techStackPrefs: techStackObject,
        constraints:
          data.constraints && data.constraints.length > 0
            ? data.constraints.filter((c) => c.trim() !== "")
            : undefined,
      };

      console.log("Form data:", data);
      console.log("Transformed data:", transformedData);

          await generateRoadmap(transformedData);
          // The roadmap is now available in the store via currentRoadmap
          onRoadmapGenerated?.();
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate roadmap"
      );
    }
  };

  const addConstraint = () => {
    const currentConstraints = watchedValues.constraints || [];
    setValue("constraints", [...currentConstraints, ""]);
  };

  const updateConstraint = (index: number, value: string) => {
    const currentConstraints = watchedValues.constraints || [];
    const updated = [...currentConstraints];
    updated[index] = value;
    setValue("constraints", updated);
  };

  const removeConstraint = (index: number) => {
    const currentConstraints = watchedValues.constraints || [];
    const updated = currentConstraints.filter((_, i) => i !== index);
    setValue("constraints", updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
          </h2>
          <p className="text-gray-600">
            Describe your course content and we&apos;ll generate a structured
            learning roadmap for your students.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Course Description */}
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Description *
            </label>
            <textarea
              {...register("prompt")}
              id="prompt"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your course content and learning objectives. For example: 'Full-stack web development course covering React, Node.js, and MongoDB. Students will learn to build modern web applications with authentication, database integration, and deployment.'"
            />
            {errors.prompt && (
              <p className="mt-1 text-sm text-red-600">
                {errors.prompt.message}
              </p>
            )}
          </div>

          {/* Course Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Target Student Level
              </label>
              <select
                {...register("level")}
                id="level"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select target level</option>
                <option value="beginner">Beginner - No prior experience</option>
                <option value="intermediate">
                  Intermediate - Some experience
                </option>
                <option value="advanced">
                  Advanced - Experienced students
                </option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="durationWeeks"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course Duration (weeks)
              </label>
              <input
                {...register("durationWeeks")}
                type="text"
                id="durationWeeks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 12 weeks"
              />
              {errors.durationWeeks && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.durationWeeks.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="weeklyCommitmentHours"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expected Weekly Study Time (hours)
            </label>
            <input
              {...register("weeklyCommitmentHours")}
              type="text"
              id="weeklyCommitmentHours"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10 hours per week"
            />
            {errors.weeklyCommitmentHours && (
              <p className="mt-1 text-sm text-red-600">
                {errors.weeklyCommitmentHours.message}
              </p>
            )}
          </div>

          {/* Technology Stack */}
          <div>
            <label
              htmlFor="techStackPrefs"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Technologies & Tools
            </label>
            <textarea
              {...register("techStackPrefs")}
              id="techStackPrefs"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., React, Node.js, MongoDB, AWS"
            />
          </div>

          {/* Course Constraints */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Constraints
            </label>
            <div className="space-y-2">
              {(watchedValues.constraints || []).map((constraint, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => updateConstraint(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Free tools only, no paid software required"
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addConstraint}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Constraint
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isPromptValid || isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating Roadmap...
                </>
              ) : (
                "Generate Course Roadmap"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
