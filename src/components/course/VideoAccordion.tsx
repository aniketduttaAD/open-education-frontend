'use client'

import React, { useState } from 'react'
import { ChevronDown, Clock, CheckCircle, X } from 'lucide-react' 
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface VideoAccordionProps {
  sections: Array<{
    id: string
    title: string
    description?: string
    subtopics: Array<{
      id: string
      title: string
      status: string
      video_url: string | null
    }>
    quizzes?: Array<{
      id: string
      title?: string
      course_id?: string
      section_id?: string
    }>
    flashcards?: Array<{
      id: string
      front?: string
      back?: string
      course_id?: string
      section_id?: string
      index?: number
    }>
  }>
}

export const VideoAccordion: React.FC<VideoAccordionProps> = ({ sections }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const handleAccordionToggle = (sectionId: string) => {
    setOpenAccordion(openAccordion === sectionId ? null : sectionId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <Card key={section.id} className="overflow-hidden">
          {/* Section Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Section {sectionIndex + 1}: {section.title}
                </h3>
                {section.description && (
                  <span className="text-sm text-gray-500">- {section.description}</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {section.subtopics.length} lesson{section.subtopics.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAccordionToggle(section.id)}
                  className="flex items-center space-x-1"
                >
                  {openAccordion === section.id ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Close</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Open</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Video Content */}
          {openAccordion === section.id && (
            <div className="p-4">
              <div className="space-y-4">
                {section.subtopics.map((subtopic, subtopicIndex) => (
                  <div key={subtopic.id} className="space-y-3">
                    {/* Video Title */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(subtopic.status)}
                        <h4 className="text-lg font-medium text-gray-900">
                          {subtopicIndex + 1}. {subtopic.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtopic.status)}`}>
                          {subtopic.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Video Player */}
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        className="w-full h-auto"
                        controls
                        preload="metadata"
                        onLoadStart={() => console.log('Video loading started')}
                        onCanPlay={() => console.log('Video can play')}
                        onError={(e) => {
                          console.error('Video error:', e)
                          alert('Error loading video. Please check the video URL.')
                        }}
                      >
                        {subtopic.video_url ? (
                          <source src={subtopic.video_url} type="video/mp4" />
                        ) : null}
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
