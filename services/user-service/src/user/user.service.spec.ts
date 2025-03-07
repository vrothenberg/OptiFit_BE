import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';

// Create simple mock repositories
const mockUserRepository = {
  create: jest.fn(dto => dto),
  save: jest.fn(dto => Promise.resolve({ id: 1, ...dto })),
  update: jest.fn(() => Promise.resolve({ affected: 1 })),
  findOne: jest.fn(({ where: { id } }) => Promise.resolve({ id, firstName: 'John', lastName: 'Doe' })),
  find: jest.fn(() => Promise.resolve([{ id: 1, firstName: 'John', lastName: 'Doe' }])),
  delete: jest.fn(() => Promise.resolve({ affected: 1 })),
};

const mockUserProfileRepository = {
  create: jest.fn(dto => dto),
  save: jest.fn(dto => Promise.resolve({ userId: 1, ...dto })),
  findOne: jest.fn(({ where: { userId } }) => Promise.resolve({ userId, gender: 'male', dateOfBirth: new Date('1990-01-01') })),
  merge: jest.fn((existing, dto) => Object.assign(existing, dto)),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(UserProfile), useValue: mockUserProfileRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add further tests for your service methods...
});
