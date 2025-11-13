import { z } from 'zod';
import {
  DifficultyLevel,
  WeightCategory,
  VolumeProfile,
  AirflowRequirement,
  EmbouchureDifficulty,
  InstrumentFamily,
} from '../../entities/instrument.entity';

export const getInstrumentsQuerySchema = z.object({
  search: z.string().optional(),
  instrument_family: z.enum(InstrumentFamily).optional(),
  difficulty_level: z.enum(DifficultyLevel).optional(),
  weight_category: z.enum(WeightCategory).optional(),
  volume_profile: z.enum(VolumeProfile).optional(),
  airflow_requirement: z.enum(AirflowRequirement).optional(),
  embouchure_difficulty: z.enum(EmbouchureDifficulty).optional(),
  recommended_beginners: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetInstrumentsQueryDto = z.infer<typeof getInstrumentsQuerySchema>;
