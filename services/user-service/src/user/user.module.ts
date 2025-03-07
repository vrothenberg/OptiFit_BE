import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UserActivityLog } from './user-activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, UserActivityLog])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
