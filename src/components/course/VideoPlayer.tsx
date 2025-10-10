import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoPlayerComponentProps, VideoPlayerState, PresignedUrlRequest, PresignedUrlResponse } from '@/lib/types/courseGeneration';
import { api } from '@/lib/axios';

export const VideoPlayer: React.FC<VideoPlayerComponentProps> = ({
  courseId,
  sectionId,
  subtopicId,
  videoTitle,
  autoPlay = false,
  controls = true,
  onError,
  onLoad,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  className = ''
}) => {
  const [state, setState] = useState<VideoPlayerState>({
    videoUrl: null,
    isLoading: true,
    error: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Get presigned URL for video
  const getPresignedUrl = useCallback(async (): Promise<string | null> => {
    try {
      const request: PresignedUrlRequest = {
        courseId,
        sectionId,
        subtopicId,
        mediaType: 'video',
        expiresIn: 3600 // 1 hour
      };

      const response = await api.get<PresignedUrlResponse>('/api/files/presigned-url', {
        params: request
      });

      if (response.data.presignedUrl) {
        return response.data.presignedUrl;
      } else {
        throw new Error('No presigned URL received');
      }
    } catch (error: unknown) {
      console.error('Failed to get presigned URL:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to load video';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));

      if (onError) {
        onError(errorMessage);
      }

      return null;
    }
  }, [courseId, sectionId, subtopicId, onError]);

  // Load video URL
  const loadVideo = useCallback(async () => {
    if (!isMountedRef.current) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    const videoUrl = await getPresignedUrl();
    
    if (!isMountedRef.current) return;

    if (videoUrl) {
      setState(prev => ({
        ...prev,
        videoUrl,
        isLoading: false,
        error: null
      }));

      if (onLoad) {
        onLoad();
      }

      // Schedule URL refresh before expiration (with 5 minute buffer)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          loadVideo();
        }
      }, 55 * 60 * 1000); // Refresh after 55 minutes
    }
  }, [getPresignedUrl, onLoad]);

  // Handle video events
  const handleLoadStart = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
  }, []);

  const handleLoadedData = useCallback(() => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        duration: videoRef.current?.duration || 0
      }));
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && onTimeUpdate) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setState(prev => ({ ...prev, currentTime }));
      onTimeUpdate(currentTime, duration);
    }
  }, [onTimeUpdate]);

  const handlePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    if (onPlay) onPlay();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    if (onPause) onPause();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
    if (onEnded) onEnded();
  }, [onEnded]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', event);
    const errorMessage = 'Failed to load video. Please try again.';
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false
    }));

    if (onError) {
      onError(errorMessage);
    }
  }, [onError]);

  const handleRetry = useCallback(() => {
    loadVideo();
  }, [loadVideo]);

  // Load video on mount
  useEffect(() => {
    loadVideo();

    return () => {
      isMountedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadVideo]);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && videoRef.current && state.videoUrl && !state.isLoading) {
      videoRef.current.play().catch(error => {
        console.warn('Auto-play failed:', error);
      });
    }
  }, [autoPlay, state.videoUrl, state.isLoading]);

  if (state.isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-3xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Video Loading Error</h3>
          <p className="text-red-600 mb-4">{state.error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!state.videoUrl) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600">No video available</p>
      </div>
    );
  }

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <h3 className="absolute top-0 left-0 right-0 bg-black/70 text-white p-4 text-lg font-semibold z-10">
          {videoTitle}
        </h3>
        <video
          ref={videoRef}
          controls={controls}
          width="100%"
          height="400"
          src={state.videoUrl}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
          className="w-full h-[400px] bg-black"
        >
          Your browser does not support the video tag.
        </video>
        
        {state.duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3 flex justify-between items-center">
            <span className="text-sm font-medium">
              {Math.floor(state.currentTime / 60)}:{(state.currentTime % 60).toFixed(0).padStart(2, '0')} / 
              {Math.floor(state.duration / 60)}:{(state.duration % 60).toFixed(0).padStart(2, '0')}
            </span>
            <span className="text-sm font-medium">
              {state.isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
