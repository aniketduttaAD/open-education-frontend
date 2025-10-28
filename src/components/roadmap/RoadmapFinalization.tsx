'use client';

import React from 'react';
import { CourseGenerationFlow } from '@/components/course/CourseGenerationFlow';

export function RoadmapFinalization({ roadmapId }: { roadmapId: string }) {
  return <CourseGenerationFlow roadmapId={roadmapId} />;
}


