import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('food_cache')
export class FoodCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  foodName: string;

  @Column('jsonb')
  nutritionData: Record<string, any>;

  @CreateDateColumn()
  cachedAt: Date;
}
