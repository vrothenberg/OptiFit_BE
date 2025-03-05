import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { GeminiService } from './gemini';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ChatRequestDto, ChatResponseDto, VoiceLogRequestDto, VoiceLogResponseDto, AnalyzeRequestDto, AnalyzeResponseDto } from '@optifit/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly geminiService: GeminiService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'ai-service',
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async getChatResponse(@Body() chatRequest: ChatRequestDto, @Request() req): Promise<ChatResponseDto> {
    // Add the user ID from the JWT token if not provided
    if (!chatRequest.userId) {
      chatRequest.userId = req.user.userId;
    }
    
    return this.geminiService.generateResponse(chatRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('analyze')
  async analyzeUserData(@Body() analyzeRequest: AnalyzeRequestDto): Promise<AnalyzeResponseDto> {
    // This would analyze user data and provide insights
    // For now, return a placeholder response
    return {
      recommendations: [
        'Consider eating more protein-rich foods in the morning',
        'Try to exercise during daylight hours for better circadian rhythm',
        'Aim for consistent sleep and wake times',
      ],
      insights: {
        sleepQuality: 'Good',
        nutritionBalance: 'Needs improvement',
        activityLevel: 'Moderate',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('voice-log')
  async processVoiceLog(@Body() voiceLogRequest: VoiceLogRequestDto): Promise<VoiceLogResponseDto> {
    // This would process voice input and create appropriate logs
    // For now, return a placeholder response
    return {
      success: true,
      logId: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Voice log processed successfully',
      parsedData: {
        type: voiceLogRequest.logType || 'food',
        text: voiceLogRequest.voiceText,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
