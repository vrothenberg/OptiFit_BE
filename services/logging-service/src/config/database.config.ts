import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  FoodLog,
  ExerciseLog,
  ExerciseType,
  SleepLog,
  FoodCache,
} from '../entities';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'optifit_logs'),
  entities: [FoodLog, ExerciseLog, ExerciseType, SleepLog, FoodCache],
  synchronize: configService.get<boolean>('DB_SYNC', true),
  logging: configService.get<boolean>('DB_LOGGING', false),
});
