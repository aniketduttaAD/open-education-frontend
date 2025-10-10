import { z } from 'zod';

export const generateRoadmapSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Course description must be at least 10 characters')
    .max(500, 'Course description must be less than 500 characters')
    .describe('Describe the course content and learning objectives'),
  
  level: z
    .string()
    .refine((val) => !val || ['beginner', 'intermediate', 'advanced'].includes(val), {
      message: 'Please select a valid skill level'
    })
    .optional(),
  
  durationWeeks: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 104;
    }, {
      message: 'Duration must be between 1 and 104 weeks'
    }),
  
  weeklyCommitmentHours: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 80;
    }, {
      message: 'Weekly commitment must be between 1 and 80 hours'
    }),
  
  techStackPrefs: z
    .string()
    .optional(),
  
  constraints: z
    .array(z.string())
    .optional(),
});

export const editRoadmapSchema = z.object({
  roadmapId: z.string().min(1, 'Roadmap ID is required'),
  changes: z.array(z.object({
    op: z.enum(['rm-main', 'add-main', 'up-main', 'add-sub', 'rm-sub', 'up-sub']),
    id: z.string().optional(),
    query: z.string().optional()
  })).min(1, 'At least one change is required')
});

export const finalizeRoadmapSchema = z.object({
  id: z.string().min(1, 'Roadmap ID is required')
});

export type GenerateRoadmapFormData = z.infer<typeof generateRoadmapSchema>;
export type EditRoadmapFormData = z.infer<typeof editRoadmapSchema>;
export type FinalizeRoadmapFormData = z.infer<typeof finalizeRoadmapSchema>;
