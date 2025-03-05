import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { ExerciseLog, ExerciseType } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseLog, ExerciseType]), AuthModule],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
