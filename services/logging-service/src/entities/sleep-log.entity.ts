import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('sleep_logs')
export class SleepLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('jsonb', { nullable: true })
  qualityData: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
