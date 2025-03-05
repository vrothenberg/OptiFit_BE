import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFoodLogDto } from '@optifit/shared';

@Controller('food')
@UseGuards(JwtAuthGuard)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  async createFoodLog(@Request() req, @Body() createFoodLogDto: CreateFoodLogDto) {
    return this.foodService.createFoodLog(req.user.userId, createFoodLogDto);
  }

  @Get()
  async getFoodLogs(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.foodService.getFoodLogs(req.user.userId, startDate, endDate);
  }

  @Get(':id')
  async getFoodLog(@Request() req, @Param('id') id: string) {
    return this.foodService.getFoodLog(req.user.userId, id);
  }

  @Put(':id')
  async updateFoodLog(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFoodLogDto: Partial<CreateFoodLogDto>,
  ) {
    return this.foodService.updateFoodLog(req.user.userId, id, updateFoodLogDto);
  }

  @Delete(':id')
  async deleteFoodLog(@Request() req, @Param('id') id: string) {
    await this.foodService.deleteFoodLog(req.user.userId, id);
    return { message: 'Food log deleted successfully' };
  }

  @Get('search/:query')
  async searchFood(@Param('query') query: string) {
    return this.foodService.searchFood(query);
  }
}
