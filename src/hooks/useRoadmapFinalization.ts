import { useCallback, useState } from 'react';
import { useRoadmapStore } from '@/store/roadmapStore';
import type { FinalizeRoadmapDto, FinalizeRoadmapResponse } from '@/lib/types/roadmap';

export const useRoadmapFinalization = () => {
  const { finalizeRoadmap } = useRoadmapStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinalizeRoadmapResponse | null>(null);

  const finalize = useCallback(async (dto: FinalizeRoadmapDto) => {
    try {
      setIsGenerating(true);
      setProgress(0);
      setCurrentStep('Starting generation...');
      setError(null);
      setResult(null);

      const resp = await finalizeRoadmap(dto);

      setResult(resp);
      setProgress(100);
      setCurrentStep('Generation completed!');
    } catch (e: any) {
      setError(e?.message || 'Failed to finalize roadmap');
      setCurrentStep('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [finalizeRoadmap]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setCurrentStep('');
    setError(null);
    setResult(null);
  }, []);

  return { isGenerating, progress, currentStep, error, result, finalize, reset };
};


