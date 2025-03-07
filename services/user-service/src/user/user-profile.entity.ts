import { Entity, PrimaryColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

const jsonType = process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb';

@Entity({ name: 'user_profiles' })
export class UserProfile {
  // Use user_id as both primary key and foreign key
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  // Define the owning side of the relation with @JoinColumn.
  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  @Column({ name: 'height_cm', type: 'numeric', precision: 5, scale: 2, nullable: true })
  heightCm?: number;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 6, scale: 2, nullable: true })
  weightKg?: number;

  @Column({ name: 'activity_level', type: 'varchar', length: 50, nullable: true })
  activityLevel?: string;

  @Column({ name: 'dietary_preferences', type: jsonType, nullable: true })
  dietaryPreferences?: any;

  @Column({ name: 'exercise_preferences', type: jsonType, nullable: true })
  exercisePreferences?: any;

  @Column({ name: 'medical_conditions', type: 'text', array: true, nullable: true })
  medicalConditions?: string[];

  @Column({ type: jsonType, nullable: true })
  supplements?: any;

  @Column({ name: 'sleep_patterns', type: jsonType, nullable: true })
  sleepPatterns?: any;

  @Column({ name: 'stress_level', type: 'integer', nullable: true })
  stressLevel?: number;

  @Column({ name: 'nutrition_info', type: jsonType, nullable: true })
  nutritionInfo?: any;

  @Column({ type: jsonType, nullable: true })
  location?: any;

  @Column({ name: 'additional_info', type: jsonType, nullable: true })
  additionalInfo?: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
