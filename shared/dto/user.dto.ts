import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UserProfileDto {
  id: string;
  name: string;
  email: string;
  location?: string;
  phone?: string;
  preferences?: Record<string, any>;
  circadianQuestionnaire?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
