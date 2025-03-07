import { IsNotEmpty, IsString, IsOptional, IsJSON } from 'class-validator';

export class CreateUserActivityLogDto {
  @IsNotEmpty()
  @IsString()
  eventType: string;

  @IsOptional()
  @IsJSON()
  eventData?: any;
}
