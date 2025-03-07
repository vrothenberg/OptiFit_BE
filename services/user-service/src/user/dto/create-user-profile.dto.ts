import { IsOptional, IsDateString, IsString, IsNumber, IsInt, IsJSON, IsArray } from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsJSON()
  dietaryPreferences?: any;

  @IsOptional()
  @IsJSON()
  exercisePreferences?: any;

  @IsOptional()
  @IsArray()
  medicalConditions?: string[];

  @IsOptional()
  @IsJSON()
  supplements?: any;

  @IsOptional()
  @IsJSON()
  sleepPatterns?: any;

  @IsOptional()
  @IsInt()
  stressLevel?: number;

  @IsOptional()
  @IsJSON()
  nutritionInfo?: any;

  @IsOptional()
  @IsJSON()
  location?: any;

  @IsOptional()
  @IsJSON()
  additionalInfo?: any;
}
