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
import { SleepService } from './sleep.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSleepLogDto } from '@optifit/shared';

@Controller('sleep')
@UseGuards(JwtAuthGuard)
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Post()
  async createSleepLog(
    @Request() req,
    @Body() createSleepLogDto: CreateSleepLogDto,
  ) {
    return this.sleepService.createSleepLog(
      req.user.userId,
      createSleepLogDto,
    );
  }

  @Get()
  async getSleepLogs(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.sleepService.getSleepLogs(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async getSleepLog(@Request() req, @Param('id') id: string) {
    return this.sleepService.getSleepLog(req.user.userId, id);
  }

  @Put(':id')
  async updateSleepLog(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSleepLogDto: Partial<CreateSleepLogDto>,
  ) {
    return this.sleepService.updateSleepLog(
      req.user.userId,
      id,
      updateSleepLogDto,
    );
  }

  @Delete(':id')
  async deleteSleepLog(@Request() req, @Param('id') id: string) {
    await this.sleepService.deleteSleepLog(req.user.userId, id);
    return { message: 'Sleep log deleted successfully' };
  }
}
