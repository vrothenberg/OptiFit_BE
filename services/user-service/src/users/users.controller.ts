import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from '@optifit/shared';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@Request() req, @Body() preferences: Record<string, any>) {
    return this.usersService.updatePreferences(req.user.userId, preferences);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateUser(@Request() req) {
    const isValid = await this.usersService.validateUser(req.user.userId);
    return { valid: isValid };
  }
}
