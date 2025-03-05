import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('food_logs')
export class FoodLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  foodName: string;

  @Column('float')
  amount: number;

  @Column('float')
  protein: number;

  @Column('float')
  carbs: number;

  @Column('float')
  fat: number;

  @Column()
  time: Date;

  @Column('jsonb', { nullable: true })
  geolocation: {
    latitude: number;
    longitude: number;
  };

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
