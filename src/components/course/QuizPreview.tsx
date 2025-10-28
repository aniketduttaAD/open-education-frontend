'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface QuizPreviewProps {
  quiz: {
    id: string;
    title: string;
    course_id?: string;
    section_id?: string;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct_index: number;
      index: number;
    }>;
  };
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-2">{quiz.title}</h4>
      <div className="space-y-2">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="p-2 bg-gray-50 rounded">
            <p className="font-medium">{index + 1}. {question.question}</p>
            <div className="ml-4 space-y-1">
              {question.options.map((option, optIndex) => (
                <p key={optIndex} className={`text-sm ${
                  optIndex === question.correct_index ? 'text-green-600 font-medium' : 'text-gray-600'
                }`}>
                  {String.fromCharCode(65 + optIndex)}. {option}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
