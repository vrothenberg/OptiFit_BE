import { CreateUserDto, LoginUserDto, UpdateUserDto, UserProfileDto } from '../dto';

export interface IUserService {
  register(createUserDto: CreateUserDto): Promise<{ token: string; user: UserProfileDto }>;
  login(loginUserDto: LoginUserDto): Promise<{ token: string; user: UserProfileDto }>;
  googleLogin(token: string): Promise<{ token: string; user: UserProfileDto }>;
  getProfile(userId: string): Promise<UserProfileDto>;
  updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfileDto>;
  getPreferences(userId: string): Promise<Record<string, any>>;
  updatePreferences(userId: string, preferences: Record<string, any>): Promise<Record<string, any>>;
  validateUser(userId: string): Promise<boolean>;
}

export const USER_SERVICE = 'USER_SERVICE';
