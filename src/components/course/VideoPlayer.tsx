'use client';

import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, className = "" }) => {
  return (
    <div className={`video-container ${className}`}>
      <video 
        controls 
        className="w-full rounded-lg"
        poster="/placeholder-video.jpg"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p className="text-sm text-gray-600 mt-2">{title}</p>
    </div>
  );
};