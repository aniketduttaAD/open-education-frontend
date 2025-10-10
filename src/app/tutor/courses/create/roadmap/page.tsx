'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoadmapDisplayWithFinalize } from '@/components/roadmap/RoadmapDisplayWithFinalize';
import { useUserStore } from '@/store/userStore';
import { useRoadmapStore } from '@/store/roadmapStore';
import { toast } from 'react-hot-toast';

export default function RoadmapPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { currentRoadmap, hasChanges, saveChangesToBackend } = useRoadmapStore();
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated or not a tutor
  if (!user || user.user_type !== 'tutor') {
    router.push('/login');
    return null;
  }

  // Handle finalize success
  const handleFinalizeSuccess = (courseId: string) => {
    toast.success('Roadmap finalized successfully! Redirecting to course generation...');
    // The FinalizeButton component will handle the redirect
  };

  // Handle finalize error
  const handleFinalizeError = (error: string) => {
    toast.error(`Failed to finalize roadmap: ${error}`);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    try {
      setIsSaving(true);
      await saveChangesToBackend();
      toast.success('Changes saved successfully!');
    } catch (error: unknown) {
      toast.error(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <button 
              onClick={() => router.back()}
              className="bg-none border-none text-blue-500 cursor-pointer text-sm p-2 rounded transition-colors hover:bg-gray-100 hover:text-blue-700"
            >
              ← Back
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Course Roadmap</span>
          </div>
          
          <div className="flex gap-4 items-center">
            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {!currentRoadmap ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <div className="text-4xl mb-4 opacity-50">📝</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Roadmap Available</h2>
              <p className="text-gray-600 mb-6">Please generate a roadmap first before creating a course.</p>
              <button 
                onClick={() => router.push('/tutor/courses/create')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Create Roadmap
              </button>
            </div>
          </div>
        ) : (
          <RoadmapDisplayWithFinalize
            className=""
            showFinalizeButton={true}
            onFinalize={handleFinalizeSuccess}
            onError={handleFinalizeError}
          />
        )}
      </div>
    </div>
  );
}
