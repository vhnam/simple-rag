import { z } from 'zod';

export const askInstrumentSchema = z
  .object({
    budget: z
      .string()
      .min(1, 'Budget is required')
      .refine(
        (val) => {
          const num = parseInt(val.replace(/[^\d]/g, ''), 10);
          return !isNaN(num) && num >= 0;
        },
        { message: 'Please enter a valid budget' },
      ),
    favoriteGenres: z
      .array(z.string())
      .min(1, 'Please select at least one genre')
      .max(5, 'Please select at most 5 genres'),
    airflowStrength: z
      .enum(['low', 'medium', 'high'])
      .describe('Please select airflow strength'),
    tonePreference: z
      .enum(['bright', 'warm', 'mellow', 'versatile'])
      .describe('Please select tone preference'),
    experienceLevel: z
      .enum(['beginner', 'intermediate', 'advanced'])
      .describe('Please select experience level'),
    playingEnvironment: z
      .enum(['home', 'studio', 'outdoor', 'concert'])
      .describe('Please select playing environment'),
    weightTolerance: z
      .enum(['light', 'medium', 'heavy'])
      .describe('Please select weight tolerance'),
  })
  .strict(); // Reject unknown fields

export type AskInstrumentDto = z.infer<typeof askInstrumentSchema>;
