import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UserProfileDto } from '@optifit/shared';
import { IUserService } from '@optifit/shared';
import { NotFoundError } from '@optifit/shared';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: any): Promise<any> {
    // This is handled by AuthService
    throw new Error('Method not implemented in UsersService');
  }

  async login(loginUserDto: any): Promise<any> {
    // This is handled by AuthService
    throw new Error('Method not implemented in UsersService');
  }

  async googleLogin(token: string): Promise<any> {
    // This is handled by AuthService
    throw new Error('Method not implemented in UsersService');
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password, ...userProfile } = user;
    return userProfile as UserProfileDto;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);
    const { password, ...userProfile } = updatedUser;
    return userProfile as UserProfileDto;
  }

  async getPreferences(userId: string): Promise<Record<string, any>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'preferences'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.preferences || {};
  }

  async updatePreferences(userId: string, preferences: Record<string, any>): Promise<Record<string, any>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Merge existing preferences with new ones
    user.preferences = {
      ...(user.preferences || {}),
      ...preferences,
    };

    const updatedUser = await this.usersRepository.save(user);
    return updatedUser.preferences;
  }

  async validateUser(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });

    return !!user;
  }
}
