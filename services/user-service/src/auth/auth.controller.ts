import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '@optifit/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // This route initiates the Google OAuth flow
    // The actual implementation is handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Request() req) {
    return this.authService.googleLogin(req.user);
  }
}
