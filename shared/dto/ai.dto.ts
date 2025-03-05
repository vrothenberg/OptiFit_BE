import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class ChatResponseDto {
  message: string;
  response: string;
}

export class AnalyzeRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class AnalyzeResponseDto {
  recommendations: string[];
  insights: Record<string, any>;
}

export class VoiceLogRequestDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  voiceText: string;

  @IsOptional()
  @IsString()
  logType?: 'food' | 'exercise';
}

export class VoiceLogResponseDto {
  success: boolean;
  logId?: string;
  message: string;
  parsedData?: Record<string, any>;
}

export class AIUsageDto {
  userId: string;
  requestCount: number;
  lastReset: string;
  limit: number;
  remaining: number;
}
