import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ChatRequestDto, ChatResponseDto } from '@optifit/shared';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.configService.get<string>('GEMINI_MODEL', 'gemini-1.5-flash');
  }

  async generateResponse(
    promptDto: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    try {
      const { message: prompt, userId } = promptDto;
      
      // Fetch user context from database or other service
      const userContext = { userId };
      
      // Create a context-aware prompt
      const contextualPrompt = this.createContextualPrompt(prompt, userContext);
      
      // Configure the model
      const generativeModel = this.genAI.getGenerativeModel({
        model: this.model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Generate content
      const result = await generativeModel.generateContent(contextualPrompt);
      const response = result.response;
      const text = response.text();

      return {
        message: prompt,
        response: text,
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  private createContextualPrompt(prompt: string, userContext: any): string {
    // Create a system prompt with user context
    const systemPrompt = `
You are OptiFit's AI wellness assistant, specializing in circadian rhythm optimization, nutrition, and exercise advice.
Your goal is to provide personalized, science-based guidance to help users improve their health.

USER CONTEXT:
- User ID: ${userContext.userId}
- Name: ${userContext.name || 'Unknown'}
- Age: ${userContext.age || 'Unknown'}
- Weight: ${userContext.weight || 'Unknown'}
- Height: ${userContext.height || 'Unknown'}
- Activity Level: ${userContext.activityLevel || 'Unknown'}
- Goals: ${userContext.goals?.join(', ') || 'Unknown'}
- Dietary Restrictions: ${userContext.dietaryRestrictions?.join(', ') || 'None'}

Recent Food Logs: ${this.formatFoodLogs(userContext.recentFoodLogs)}
Recent Exercise Logs: ${this.formatExerciseLogs(userContext.recentExerciseLogs)}
Recent Sleep Logs: ${this.formatSleepLogs(userContext.recentSleepLogs)}

Based on this information, provide helpful, personalized advice. Focus on circadian rhythm optimization, nutrition timing, and exercise recommendations.
Be conversational but concise. Avoid giving medical advice or making definitive health claims.

USER QUERY: ${prompt}
`;

    return systemPrompt;
  }

  private formatFoodLogs(foodLogs: any[] = []): string {
    if (!foodLogs || foodLogs.length === 0) {
      return 'No recent food logs available.';
    }

    return foodLogs
      .map(
        (log) =>
          `- ${new Date(log.time).toLocaleString()}: ${log.foodName} (Protein: ${
            log.protein
          }g, Carbs: ${log.carbs}g, Fat: ${log.fat}g)`,
      )
      .join('\n');
  }

  private formatExerciseLogs(exerciseLogs: any[] = []): string {
    if (!exerciseLogs || exerciseLogs.length === 0) {
      return 'No recent exercise logs available.';
    }

    return exerciseLogs
      .map(
        (log) =>
          `- ${new Date(log.time).toLocaleString()}: ${
            log.name
          } (Duration: ${log.duration} minutes, Calories: ${log.calories})`,
      )
      .join('\n');
  }

  private formatSleepLogs(sleepLogs: any[] = []): string {
    if (!sleepLogs || sleepLogs.length === 0) {
      return 'No recent sleep logs available.';
    }

    return sleepLogs
      .map((log) => {
        const startTime = new Date(log.startTime);
        const endTime = new Date(log.endTime);
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;

        return `- ${startTime.toLocaleDateString()}: Sleep from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()} (${durationHours} hours)`;
      })
      .join('\n');
  }
}
