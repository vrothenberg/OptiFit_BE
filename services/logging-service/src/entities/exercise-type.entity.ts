import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exercise_types')
export class ExerciseType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  category: string;

  @Column('float')
  caloriesPerMinute: number;
}
