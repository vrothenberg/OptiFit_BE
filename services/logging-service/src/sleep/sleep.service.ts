import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SleepLog } from '../entities';
import { CreateSleepLogDto, SleepLogDto } from '@optifit/shared';
import { NotFoundError } from '@optifit/shared';

@Injectable()
export class SleepService {
  constructor(
    @InjectRepository(SleepLog)
    private sleepLogRepository: Repository<SleepLog>,
  ) {}

  async createSleepLog(
    userId: string,
    createSleepLogDto: CreateSleepLogDto,
  ): Promise<SleepLogDto> {
    const sleepLog = this.sleepLogRepository.create({
      userId,
      ...createSleepLogDto,
      startTime: new Date(createSleepLogDto.startTime),
      endTime: new Date(createSleepLogDto.endTime),
    });

    const savedSleepLog = await this.sleepLogRepository.save(sleepLog);
    return this.mapToSleepLogDto(savedSleepLog);
  }

  async getSleepLogs(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<SleepLogDto[]> {
    let whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        startTime: Between(new Date(startDate), new Date(endDate)),
      };
    }

    const sleepLogs = await this.sleepLogRepository.find({
      where: whereClause,
      order: { startTime: 'DESC' },
    });

    return sleepLogs.map(this.mapToSleepLogDto);
  }

  async getSleepLog(userId: string, logId: string): Promise<SleepLogDto> {
    const sleepLog = await this.sleepLogRepository.findOne({
      where: { id: logId, userId },
    });

    if (!sleepLog) {
      throw new NotFoundError('Sleep log not found');
    }

    return this.mapToSleepLogDto(sleepLog);
  }

  async updateSleepLog(
    userId: string,
    logId: string,
    updateSleepLogDto: Partial<CreateSleepLogDto>,
  ): Promise<SleepLogDto> {
    const sleepLog = await this.sleepLogRepository.findOne({
      where: { id: logId, userId },
    });

    if (!sleepLog) {
      throw new NotFoundError('Sleep log not found');
    }

    // Update times if provided
    if (updateSleepLogDto.startTime) {
      updateSleepLogDto.startTime = new Date(updateSleepLogDto.startTime).toISOString();
    }
    if (updateSleepLogDto.endTime) {
      updateSleepLogDto.endTime = new Date(updateSleepLogDto.endTime).toISOString();
    }

    // Update the sleep log
    Object.assign(sleepLog, updateSleepLogDto);

    const updatedSleepLog = await this.sleepLogRepository.save(sleepLog);
    return this.mapToSleepLogDto(updatedSleepLog);
  }

  async deleteSleepLog(userId: string, logId: string): Promise<void> {
    const result = await this.sleepLogRepository.delete({
      id: logId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundError('Sleep log not found');
    }
  }

  private mapToSleepLogDto(sleepLog: SleepLog): SleepLogDto {
    return {
      id: sleepLog.id,
      userId: sleepLog.userId,
      startTime: sleepLog.startTime.toISOString(),
      endTime: sleepLog.endTime.toISOString(),
      qualityData: sleepLog.qualityData,
      createdAt: sleepLog.createdAt.toISOString(),
    };
  }
}
