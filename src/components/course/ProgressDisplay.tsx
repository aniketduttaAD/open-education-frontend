import React from 'react';
import { ProgressDisplayProps, GENERATION_PHASES } from '@/lib/types/courseGeneration';

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  progress,
  currentTask,
  estimatedTimeRemaining,
  phase,
  isGenerating,
  className = ''
}) => {
  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Almost done!';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s remaining`;
    } else {
      return `${secs}s remaining`;
    }
  };

  // Get current phase info
  const getCurrentPhaseInfo = () => {
    if (!phase) return null;
    
    const phaseInfo = GENERATION_PHASES.find(p => p.name === phase);
    return phaseInfo || null;
  };

  const currentPhaseInfo = getCurrentPhaseInfo();

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Generation Progress</h3>
          <div className="text-3xl font-bold text-green-500">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="relative mb-8">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="relative mt-4 h-10">
            {GENERATION_PHASES.map((phaseInfo) => (
              <div 
                key={phaseInfo.name}
                className={`absolute transform -translate-x-1/2 text-center ${
                  progress >= phaseInfo.percentage ? 'text-green-500' : 
                  phase === phaseInfo.name ? 'text-blue-500' : 'text-gray-400'
                }`}
                style={{ left: `${phaseInfo.percentage}%` }}
              >
                <div className={`w-4 h-4 rounded-full mx-auto mb-1 border-2 ${
                  progress >= phaseInfo.percentage ? 'bg-green-500 border-green-500' : 
                  phase === phaseInfo.name ? 'bg-blue-500 border-blue-500 animate-pulse' : 'bg-gray-200 border-gray-300'
                }`}></div>
                <span className="text-xs font-medium capitalize">{phaseInfo.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{isGenerating ? '⏳' : '✅'}</div>
              <div>
                <h4 className="font-semibold text-gray-800">Current Task</h4>
                <p className="text-sm text-gray-600">{currentTask || 'Preparing generation...'}</p>
              </div>
            </div>
          </div>

          {currentPhaseInfo && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div>
                <h4 className="font-semibold text-gray-800">Current Phase: {currentPhaseInfo.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{currentPhaseInfo.description}</p>
                <div className="text-xs text-gray-500">
                  Phase Progress: {Math.round(progress)}%
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⏱️</div>
              <div>
                <h4 className="font-semibold text-gray-800">Estimated Time Remaining</h4>
                <p className="text-sm text-gray-600">{formatTimeRemaining(estimatedTimeRemaining)}</p>
              </div>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-blue-500 font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Generating content...</span>
            </div>
          </div>
        )}

        {!isGenerating && progress === 100 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-green-500 font-medium">
              <div className="text-xl">✅</div>
              <span>Generation completed successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
