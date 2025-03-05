import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from '../gemini.service';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createMockChatRequestDto } from '../../../../../test/utils/mock-data';

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('GeminiService Parameterized Tests', () => {
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

  // Example of parameterized tests using test.each
  describe('formatFoodLogs', () => {
    // Define test cases as an array of [testName, input, expected] tuples
    test.each([
      [
        'formats food logs correctly',
        [
          {
            foodName: 'Apple',
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            time: new Date().toISOString(),
          },
        ],
        expect.stringContaining('Apple (Protein: 0.5g, Carbs: 25g, Fat: 0.3g)'),
      ],
      [
        'handles empty food logs',
        [],
        'No recent food logs available.',
      ],
      [
        'handles undefined food logs',
        undefined,
        'No recent food logs available.',
      ],
      [
        'formats multiple food logs correctly',
        [
          {
            foodName: 'Apple',
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            time: new Date().toISOString(),
          },
          {
            foodName: 'Banana',
            protein: 1.1,
            carbs: 23,
            fat: 0.3,
            time: new Date().toISOString(),
          },
        ],
        (result: string) => {
          expect(result).toContain('Apple (Protein: 0.5g, Carbs: 25g, Fat: 0.3g)');
          expect(result).toContain('Banana (Protein: 1.1g, Carbs: 23g, Fat: 0.3g)');
          return true;
        },
      ],
    ])('%s', (testName, input, expected) => {
      // Use private method through any type casting
      const result = (geminiService as any).formatFoodLogs(input);
      
      if (typeof expected === 'function') {
        expect(expected(result)).toBe(true);
      } else {
        expect(result).toEqual(expected);
      }
    });
  });

  // Example of parameterized tests for error handling
  describe('error handling', () => {
    // Define test cases for different error scenarios
    test.each([
      [
        'handles API error',
        new Error('API error'),
        'Failed to generate AI response: API error',
      ],
      [
        'handles network error',
        new Error('Network error: Failed to fetch'),
        'Failed to generate AI response: Network error: Failed to fetch',
      ],
      [
        'handles authentication error',
        new Error('Invalid API key'),
        'Failed to generate AI response: Invalid API key',
      ],
      [
        'handles rate limit error',
        new Error('Rate limit exceeded'),
        'Failed to generate AI response: Rate limit exceeded',
      ],
    ])('%s', async (testName, error, expectedErrorMessage) => {
      const chatRequestDto = createMockChatRequestDto();
      
      mockGenerativeModel.generateContent.mockRejectedValue(error);
      
      await expect(geminiService.generateResponse(chatRequestDto)).rejects.toThrow(expectedErrorMessage);
      
      expect(mockGenerativeModel.generateContent).toHaveBeenCalled();
    });
  });
});
