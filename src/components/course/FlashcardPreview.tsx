'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface FlashcardPreviewProps {
  flashcards: Array<{
    id: string;
    front: string;
    back: string;
    course_id?: string;
    section_id?: string;
    index?: number;
  }>;
}

export const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({ flashcards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {flashcards.map((card) => (
        <Card key={card.id} className="p-4">
          <div className="space-y-2">
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-sm font-medium text-blue-800">Front:</p>
              <p className="text-sm">{card.front}</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="text-sm font-medium text-green-800">Back:</p>
              <p className="text-sm">{card.back}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
