import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../../entities/user.entity';
import { NotFoundError } from '@optifit/shared';
import { createMockUser, createMockUpdateUserDto } from '../../../../../test/utils/mock-data';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      const mockUser = createMockUser();
      const { password, ...userProfile } = mockUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await usersService.getProfile(mockUser.id);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(userProfile);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.getProfile('nonexistent-id')).rejects.toThrow(NotFoundError);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const mockUser = createMockUser();
      const updateUserDto = createMockUpdateUserDto();
      
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };
      
      const { password, ...userProfile } = updatedUser;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updateProfile(mockUser.id, updateUserDto);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockUser,
        ...updateUserDto,
      }));
      expect(result).toEqual(userProfile);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const updateUserDto = createMockUpdateUserDto();
      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.updateProfile('nonexistent-id', updateUserDto)).rejects.toThrow(NotFoundError);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getPreferences', () => {
    it('should return user preferences', async () => {
      const mockUser = createMockUser();
      const preferences = { darkMode: false, notifications: true, units: 'metric' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: mockUser.id,
        preferences,
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
        location: mockUser.location,
        phone: mockUser.phone || '',
        age: mockUser.age || 0,
        circadianQuestionnaire: mockUser.circadianQuestionnaire || {},
        googleId: mockUser.googleId,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      } as User);

      const result = await usersService.getPreferences(mockUser.id);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: ['id', 'preferences'],
      });
      expect(result).toEqual(preferences);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.getPreferences('nonexistent-id')).rejects.toThrow(NotFoundError);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
        select: ['id', 'preferences'],
      });
    });

    it('should return empty object when preferences are null', async () => {
      const mockUser = createMockUser();
      mockUser.preferences = {} as any;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: mockUser.id,
        preferences: {} as any,
        email: mockUser.email,
        name: mockUser.name,
        password: mockUser.password,
        location: mockUser.location,
        phone: mockUser.phone || '',
        age: mockUser.age || 0,
        circadianQuestionnaire: mockUser.circadianQuestionnaire || {},
        googleId: mockUser.googleId,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt
      } as User);

      const result = await usersService.getPreferences(mockUser.id);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: ['id', 'preferences'],
      });
      expect(result).toEqual({});
    });
  });

  describe('updatePreferences', () => {
    it('should merge and return updated preferences', async () => {
      const mockUser = createMockUser();
      const existingPreferences = { darkMode: false, notifications: true, units: 'metric' };
      const newPreferences = { darkMode: true, language: 'en' };
      const mergedPreferences = { darkMode: true, notifications: true, units: 'metric', language: 'en' };
      
      mockUser.preferences = existingPreferences;
      
      const updatedUser = {
        ...mockUser,
        preferences: mergedPreferences,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updatePreferences(mockUser.id, newPreferences);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockUser,
        preferences: mergedPreferences,
      }));
      expect(result).toEqual(mergedPreferences);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      const newPreferences = { darkMode: true };
      
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.updatePreferences('nonexistent-id', newPreferences)).rejects.toThrow(NotFoundError);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should initialize preferences when they are null', async () => {
      const mockUser = createMockUser();
      mockUser.preferences = {} as any;
      
      const newPreferences = { darkMode: true };
      
      const updatedUser = {
        ...mockUser,
        preferences: newPreferences,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updatePreferences(mockUser.id, newPreferences);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockUser,
        preferences: newPreferences,
      }));
      expect(result).toEqual(newPreferences);
    });
  });

  describe('validateUser', () => {
    it('should return true when user exists', async () => {
      const mockUser = createMockUser();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id: mockUser.id } as User);

      const result = await usersService.validateUser(mockUser.id);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: ['id'],
      });
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.validateUser('nonexistent-id');
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
        select: ['id'],
      });
      expect(result).toBe(false);
    });
  });
});
