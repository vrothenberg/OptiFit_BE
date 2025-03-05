import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { createMockChatRequestDto } from '../../../test/utils/mock-data';
import { GeminiService } from '../src/gemini/gemini.service';

describe('AIService (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;
  let geminiService: GeminiService;
  let authToken: string;
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(GeminiService)
    .useValue({
      generateResponse: jest.fn().mockResolvedValue({
        message: 'How can I improve my sleep?',
        response: 'This is a mock AI response about improving sleep.',
      }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    geminiService = moduleFixture.get<GeminiService>(GeminiService);

    // Generate a JWT token for testing
    const payload = { sub: testUserId, email: 'test@example.com' };
    authToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello from the AI service!');
    });
  });

  describe('AppController (Chat)', () => {
    it('/api/chat (POST) - should generate AI response', async () => {
      const chatRequestDto = createMockChatRequestDto(testUserId);

      const response = await request(app.getHttpServer())
        .post('/api/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatRequestDto)
        .expect(201);

      expect(response.body).toHaveProperty('message', chatRequestDto.message);
      expect(response.body).toHaveProperty('response');
      expect(geminiService.generateResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: chatRequestDto.message,
          userId: testUserId,
        })
      );
    });

    it('/api/chat (POST) - should return 401 without auth token', async () => {
      const chatRequestDto = createMockChatRequestDto(testUserId);

      await request(app.getHttpServer())
        .post('/api/chat')
        .send(chatRequestDto)
        .expect(401);
    });

    it('/api/chat (POST) - should validate request body', async () => {
      const invalidChatRequestDto = {
        // Missing message field
        userId: testUserId,
      };

      await request(app.getHttpServer())
        .post('/api/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidChatRequestDto)
        .expect(400);
    });
  });
});
