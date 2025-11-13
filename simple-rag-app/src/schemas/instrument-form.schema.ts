import { z } from 'zod';

export const instrumentFormSchema = z.object({
  budget: z
    .string()
    .min(1, 'Budget is required')
    .refine(
      (val) => {
        const num = parseInt(val.replace(/[^\d]/g, ''), 10);
        return !isNaN(num) && num >= 0;
      },
      { message: 'Please enter a valid budget' }
    ),
  favoriteGenres: z
    .array(z.string())
    .min(1, 'Please select at least one genre')
    .max(5, 'Please select at most 5 genres'),
  airflowStrength: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select airflow strength',
  }),
  tonePreference: z.enum(['bright', 'warm', 'mellow', 'versatile'], {
    required_error: 'Please select tone preference',
  }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Please select experience level',
  }),
  playingEnvironment: z.enum(['home', 'studio', 'outdoor', 'concert'], {
    required_error: 'Please select playing environment',
  }),
  weightTolerance: z.enum(['light', 'medium', 'heavy'], {
    required_error: 'Please select weight tolerance',
  }),
});

export type InstrumentFormSchema = z.infer<typeof instrumentFormSchema>;

