import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'system',
    comment: 'Interface theme: light, dark, or system',
  })
  interface_theme: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'en-US',
    comment: 'Interface language code (e.g., en-US, vi-VN)',
  })
  interface_language: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'en-US',
    comment: 'AI response language code (e.g., en-US, vi-VN)',
  })
  ai_language: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
