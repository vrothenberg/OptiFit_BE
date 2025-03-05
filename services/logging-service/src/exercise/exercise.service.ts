import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExerciseLog, ExerciseType } from '../entities';
import { CreateExerciseLogDto, ExerciseLogDto, ExerciseTypeDto } from '@optifit/shared';
import { NotFoundError } from '@optifit/shared';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseLog)
    private exerciseLogRepository: Repository<ExerciseLog>,
    @InjectRepository(ExerciseType)
    private exerciseTypeRepository: Repository<ExerciseType>,
  ) {}

  async createExerciseLog(
    userId: string,
    createExerciseLogDto: CreateExerciseLogDto,
  ): Promise<ExerciseLogDto> {
    // Verify that the exercise type exists
    const exerciseType = await this.exerciseTypeRepository.findOne({
      where: { id: createExerciseLogDto.exerciseTypeId },
    });

    if (!exerciseType) {
      throw new NotFoundError('Exercise type not found');
    }

    const exerciseLog = this.exerciseLogRepository.create({
      userId,
      ...createExerciseLogDto,
      time: new Date(createExerciseLogDto.time),
    });

    const savedExerciseLog = await this.exerciseLogRepository.save(exerciseLog);
    return this.mapToExerciseLogDto(savedExerciseLog, exerciseType);
  }

  async getExerciseLogs(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ExerciseLogDto[]> {
    let whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        time: Between(new Date(startDate), new Date(endDate)),
      };
    }

    const exerciseLogs = await this.exerciseLogRepository.find({
      where: whereClause,
      relations: ['exerciseType'],
      order: { time: 'DESC' },
    });

    return exerciseLogs.map((log) =>
      this.mapToExerciseLogDto(log, log.exerciseType),
    );
  }

  async getExerciseLog(userId: string, logId: string): Promise<ExerciseLogDto> {
    const exerciseLog = await this.exerciseLogRepository.findOne({
      where: { id: logId, userId },
      relations: ['exerciseType'],
    });

    if (!exerciseLog) {
      throw new NotFoundError('Exercise log not found');
    }

    return this.mapToExerciseLogDto(exerciseLog, exerciseLog.exerciseType);
  }

  async updateExerciseLog(
    userId: string,
    logId: string,
    updateExerciseLogDto: Partial<CreateExerciseLogDto>,
  ): Promise<ExerciseLogDto> {
    const exerciseLog = await this.exerciseLogRepository.findOne({
      where: { id: logId, userId },
      relations: ['exerciseType'],
    });

    if (!exerciseLog) {
      throw new NotFoundError('Exercise log not found');
    }

    // If exercise type is being updated, verify it exists
    let exerciseType = exerciseLog.exerciseType;
    if (
      updateExerciseLogDto.exerciseTypeId &&
      updateExerciseLogDto.exerciseTypeId !== exerciseLog.exerciseTypeId
    ) {
      exerciseType = await this.exerciseTypeRepository.findOne({
        where: { id: updateExerciseLogDto.exerciseTypeId },
      });

      if (!exerciseType) {
        throw new NotFoundError('Exercise type not found');
      }
    }

    // Update time if provided
    if (updateExerciseLogDto.time) {
      updateExerciseLogDto.time = new Date(updateExerciseLogDto.time).toISOString();
    }

    // Update the exercise log
    Object.assign(exerciseLog, updateExerciseLogDto);

    const updatedExerciseLog = await this.exerciseLogRepository.save(exerciseLog);
    return this.mapToExerciseLogDto(updatedExerciseLog, exerciseType);
  }

  async deleteExerciseLog(userId: string, logId: string): Promise<void> {
    const result = await this.exerciseLogRepository.delete({
      id: logId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundError('Exercise log not found');
    }
  }

  async getExerciseTypes(): Promise<ExerciseTypeDto[]> {
    const exerciseTypes = await this.exerciseTypeRepository.find({
      order: { name: 'ASC' },
    });

    return exerciseTypes.map(this.mapToExerciseTypeDto);
  }

  private mapToExerciseLogDto(
    exerciseLog: ExerciseLog,
    exerciseType: ExerciseType,
  ): ExerciseLogDto {
    return {
      id: exerciseLog.id,
      userId: exerciseLog.userId,
      name: exerciseLog.name,
      exerciseTypeId: exerciseLog.exerciseTypeId,
      exerciseTypeName: exerciseType.name,
      time: exerciseLog.time.toISOString(),
      duration: exerciseLog.duration,
      calories: exerciseLog.calories,
      geolocation: exerciseLog.geolocation,
      createdAt: exerciseLog.createdAt.toISOString(),
    };
  }

  private mapToExerciseTypeDto(exerciseType: ExerciseType): ExerciseTypeDto {
    return {
      id: exerciseType.id,
      name: exerciseType.name,
      icon: exerciseType.icon,
      category: exerciseType.category,
      caloriesPerMinute: exerciseType.caloriesPerMinute,
    };
  }
}
