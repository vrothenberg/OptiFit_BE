import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserProfile } from './entity/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  // Create a new user and automatically create an associated profile.
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Extract password separately so we can map it to hashedPassword
    const { password, profile: profileData, ...userData } = createUserDto;
    // Create the user entity by mapping password to hashedPassword
    const newUser = this.userRepository.create({ ...userData, hashedPassword: password });
    const savedUser = await this.userRepository.save(newUser);

    // Create associated profile: merge the savedUser's id with any provided profile data
    const newProfile = this.profileRepository.create({
      userId: savedUser.id,
      ...profileData,
    });
    await this.profileRepository.save(newProfile);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  // PROFILE METHODS

  async getUserProfile(userId: number): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(`Profile not found for user id ${userId}`);
    }
    return profile;
  }

  async updateUserProfile(userId: number, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    let profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepository.create({ userId, ...updateUserProfileDto });
    } else {
      this.profileRepository.merge(profile, updateUserProfileDto);
    }
    return await this.profileRepository.save(profile);
  }
}
