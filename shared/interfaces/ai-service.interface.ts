import {
  ChatRequestDto,
  ChatResponseDto,
  AnalyzeRequestDto,
  AnalyzeResponseDto,
  VoiceLogRequestDto,
  VoiceLogResponseDto,
  AIUsageDto,
} from '../dto';

export interface IAIService {
  chat(chatRequestDto: ChatRequestDto): Promise<ChatResponseDto>;
  analyze(analyzeRequestDto: AnalyzeRequestDto): Promise<AnalyzeResponseDto>;
  processVoiceLog(voiceLogRequestDto: VoiceLogRequestDto): Promise<VoiceLogResponseDto>;
  getUsage(userId: string): Promise<AIUsageDto>;
  resetUsage(userId: string): Promise<AIUsageDto>;
}

export const AI_SERVICE = 'AI_SERVICE';
