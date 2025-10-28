'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CourseGenerationFlow } from '@/components/course/CourseGenerationFlow';

export function RoadmapFinalization({ roadmapId }: { roadmapId: string }) {
  return <CourseGenerationFlow roadmapId={roadmapId} />;
}


