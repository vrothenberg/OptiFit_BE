import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

// Use 'simple-json' for tests (when NODE_ENV === 'test'), otherwise use PostgreSQL's 'jsonb'
const jsonType = process.env.NODE_ENV === 'test' ? 'simple-json' : 'jsonb';

@Entity({ name: 'user_activity_logs' })
export class UserActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'event_type', type: 'varchar', length: 100 })
  eventType: string;  // e.g., 'login', 'profile_update', 'questionnaire_submission'

  @Column({ name: 'event_data', type: jsonType, nullable: true })
  eventData?: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
