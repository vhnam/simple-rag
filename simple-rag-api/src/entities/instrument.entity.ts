import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InstrumentFamily {
  WOODWIND = 'woodwind',
  BRASS = 'brass',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum WeightCategory {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

export enum VolumeProfile {
  SOFT = 'soft',
  MEDIUM = 'medium',
  LOUD = 'loud',
}

export enum AirflowRequirement {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum EmbouchureDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  family: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
  })
  difficulty_level: DifficultyLevel;

  @Column({
    type: 'enum',
    enum: WeightCategory,
  })
  weight_category: WeightCategory;

  @Column({
    type: 'enum',
    enum: VolumeProfile,
  })
  volume_profile: VolumeProfile;

  @Column({
    type: 'enum',
    enum: AirflowRequirement,
  })
  airflow_requirement: AirflowRequirement;

  @Column({
    type: 'enum',
    enum: EmbouchureDifficulty,
  })
  embouchure_difficulty: EmbouchureDifficulty;

  @Column({ type: 'integer' })
  typical_price_min: number;

  @Column({ type: 'integer' })
  typical_price_max: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  recommended_beginners: boolean;

  @Column({ type: 'vector', nullable: true })
  embedding?: number[] | Buffer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
