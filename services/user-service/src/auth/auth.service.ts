import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto, LoginUserDto, UserProfileDto } from '@optifit/shared';
import { JwtPayload } from '@optifit/shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: UserProfileDto }> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const fullUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (!fullUser) {
      throw new Error('User not found');
    }

    return {
      token: this.generateToken(user),
      user: this.mapToUserProfile(fullUser),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<{ token: string; user: UserProfileDto }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    return {
      token: this.generateToken(savedUser),
      user: this.mapToUserProfile(savedUser),
    };
  }

  async googleLogin(googleUser: any): Promise<{ token: string; user: UserProfileDto }> {
    let user = await this.usersRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      // Check if user exists with the same email
      user = await this.usersRepository.findOne({
        where: { email: googleUser.email },
      });

      if (user) {
        // Update existing user with Google ID
        user.googleId = googleUser.googleId;
        await this.usersRepository.save(user);
      } else {
        // Create new user
        const newUser = this.usersRepository.create({
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          googleId: googleUser.googleId,
          // Generate a random password for Google users
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        });

        user = await this.usersRepository.save(newUser);
      }
    }

    return {
      token: this.generateToken(user),
      user: this.mapToUserProfile(user),
    };
  }

  private generateToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    
    return this.jwtService.sign(payload);
  }

  private mapToUserProfile(user: User): UserProfileDto {
    const { password, ...userProfile } = user;
    return userProfile as UserProfileDto;
  }
}
