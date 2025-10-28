'use client'

import React from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  title: string
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  React.useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.load()
      // Auto-play when modal opens
      videoRef.current.play().catch(console.error)
    }
  }, [isOpen, videoUrl])

  React.useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isOpen])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value)
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === ' ') {
      e.preventDefault()
      togglePlay()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      tabIndex={-1}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Player */}
        <div 
          className="relative cursor-pointer"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[70vh]"
            controls={false}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error('Video error:', e)
              alert('Error loading video. Please check the video URL.')
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
              </div>
            </div>
          </div>

          {/* Video Overlay Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Title */}
        <div className="p-4 bg-gray-900 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  )
}
