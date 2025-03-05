import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { FoodLog, FoodCache } from '../entities';
import { CreateFoodLogDto, FoodLogDto } from '@optifit/shared';
import { NotFoundError } from '@optifit/shared';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FoodService {
  private readonly edamamApiUrl: string;
  private readonly edamamAppId: string | undefined;
  private readonly edamamAppKey: string | undefined;

  constructor(
    @InjectRepository(FoodLog)
    private foodLogRepository: Repository<FoodLog>,
    @InjectRepository(FoodCache)
    private foodCacheRepository: Repository<FoodCache>,
    private configService: ConfigService,
  ) {
    this.edamamApiUrl = 'https://api.edamam.com/api/food-database/v2/parser';
    this.edamamAppId = this.configService.get<string>('EDAMAM_APP_ID');
    this.edamamAppKey = this.configService.get<string>('EDAMAM_APP_KEY');
  }

  async createFoodLog(
    userId: string,
    createFoodLogDto: CreateFoodLogDto,
  ): Promise<FoodLogDto> {
    const foodLog = this.foodLogRepository.create({
      userId,
      ...createFoodLogDto,
      time: new Date(createFoodLogDto.time),
    });

    const savedFoodLog = await this.foodLogRepository.save(foodLog);
    return this.mapToFoodLogDto(savedFoodLog);
  }

  async getFoodLogs(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<FoodLogDto[]> {
    let whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        time: Between(new Date(startDate), new Date(endDate)),
      };
    }

    const foodLogs = await this.foodLogRepository.find({
      where: whereClause,
      order: { time: 'DESC' },
    });

    return foodLogs.map(this.mapToFoodLogDto);
  }

  async getFoodLog(userId: string, logId: string): Promise<FoodLogDto> {
    const foodLog = await this.foodLogRepository.findOne({
      where: { id: logId, userId },
    });

    if (!foodLog) {
      throw new NotFoundError('Food log not found');
    }

    return this.mapToFoodLogDto(foodLog);
  }

  async updateFoodLog(
    userId: string,
    logId: string,
    updateFoodLogDto: Partial<CreateFoodLogDto>,
  ): Promise<FoodLogDto> {
    const foodLog = await this.foodLogRepository.findOne({
      where: { id: logId, userId },
    });

    if (!foodLog) {
      throw new NotFoundError('Food log not found');
    }

    // Update time if provided
    if (updateFoodLogDto.time) {
      updateFoodLogDto.time = new Date(updateFoodLogDto.time).toISOString();
    }

    // Update the food log
    Object.assign(foodLog, updateFoodLogDto);

    const updatedFoodLog = await this.foodLogRepository.save(foodLog);
    return this.mapToFoodLogDto(updatedFoodLog);
  }

  async deleteFoodLog(userId: string, logId: string): Promise<void> {
    const result = await this.foodLogRepository.delete({
      id: logId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundError('Food log not found');
    }
  }

  async searchFood(query: string): Promise<any> {
    // First, check the cache
    const cachedResults = await this.foodCacheRepository.findOne({
      where: { foodName: query },
    });

    if (cachedResults) {
      return cachedResults.nutritionData;
    }

    // If not in cache, call Edamam API
    try {
      const response = await axios.get(this.edamamApiUrl, {
        params: {
          app_id: this.edamamAppId,
          app_key: this.edamamAppKey,
          ingr: query,
        },
      });

      // Cache the results
      const foodCache = this.foodCacheRepository.create({
        foodName: query,
        nutritionData: response.data,
      });
      await this.foodCacheRepository.save(foodCache);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Edamam API error: ${error.message}`);
      }
      throw error;
    }
  }

  private mapToFoodLogDto(foodLog: FoodLog): FoodLogDto {
    return {
      id: foodLog.id,
      userId: foodLog.userId,
      foodName: foodLog.foodName,
      amount: foodLog.amount,
      protein: foodLog.protein,
      carbs: foodLog.carbs,
      fat: foodLog.fat,
      time: foodLog.time.toISOString(),
      geolocation: foodLog.geolocation,
      imageUrl: foodLog.imageUrl,
      createdAt: foodLog.createdAt.toISOString(),
    };
  }
}
