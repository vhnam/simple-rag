import { z } from 'zod';
import {
  DifficultyLevel,
  WeightCategory,
  VolumeProfile,
  AirflowRequirement,
  EmbouchureDifficulty,
  InstrumentFamily,
} from '../../entities/instrument.entity';

export const createInstrumentSchema = z.object({
  name: z.string().min(1, 'Instrument name cannot be empty').trim(),
  instrument_family: z.enum([
    InstrumentFamily.WOODWIND,
    InstrumentFamily.BRASS,
  ]),
  difficulty_level: z.enum([
    DifficultyLevel.BEGINNER,
    DifficultyLevel.INTERMEDIATE,
    DifficultyLevel.ADVANCED,
  ]),
  weight_category: z.enum([
    WeightCategory.LIGHT,
    WeightCategory.MEDIUM,
    WeightCategory.HEAVY,
  ]),
  volume_profile: z.enum([
    VolumeProfile.SOFT,
    VolumeProfile.MEDIUM,
    VolumeProfile.LOUD,
  ]),
  airflow_requirement: z.enum([
    AirflowRequirement.LOW,
    AirflowRequirement.MEDIUM,
    AirflowRequirement.HIGH,
  ]),
  embouchure_difficulty: z.enum([
    EmbouchureDifficulty.EASY,
    EmbouchureDifficulty.MEDIUM,
    EmbouchureDifficulty.HARD,
  ]),
  typical_price_min: z
    .number()
    .int('Price must be an integer')
    .min(0, 'Price cannot be negative'),
  typical_price_max: z
    .number()
    .int('Price must be an integer')
    .min(0, 'Price cannot be negative'),
  description: z.string().optional().nullable(),
  recommended_beginners: z.boolean().default(false),
});

export const createInstrumentResponseSchema = z.object({
  id: z.uuid('Invalid UUID format'),
  message: z.string(),
});

export type CreateInstrumentDto = z.infer<typeof createInstrumentSchema>;
export type CreateInstrumentResponseDto = z.infer<
  typeof createInstrumentResponseSchema
>;
