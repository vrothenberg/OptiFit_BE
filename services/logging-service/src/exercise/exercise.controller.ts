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
import { ExerciseService } from './exercise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExerciseLogDto } from '@optifit/shared';

@Controller('exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async createExerciseLog(
    @Request() req,
    @Body() createExerciseLogDto: CreateExerciseLogDto,
  ) {
    return this.exerciseService.createExerciseLog(
      req.user.userId,
      createExerciseLogDto,
    );
  }

  @Get()
  async getExerciseLogs(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.exerciseService.getExerciseLogs(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  @Get('types')
  async getExerciseTypes() {
    return this.exerciseService.getExerciseTypes();
  }

  @Get(':id')
  async getExerciseLog(@Request() req, @Param('id') id: string) {
    return this.exerciseService.getExerciseLog(req.user.userId, id);
  }

  @Put(':id')
  async updateExerciseLog(
    @Request() req,
    @Param('id') id: string,
    @Body() updateExerciseLogDto: Partial<CreateExerciseLogDto>,
  ) {
    return this.exerciseService.updateExerciseLog(
      req.user.userId,
      id,
      updateExerciseLogDto,
    );
  }

  @Delete(':id')
  async deleteExerciseLog(@Request() req, @Param('id') id: string) {
    await this.exerciseService.deleteExerciseLog(req.user.userId, id);
    return { message: 'Exercise log deleted successfully' };
  }
}
