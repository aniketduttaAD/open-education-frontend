import { api } from '@/lib/axios';
import { 
  CourseContent, 
  PresignedUrlRequest, 
  PresignedUrlResponse,
  CourseContentResponse 
} from '@/lib/types/courseGeneration';

export const coursesApi = {
  // Get course content
  getContent: async (courseId: string): Promise<CourseContent> => {
    const response = await api.get<CourseContentResponse>(`/api/courses/${courseId}/content`);
    return response.data.data;
  },

  // Get presigned URL for media
  getPresignedUrl: async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    const response = await api.get<PresignedUrlResponse>('/api/files/presigned-url', {
      params: request
    });
    return response.data;
  },

  // Get course details
  getCourse: async (courseId: string) => {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  // Update course progress
  updateProgress: async (courseId: string, progressData: {
    sectionId: string;
    subtopicId: string;
    completed: boolean;
    timeSpent?: number;
  }) => {
    const response = await api.post(`/api/courses/${courseId}/progress`, progressData);
    return response.data;
  },

  // Get course analytics
  getAnalytics: async (courseId: string) => {
    const response = await api.get(`/api/courses/${courseId}/analytics`);
    return response.data;
  }
};
