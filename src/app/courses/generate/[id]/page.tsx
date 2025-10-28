'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CourseGenerationFlow } from '@/components/course/CourseGenerationFlow';

export default function CourseGenerationPage() {
  const params = useParams();
  const roadmapId = params.id as string;

  if (!roadmapId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Roadmap ID</h1>
          <p className="text-gray-600">Please provide a valid roadmap ID to generate the course.</p>
        </div>
      </div>
    );
  }

  return <CourseGenerationFlow roadmapId={roadmapId} />;
}
