import {
  CreateFoodLogDto,
  CreateExerciseLogDto,
  CreateSleepLogDto,
  FoodLogDto,
  ExerciseLogDto,
  SleepLogDto,
  ExerciseTypeDto,
} from '../dto';

export interface ILoggingService {
  // Food logs
  createFoodLog(userId: string, createFoodLogDto: CreateFoodLogDto): Promise<FoodLogDto>;
  getFoodLogs(userId: string, startDate?: string, endDate?: string): Promise<FoodLogDto[]>;
  getFoodLog(userId: string, logId: string): Promise<FoodLogDto>;
  updateFoodLog(userId: string, logId: string, updateFoodLogDto: Partial<CreateFoodLogDto>): Promise<FoodLogDto>;
  deleteFoodLog(userId: string, logId: string): Promise<void>;
  searchFood(query: string): Promise<any[]>; // Returns Edamam API results or cached results

  // Exercise logs
  createExerciseLog(userId: string, createExerciseLogDto: CreateExerciseLogDto): Promise<ExerciseLogDto>;
  getExerciseLogs(userId: string, startDate?: string, endDate?: string): Promise<ExerciseLogDto[]>;
  getExerciseLog(userId: string, logId: string): Promise<ExerciseLogDto>;
  updateExerciseLog(userId: string, logId: string, updateExerciseLogDto: Partial<CreateExerciseLogDto>): Promise<ExerciseLogDto>;
  deleteExerciseLog(userId: string, logId: string): Promise<void>;
  getExerciseTypes(): Promise<ExerciseTypeDto[]>;

  // Sleep logs
  createSleepLog(userId: string, createSleepLogDto: CreateSleepLogDto): Promise<SleepLogDto>;
  getSleepLogs(userId: string, startDate?: string, endDate?: string): Promise<SleepLogDto[]>;
  getSleepLog(userId: string, logId: string): Promise<SleepLogDto>;
  updateSleepLog(userId: string, logId: string, updateSleepLogDto: Partial<CreateSleepLogDto>): Promise<SleepLogDto>;
  deleteSleepLog(userId: string, logId: string): Promise<void>;
}

export const LOGGING_SERVICE = 'LOGGING_SERVICE';
