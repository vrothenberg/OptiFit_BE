import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodLog, ExerciseLog, SleepLog } from '../src/entities';
import { createMockFoodLog, createMockExerciseLog, createMockSleepLog, createMockCreateFoodLogDto, createMockCreateExerciseLogDto, createMockCreateSleepLogDto } from '../../../test/utils/mock-data';
import { JwtService } from '@nestjs/jwt';

describe('LoggingService (e2e)', () => {
  let app: INestApplication<App>;
  let foodLogRepository: Repository<FoodLog>;
  let exerciseLogRepository: Repository<ExerciseLog>;
  let sleepLogRepository: Repository<SleepLog>;
  let jwtService: JwtService;
  let authToken: string;
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    foodLogRepository = moduleFixture.get<Repository<FoodLog>>(getRepositoryToken(FoodLog));
    exerciseLogRepository = moduleFixture.get<Repository<ExerciseLog>>(getRepositoryToken(ExerciseLog));
    sleepLogRepository = moduleFixture.get<Repository<SleepLog>>(getRepositoryToken(SleepLog));
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Clear the repositories
    await foodLogRepository.clear();
    await exerciseLogRepository.clear();
    await sleepLogRepository.clear();

    // Generate a JWT token for testing
    const payload = { sub: testUserId, email: 'test@example.com' };
    authToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await foodLogRepository.clear();
    await exerciseLogRepository.clear();
    await sleepLogRepository.clear();
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello from the logging service!');
    });
  });

  describe('FoodController', () => {
    it('/api/food (POST) - should create a food log', async () => {
      const createFoodLogDto = createMockCreateFoodLogDto();

      const response = await request(app.getHttpServer())
        .post('/api/food')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createFoodLogDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty('foodName', createFoodLogDto.foodName);
      expect(response.body).toHaveProperty('amount', createFoodLogDto.amount);
      expect(response.body).toHaveProperty('protein', createFoodLogDto.protein);
      expect(response.body).toHaveProperty('carbs', createFoodLogDto.carbs);
      expect(response.body).toHaveProperty('fat', createFoodLogDto.fat);
    });

    it('/api/food (GET) - should return food logs', async () => {
      const foodLog = createMockFoodLog(undefined, testUserId);
      await foodLogRepository.save(foodLog);

      const response = await request(app.getHttpServer())
        .get('/api/food')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('userId', testUserId);
      expect(response.body[0]).toHaveProperty('foodName');
    });

    it('/api/food/:id (GET) - should return a specific food log', async () => {
      const foodLog = createMockFoodLog(undefined, testUserId);
      const savedFoodLog = await foodLogRepository.save(foodLog);

      const response = await request(app.getHttpServer())
        .get(`/api/food/${savedFoodLog.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', savedFoodLog.id);
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty('foodName', savedFoodLog.foodName);
    });

    it('/api/food/:id (PUT) - should update a food log', async () => {
      const foodLog = createMockFoodLog(undefined, testUserId);
      const savedFoodLog = await foodLogRepository.save(foodLog);

      const updateData = {
        foodName: 'Updated Food',
        amount: 2,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/food/${savedFoodLog.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', savedFoodLog.id);
      expect(response.body).toHaveProperty('foodName', updateData.foodName);
      expect(response.body).toHaveProperty('amount', updateData.amount);
    });

    it('/api/food/:id (DELETE) - should delete a food log', async () => {
      const foodLog = createMockFoodLog(undefined, testUserId);
      const savedFoodLog = await foodLogRepository.save(foodLog);

      await request(app.getHttpServer())
        .delete(`/api/food/${savedFoodLog.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedLog = await foodLogRepository.findOne({
        where: { id: savedFoodLog.id },
      });
      expect(deletedLog).toBeNull();
    });

    it('/api/food/search (GET) - should search for food', async () => {
      await request(app.getHttpServer())
        .get('/api/food/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ query: 'apple' })
        .expect(200);
    });
  });

  describe('ExerciseController', () => {
    it('/api/exercise (POST) - should create an exercise log', async () => {
      const createExerciseLogDto = createMockCreateExerciseLogDto();

      const response = await request(app.getHttpServer())
        .post('/api/exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createExerciseLogDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty('name', createExerciseLogDto.name);
      expect(response.body).toHaveProperty('duration', createExerciseLogDto.duration);
      expect(response.body).toHaveProperty('calories', createExerciseLogDto.calories);
    });

    it('/api/exercise (GET) - should return exercise logs', async () => {
      const exerciseLog = createMockExerciseLog(undefined, testUserId);
      await exerciseLogRepository.save(exerciseLog);

      const response = await request(app.getHttpServer())
        .get('/api/exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('userId', testUserId);
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('SleepController', () => {
    it('/api/sleep (POST) - should create a sleep log', async () => {
      const createSleepLogDto = createMockCreateSleepLogDto();

      const response = await request(app.getHttpServer())
        .post('/api/sleep')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSleepLogDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty('startTime');
      expect(response.body).toHaveProperty('endTime');
    });

    it('/api/sleep (GET) - should return sleep logs', async () => {
      const sleepLog = createMockSleepLog(undefined, testUserId);
      await sleepLogRepository.save(sleepLog);

      const response = await request(app.getHttpServer())
        .get('/api/sleep')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('userId', testUserId);
      expect(response.body[0]).toHaveProperty('startTime');
      expect(response.body[0]).toHaveProperty('endTime');
    });
  });
});
