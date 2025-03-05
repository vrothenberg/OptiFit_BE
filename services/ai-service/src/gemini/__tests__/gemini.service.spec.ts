import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../gemini.service';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createMockChatRequestDto } from '../../../../../test/utils/mock-data';

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('GeminiService', () => {
  let geminiService: GeminiService;
  let configService: ConfigService;
  let mockGenerativeModel: any;
  let mockGoogleGenerativeAI: any;

  beforeEach(async () => {
    // Create mock for the generative model
    mockGenerativeModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('This is a mock AI response'),
        },
      }),
    };

    // Create mock for GoogleGenerativeAI
    mockGoogleGenerativeAI = {
      getGenerativeModel: jest.fn().mockReturnValue(mockGenerativeModel),
    };

    // Mock the GoogleGenerativeAI constructor
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockGoogleGenerativeAI);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return 'test-api-key';
              if (key === 'GEMINI_MODEL') return 'gemini-1.5-flash';
              return null;
            }),
          },
        },
      ],
    }).compile();

    geminiService = module.get<GeminiService>(GeminiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with API key from config', () => {
      expect(configService.get).toHaveBeenCalledWith('GEMINI_API_KEY');
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
    });

    it('should throw error when API key is not defined', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      
      expect(() => {
        new GeminiService(configService);
      }).toThrow('GEMINI_API_KEY is not defined in environment variables');
    });
  });

  describe('generateResponse', () => {
    it('should generate AI response', async () => {
      const chatRequestDto = createMockChatRequestDto();
      
      const result = await geminiService.generateResponse(chatRequestDto);
      
      expect(mockGoogleGenerativeAI.getGenerativeModel).toHaveBeenCalledWith({
        model: 'gemini-1.5-flash',
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
      
      expect(mockGenerativeModel.generateContent).toHaveBeenCalled();
      expect(result).toEqual({
        message: chatRequestDto.message,
        response: 'This is a mock AI response',
      });
    });

    it('should handle errors from Gemini API', async () => {
      const chatRequestDto = createMockChatRequestDto();
      const error = new Error('API error');
      
      mockGenerativeModel.generateContent.mockRejectedValue(error);
      
      await expect(geminiService.generateResponse(chatRequestDto)).rejects.toThrow('Failed to generate AI response: API error');
      
      expect(mockGenerativeModel.generateContent).toHaveBeenCalled();
    });
  });

  describe('createContextualPrompt', () => {
    it('should format prompt with user context', () => {
      const prompt = 'How can I improve my sleep?';
      const userContext = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        age: 30,
        weight: 70,
        height: 175,
        activityLevel: 'Moderate',
        goals: ['Improve sleep', 'Lose weight'],
        dietaryRestrictions: ['Vegetarian'],
        recentFoodLogs: [
          {
            foodName: 'Apple',
            amount: 1,
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            time: new Date().toISOString(),
          },
        ],
        recentExerciseLogs: [
          {
            name: 'Running',
            duration: 30,
            calories: 300,
            time: new Date().toISOString(),
          },
        ],
        recentSleepLogs: [
          {
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            quality: 8,
          },
        ],
      };

      // Use private method through any type casting
      const result = (geminiService as any).createContextualPrompt(prompt, userContext);
      
      expect(result).toContain('USER CONTEXT:');
      expect(result).toContain('User ID: 123e4567-e89b-12d3-a456-426614174000');
      expect(result).toContain('Name: Test User');
      expect(result).toContain('Age: 30');
      expect(result).toContain('Weight: 70');
      expect(result).toContain('Height: 175');
      expect(result).toContain('Activity Level: Moderate');
      expect(result).toContain('Goals: Improve sleep, Lose weight');
      expect(result).toContain('Dietary Restrictions: Vegetarian');
      expect(result).toContain('Recent Food Logs:');
      expect(result).toContain('Recent Exercise Logs:');
      expect(result).toContain('Recent Sleep Logs:');
      expect(result).toContain('USER QUERY: How can I improve my sleep?');
    });

    it('should handle missing user context fields', () => {
      const prompt = 'How can I improve my sleep?';
      const userContext = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      // Use private method through any type casting
      const result = (geminiService as any).createContextualPrompt(prompt, userContext);
      
      expect(result).toContain('USER CONTEXT:');
      expect(result).toContain('User ID: 123e4567-e89b-12d3-a456-426614174000');
      expect(result).toContain('Name: Unknown');
      expect(result).toContain('Age: Unknown');
      expect(result).toContain('Weight: Unknown');
      expect(result).toContain('Height: Unknown');
      expect(result).toContain('Activity Level: Unknown');
      expect(result).toContain('Goals: Unknown');
      expect(result).toContain('Dietary Restrictions: None');
      expect(result).toContain('Recent Food Logs: No recent food logs available.');
      expect(result).toContain('Recent Exercise Logs: No recent exercise logs available.');
      expect(result).toContain('Recent Sleep Logs: No recent sleep logs available.');
      expect(result).toContain('USER QUERY: How can I improve my sleep?');
    });
  });

  describe('formatFoodLogs', () => {
    it('should format food logs correctly', () => {
      const foodLogs = [
        {
          foodName: 'Apple',
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          time: new Date().toISOString(),
        },
      ];

      // Use private method through any type casting
      const result = (geminiService as any).formatFoodLogs(foodLogs);
      
      expect(result).toContain('Apple (Protein: 0.5g, Carbs: 25g, Fat: 0.3g)');
    });

    it('should handle empty food logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatFoodLogs([]);
      
      expect(result).toBe('No recent food logs available.');
    });

    it('should handle undefined food logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatFoodLogs(undefined);
      
      expect(result).toBe('No recent food logs available.');
    });
  });

  describe('formatExerciseLogs', () => {
    it('should format exercise logs correctly', () => {
      const exerciseLogs = [
        {
          name: 'Running',
          duration: 30,
          calories: 300,
          time: new Date().toISOString(),
        },
      ];

      // Use private method through any type casting
      const result = (geminiService as any).formatExerciseLogs(exerciseLogs);
      
      expect(result).toContain('Running (Duration: 30 minutes, Calories: 300)');
    });

    it('should handle empty exercise logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatExerciseLogs([]);
      
      expect(result).toBe('No recent exercise logs available.');
    });

    it('should handle undefined exercise logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatExerciseLogs(undefined);
      
      expect(result).toBe('No recent exercise logs available.');
    });
  });

  describe('formatSleepLogs', () => {
    it('should format sleep logs correctly', () => {
      const startTime = new Date();
      startTime.setHours(22, 0, 0, 0); // 10:00 PM
      
      const endTime = new Date();
      endTime.setHours(6, 0, 0, 0); // 6:00 AM
      
      const sleepLogs = [
        {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      ];

      // Use private method through any type casting
      const result = (geminiService as any).formatSleepLogs(sleepLogs);
      
      expect(result).toContain('Sleep from');
      expect(result).toContain('hours');
    });

    it('should handle empty sleep logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatSleepLogs([]);
      
      expect(result).toBe('No recent sleep logs available.');
    });

    it('should handle undefined sleep logs', () => {
      // Use private method through any type casting
      const result = (geminiService as any).formatSleepLogs(undefined);
      
      expect(result).toBe('No recent sleep logs available.');
    });
  });
});
