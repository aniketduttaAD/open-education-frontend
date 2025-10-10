import { api } from '@/lib/axios';
import { 
  GenerateRoadmapDto, 
  EditRoadmapDto, 
  FinalizeRoadmapDto,
  GenerateRoadmapApiResponse,
  EditRoadmapApiResponse,
  FinalizeRoadmapResponse
} from '@/lib/types/roadmap';

export const roadmapApi = {
  generate: async (data: GenerateRoadmapDto): Promise<GenerateRoadmapApiResponse> => {
    const response = await api.post('/api/roadmaps/generate', data);
    return response.data as GenerateRoadmapApiResponse;
  },

  edit: async (data: EditRoadmapDto): Promise<EditRoadmapApiResponse> => {
    const response = await api.post('/api/roadmaps/edit', data);
    return response.data as EditRoadmapApiResponse;
  },

  finalize: async (data: FinalizeRoadmapDto): Promise<FinalizeRoadmapResponse> => {
    const response = await api.post('/api/roadmaps/finalize', data);
    return response.data as FinalizeRoadmapResponse;
  }
};
