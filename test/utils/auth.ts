import { JwtService } from '@nestjs/jwt';
import { createMockUser } from './mock-data';

/**
 * Creates a mock JWT token for testing
 * @param userId User ID to include in the token
 * @param secret JWT secret key
 * @returns JWT token string
 */
export const createMockJwtToken = (userId: string, secret: string = 'test_jwt_secret'): string => {
  const jwtService = new JwtService({
    secret,
    signOptions: { expiresIn: '1d' },
  });

  return jwtService.sign({ sub: userId });
};

/**
 * Creates mock authorization headers for testing
 * @param userId User ID to include in the token
 * @param secret JWT secret key
 * @returns Object with Authorization header
 */
export const createMockAuthHeaders = (userId: string, secret: string = 'test_jwt_secret'): { Authorization: string } => {
  const token = createMockJwtToken(userId, secret);
  return { Authorization: `Bearer ${token}` };
};

/**
 * Creates a mock authenticated user for testing
 * @returns Object with user and token
 */
export const createMockAuthUser = () => {
  const user = createMockUser();
  const token = createMockJwtToken(user.id);
  
  return {
    user,
    token,
    headers: { Authorization: `Bearer ${token}` },
  };
};
