import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;  // Changed from "name" to "firstName"

  @IsString()
  @IsNotEmpty()
  lastName: string;   // New field for last name

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Optional nested profile data for initial signup
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile?: CreateUserProfileDto;
}
