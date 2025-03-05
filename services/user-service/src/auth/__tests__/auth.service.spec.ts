import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { User } from '../../entities/user.entity';
import { createMockUser, createMockCreateUserDto, createMockLoginUserDto } from '../../../../../test/utils/mock-data';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = createMockUser();
      const { password, ...result } = mockUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = await authService.validateUser('test@example.com', 'password123');
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ['id', 'email', 'password', 'name'],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(user).toEqual(result);
    });

    it('should return null when credentials are invalid', async () => {
      const mockUser = createMockUser();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const user = await authService.validateUser('test@example.com', 'wrongpassword');
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: ['id', 'email', 'password', 'name'],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(user).toBeNull();
    });

    it('should return null when user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const user = await authService.validateUser('nonexistent@example.com', 'password123');
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
        select: ['id', 'email', 'password', 'name'],
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return token and user when credentials are valid', async () => {
      const mockUser = createMockUser();
      const loginUserDto = createMockLoginUserDto();
      const { password, ...userResult } = mockUser;

      jest.spyOn(authService, 'validateUser').mockResolvedValue(userResult);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await authService.login(loginUserDto);
      
      expect(authService.validateUser).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        token: 'test-token',
        user: userResult,
      });
    });

    it('should throw error when credentials are invalid', async () => {
      const loginUserDto = createMockLoginUserDto();

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow('Invalid credentials');
      
      expect(authService.validateUser).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
      expect(userRepository.findOne).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a new user and return token and user', async () => {
      const createUserDto = createMockCreateUserDto();
      const mockUser = createMockUser();
      const { password, ...userResult } = mockUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await authService.register(createUserDto);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        token: 'test-token',
        user: userResult,
      });
    });

    it('should throw error when user with email already exists', async () => {
      const createUserDto = createMockCreateUserDto();
      const mockUser = createMockUser();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(authService.register(createUserDto)).rejects.toThrow('User with this email already exists');
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('googleLogin', () => {
    it('should return token and user for existing Google user', async () => {
      const googleUser = {
        googleId: 'google123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const mockUser = createMockUser();
      const { password, ...userResult } = mockUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await authService.googleLogin(googleUser);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { googleId: googleUser.googleId },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        token: 'test-token',
        user: userResult,
      });
    });

    it('should update existing user with Google ID when email matches', async () => {
      const googleUser = {
        googleId: 'google123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const mockUser = createMockUser();
      mockUser.googleId = '' as any;
      const updatedUser = { ...mockUser, googleId: googleUser.googleId };
      const { password, ...userResult } = updatedUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await authService.googleLogin(googleUser);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { googleId: googleUser.googleId },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: googleUser.email },
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: updatedUser.id,
        email: updatedUser.email,
      });
      expect(result).toEqual({
        token: 'test-token',
        user: userResult,
      });
    });

    it('should create new user when Google ID and email do not match existing users', async () => {
      const googleUser = {
        googleId: 'google123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const mockUser = createMockUser();
      const { password, ...userResult } = mockUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const result = await authService.googleLogin(googleUser);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { googleId: googleUser.googleId },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: googleUser.email },
      });
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        token: 'test-token',
        user: userResult,
      });
    });
  });
});
