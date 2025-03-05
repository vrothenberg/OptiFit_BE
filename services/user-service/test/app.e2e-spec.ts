import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import { createMockUser, createMockCreateUserDto, createMockLoginUserDto } from '../../test/utils/mock-data';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('UserService (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = createMockUser();
    testUser.password = hashedPassword;

    // Clear the repository and add the test user
    await userRepository.clear();
    await userRepository.save(testUser);

    // Generate a JWT token for the test user
    const payload = { sub: testUser.id, email: testUser.email };
    authToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await userRepository.clear();
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello from the User service!');
    });
  });

  describe('AuthController', () => {
    it('/api/auth/register (POST) - should register a new user', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(createUserDto.email);
      expect(response.body.user.name).toBe(createUserDto.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('/api/auth/login (POST) - should login and return token', async () => {
      const loginUserDto = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginUserDto)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('/api/auth/login (POST) - should return 401 with invalid credentials', async () => {
      const loginUserDto = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginUserDto)
        .expect(401);
    });
  });

  describe('UsersController', () => {
    it('/api/users/profile (GET) - should return user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body.email).toBe(testUser.email);
    });

    it('/api/users/profile (GET) - should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/profile')
        .expect(401);
    });

    it('/api/users/profile (PUT) - should update user profile', async () => {
      const updateUserDto = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe(updateUserDto.name);
    });

    it('/api/users/preferences (GET) - should return user preferences', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('/api/users/preferences (PUT) - should update user preferences', async () => {
      const preferences = {
        theme: 'dark',
        notifications: true,
      };

      const response = await request(app.getHttpServer())
        .put('/api/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(200);

      expect(response.body).toHaveProperty('theme');
      expect(response.body).toHaveProperty('notifications');
      expect(response.body.theme).toBe(preferences.theme);
      expect(response.body.notifications).toBe(preferences.notifications);
    });
  });
});
