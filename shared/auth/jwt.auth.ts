import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  async decodeToken(token: string): Promise<JwtPayload> {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
