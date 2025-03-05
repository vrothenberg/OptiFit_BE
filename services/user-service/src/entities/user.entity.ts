import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'int' })
  age: number;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  circadianQuestionnaire: Record<string, any>;

  @Column({ nullable: true })
  googleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
