import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { FoodLog, FoodCache } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoodLog, FoodCache]), AuthModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
