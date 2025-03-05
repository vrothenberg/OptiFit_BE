import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

// Food Logging DTOs
export class CreateFoodLogDto {
  @IsNotEmpty()
  @IsString()
  foodName: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  protein: number;

  @IsNotEmpty()
  @IsNumber()
  carbs: number;

  @IsNotEmpty()
  @IsNumber()
  fat: number;

  @IsNotEmpty()
  @IsDateString()
  time: string;

  @IsOptional()
  geolocation?: {
    latitude: number;
    longitude: number;
  };

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class FoodLogDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsString()
  foodName: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  carbs: number;

  @IsNumber()
  fat: number;

  @IsDateString()
  time: string;

  @IsOptional()
  geolocation?: {
    latitude: number;
    longitude: number;
  };

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsDateString()
  createdAt: string;
}

// Exercise Logging DTOs
export class CreateExerciseLogDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  exerciseTypeId: number;

  @IsNotEmpty()
  @IsDateString()
  time: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  calories: number;

  @IsOptional()
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

export class ExerciseLogDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsString()
  name: string;

  @IsNumber()
  exerciseTypeId: number;

  @IsString()
  exerciseTypeName: string;

  @IsDateString()
  time: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  calories: number;

  @IsOptional()
  geolocation?: {
    latitude: number;
    longitude: number;
  };

  @IsDateString()
  createdAt: string;
}

export class ExerciseTypeDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsString()
  category: string;

  @IsNumber()
  caloriesPerMinute: number;
}

// Sleep Logging DTOs
export class CreateSleepLogDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsOptional()
  qualityData?: Record<string, any>;
}

export class SleepLogDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  qualityData?: Record<string, any>;

  @IsDateString()
  createdAt: string;
}
