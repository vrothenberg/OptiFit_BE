import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExerciseType } from './exercise-type.entity';

@Entity('exercise_logs')
export class ExerciseLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  exerciseTypeId: number;

  @ManyToOne(() => ExerciseType)
  @JoinColumn({ name: 'exerciseTypeId' })
  exerciseType: ExerciseType;

  @Column()
  time: Date;

  @Column('int')
  duration: number;

  @Column('float')
  calories: number;

  @Column('jsonb', { nullable: true })
  geolocation: {
    latitude: number;
    longitude: number;
  };

  @CreateDateColumn()
  createdAt: Date;
}
