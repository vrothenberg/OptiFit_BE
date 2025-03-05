import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FoodModule } from './food/food.module';
import { ExerciseModule } from './exercise/exercise.module';
import { SleepModule } from './sleep/sleep.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    FoodModule,
    ExerciseModule,
    SleepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
