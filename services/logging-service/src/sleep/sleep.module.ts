import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SleepController } from './sleep.controller';
import { SleepService } from './sleep.service';
import { SleepLog } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SleepLog]), AuthModule],
  controllers: [SleepController],
  providers: [SleepService],
  exports: [SleepService],
})
export class SleepModule {}
