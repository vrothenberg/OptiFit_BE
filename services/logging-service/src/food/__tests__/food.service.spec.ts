import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FoodService } from '../food.service';
import { FoodLog, FoodCache } from '../../entities';
import { NotFoundError } from '@optifit/shared';
import { createMockFoodLog, createMockCreateFoodLogDto } from '../../../../../test/utils/mock-data';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('FoodService', () => {
  let foodService: FoodService;
  let foodLogRepository: Repository<FoodLog>;
  let foodCacheRepository: Repository<FoodCache>;
  let configService: ConfigService;

  const mockEdamamResponse = {
    data: {
      hints: [
        {
          food: {
            label: 'Apple',
            nutrients: {
              ENERC_KCAL: 52,
              PROCNT: 0.26,
              FAT: 0.17,
              CHOCDF: 13.81,
              FIBTG: 2.4,
            },
          },
        },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: getRepositoryToken(FoodLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FoodCache),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'EDAMAM_APP_ID') return 'test-app-id';
              if (key === 'EDAMAM_APP_KEY') return 'test-app-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    foodService = module.get<FoodService>(FoodService);
    foodLogRepository = module.get<Repository<FoodLog>>(getRepositoryToken(FoodLog));
    foodCacheRepository = module.get<Repository<FoodCache>>(getRepositoryToken(FoodCache));
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFoodLog', () => {
    it('should create and return a food log', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createFoodLogDto = createMockCreateFoodLogDto();
      const mockFoodLog = createMockFoodLog();

      jest.spyOn(foodLogRepository, 'create').mockReturnValue(mockFoodLog);
      jest.spyOn(foodLogRepository, 'save').mockResolvedValue(mockFoodLog);

      const result = await foodService.createFoodLog(userId, createFoodLogDto);

      expect(foodLogRepository.create).toHaveBeenCalledWith({
        userId,
        ...createFoodLogDto,
        time: expect.any(Date),
      });
      expect(foodLogRepository.save).toHaveBeenCalledWith(mockFoodLog);
      expect(result).toEqual({
        id: mockFoodLog.id,
        userId: mockFoodLog.userId,
        foodName: mockFoodLog.foodName,
        amount: mockFoodLog.amount,
        protein: mockFoodLog.protein,
        carbs: mockFoodLog.carbs,
        fat: mockFoodLog.fat,
        time: mockFoodLog.time.toISOString(),
        geolocation: mockFoodLog.geolocation,
        imageUrl: mockFoodLog.imageUrl,
        createdAt: mockFoodLog.createdAt.toISOString(),
      });
    });
  });

  describe('getFoodLogs', () => {
    it('should return all food logs for a user', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFoodLogs = [createMockFoodLog(), createMockFoodLog()];

      jest.spyOn(foodLogRepository, 'find').mockResolvedValue(mockFoodLogs);

      const result = await foodService.getFoodLogs(userId);

      expect(foodLogRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { time: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockFoodLogs[0].id,
        userId: mockFoodLogs[0].userId,
        foodName: mockFoodLogs[0].foodName,
        amount: mockFoodLogs[0].amount,
        protein: mockFoodLogs[0].protein,
        carbs: mockFoodLogs[0].carbs,
        fat: mockFoodLogs[0].fat,
        time: mockFoodLogs[0].time.toISOString(),
        geolocation: mockFoodLogs[0].geolocation,
        imageUrl: mockFoodLogs[0].imageUrl,
        createdAt: mockFoodLogs[0].createdAt.toISOString(),
      });
    });

    it('should filter food logs by date range', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const mockFoodLogs = [createMockFoodLog()];

      jest.spyOn(foodLogRepository, 'find').mockResolvedValue(mockFoodLogs);

      const result = await foodService.getFoodLogs(userId, startDate, endDate);

      expect(foodLogRepository.find).toHaveBeenCalledWith({
        where: {
          userId,
          time: Between(new Date(startDate), new Date(endDate)),
        },
        order: { time: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getFoodLog', () => {
    it('should return a specific food log', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = '123e4567-e89b-12d3-a456-426614174001';
      const mockFoodLog = createMockFoodLog(logId, userId);

      jest.spyOn(foodLogRepository, 'findOne').mockResolvedValue(mockFoodLog);

      const result = await foodService.getFoodLog(userId, logId);

      expect(foodLogRepository.findOne).toHaveBeenCalledWith({
        where: { id: logId, userId },
      });
      expect(result).toEqual({
        id: mockFoodLog.id,
        userId: mockFoodLog.userId,
        foodName: mockFoodLog.foodName,
        amount: mockFoodLog.amount,
        protein: mockFoodLog.protein,
        carbs: mockFoodLog.carbs,
        fat: mockFoodLog.fat,
        time: mockFoodLog.time.toISOString(),
        geolocation: mockFoodLog.geolocation,
        imageUrl: mockFoodLog.imageUrl,
        createdAt: mockFoodLog.createdAt.toISOString(),
      });
    });

    it('should throw NotFoundError when food log does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = 'nonexistent-id';

      jest.spyOn(foodLogRepository, 'findOne').mockResolvedValue(null);

      await expect(foodService.getFoodLog(userId, logId)).rejects.toThrow(NotFoundError);

      expect(foodLogRepository.findOne).toHaveBeenCalledWith({
        where: { id: logId, userId },
      });
    });
  });

  describe('updateFoodLog', () => {
    it('should update and return a food log', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = '123e4567-e89b-12d3-a456-426614174001';
      const mockFoodLog = createMockFoodLog(logId, userId);
      const updateFoodLogDto = {
        foodName: 'Banana',
        amount: 2,
        protein: 1.0,
        carbs: 30,
        fat: 0.5,
      };

      const updatedFoodLog = {
        ...mockFoodLog,
        ...updateFoodLogDto,
      };

      jest.spyOn(foodLogRepository, 'findOne').mockResolvedValue(mockFoodLog);
      jest.spyOn(foodLogRepository, 'save').mockResolvedValue(updatedFoodLog);

      const result = await foodService.updateFoodLog(userId, logId, updateFoodLogDto);

      expect(foodLogRepository.findOne).toHaveBeenCalledWith({
        where: { id: logId, userId },
      });
      expect(foodLogRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockFoodLog,
        ...updateFoodLogDto,
      }));
      expect(result).toEqual({
        id: updatedFoodLog.id,
        userId: updatedFoodLog.userId,
        foodName: updatedFoodLog.foodName,
        amount: updatedFoodLog.amount,
        protein: updatedFoodLog.protein,
        carbs: updatedFoodLog.carbs,
        fat: updatedFoodLog.fat,
        time: updatedFoodLog.time.toISOString(),
        geolocation: updatedFoodLog.geolocation,
        imageUrl: updatedFoodLog.imageUrl,
        createdAt: updatedFoodLog.createdAt.toISOString(),
      });
    });

    it('should throw NotFoundError when food log does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = 'nonexistent-id';
      const updateFoodLogDto = {
        foodName: 'Banana',
      };

      jest.spyOn(foodLogRepository, 'findOne').mockResolvedValue(null);

      await expect(foodService.updateFoodLog(userId, logId, updateFoodLogDto)).rejects.toThrow(NotFoundError);

      expect(foodLogRepository.findOne).toHaveBeenCalledWith({
        where: { id: logId, userId },
      });
      expect(foodLogRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteFoodLog', () => {
    it('should delete a food log', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = '123e4567-e89b-12d3-a456-426614174001';

      jest.spyOn(foodLogRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await foodService.deleteFoodLog(userId, logId);

      expect(foodLogRepository.delete).toHaveBeenCalledWith({
        id: logId,
        userId,
      });
    });

    it('should throw NotFoundError when food log does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const logId = 'nonexistent-id';

      jest.spyOn(foodLogRepository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(foodService.deleteFoodLog(userId, logId)).rejects.toThrow(NotFoundError);

      expect(foodLogRepository.delete).toHaveBeenCalledWith({
        id: logId,
        userId,
      });
    });
  });

  describe('searchFood', () => {
    it('should return cached results when available', async () => {
      const query = 'apple';
      const cachedResults = {
        id: 'mock-cache-id',
        foodName: query,
        nutritionData: mockEdamamResponse.data,
        cachedAt: new Date()
      };

      jest.spyOn(foodCacheRepository, 'findOne').mockResolvedValue(cachedResults as FoodCache);

      const result = await foodService.searchFood(query);

      expect(foodCacheRepository.findOne).toHaveBeenCalledWith({
        where: { foodName: query },
      });
      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockEdamamResponse.data);
    });

    it('should call Edamam API and cache results when not in cache', async () => {
      const query = 'apple';
      const mockAxiosGet = jest.spyOn(axios, 'get').mockResolvedValue(mockEdamamResponse);
      const mockFoodCache = {
        id: 'mock-cache-id',
        foodName: query,
        nutritionData: mockEdamamResponse.data,
        cachedAt: new Date()
      };

      jest.spyOn(foodCacheRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(foodCacheRepository, 'create').mockReturnValue(mockFoodCache);
      jest.spyOn(foodCacheRepository, 'save').mockResolvedValue(mockFoodCache);
      jest.spyOn(configService, 'get');

      const result = await foodService.searchFood(query);

      expect(foodCacheRepository.findOne).toHaveBeenCalledWith({
        where: { foodName: query },
      });
      expect(configService.get).toHaveBeenCalledWith('EDAMAM_APP_ID');
      expect(configService.get).toHaveBeenCalledWith('EDAMAM_APP_KEY');
      expect(mockAxiosGet).toHaveBeenCalledWith('https://api.edamam.com/api/food-database/v2/parser', {
        params: {
          app_id: 'test-app-id',
          app_key: 'test-app-key',
          ingr: query,
        },
      });
      expect(foodCacheRepository.create).toHaveBeenCalledWith({
        foodName: query,
        nutritionData: mockEdamamResponse.data,
      });
      expect(foodCacheRepository.save).toHaveBeenCalledWith(mockFoodCache);
      expect(result).toEqual(mockEdamamResponse.data);
    });

    it('should handle Edamam API errors', async () => {
      const query = 'apple';
      const error = new Error('API error');
      (error as any).isAxiosError = true;

      jest.spyOn(foodCacheRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(axios, 'get').mockRejectedValue(error);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(foodService.searchFood(query)).rejects.toThrow('Edamam API error: API error');

      expect(foodCacheRepository.findOne).toHaveBeenCalledWith({
        where: { foodName: query },
      });
      expect(foodCacheRepository.create).not.toHaveBeenCalled();
      expect(foodCacheRepository.save).not.toHaveBeenCalled();
    });
  });
});
