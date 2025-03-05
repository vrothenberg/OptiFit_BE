import { Connection, EntityManager } from 'typeorm';
import { createMockUser, createMockFoodLog, createMockExerciseLog, createMockSleepLog } from './mock-data';

/**
 * Seed database with test data
 * @param connection TypeORM connection
 */
export async function seedDatabase(connection: Connection): Promise<{
  users: any[];
  foodLogs: any[];
  exerciseLogs: any[];
  sleepLogs: any[];
}> {
  return await connection.transaction(async (entityManager: EntityManager) => {
    // Create test users
    const users = await seedUsers(entityManager, 3);
    
    // Create test food logs
    const foodLogs = await seedFoodLogs(entityManager, users[0].id, 5);
    
    // Create test exercise logs
    const exerciseLogs = await seedExerciseLogs(entityManager, users[0].id, 3);
    
    // Create test sleep logs
    const sleepLogs = await seedSleepLogs(entityManager, users[0].id, 7);
    
    return {
      users,
      foodLogs,
      exerciseLogs,
      sleepLogs,
    };
  });
}

/**
 * Seed users table with test data
 * @param entityManager TypeORM entity manager
 * @param count Number of users to create
 */
export async function seedUsers(entityManager: EntityManager, count: number = 1): Promise<any[]> {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const user = createMockUser();
    users.push(await entityManager.save('User', user));
  }
  
  return users;
}

/**
 * Seed food logs table with test data
 * @param entityManager TypeORM entity manager
 * @param userId User ID to associate with food logs
 * @param count Number of food logs to create
 */
export async function seedFoodLogs(entityManager: EntityManager, userId: string, count: number = 1): Promise<any[]> {
  const foodLogs = [];
  
  // Create food logs for different days
  for (let i = 0; i < count; i++) {
    const foodLog = createMockFoodLog(userId);
    
    // Set time to different days
    const date = new Date();
    date.setDate(date.getDate() - i);
    foodLog.time = date;
    
    foodLogs.push(await entityManager.save('FoodLog', foodLog));
  }
  
  return foodLogs;
}

/**
 * Seed exercise logs table with test data
 * @param entityManager TypeORM entity manager
 * @param userId User ID to associate with exercise logs
 * @param count Number of exercise logs to create
 */
export async function seedExerciseLogs(entityManager: EntityManager, userId: string, count: number = 1): Promise<any[]> {
  const exerciseLogs = [];
  
  // Create exercise logs for different days
  for (let i = 0; i < count; i++) {
    const exerciseLog = createMockExerciseLog(userId);
    
    // Set time to different days
    const date = new Date();
    date.setDate(date.getDate() - i);
    exerciseLog.time = date;
    
    // Alternate exercise types
    if (i % 3 === 0) {
      exerciseLog.name = 'Running';
      exerciseLog.calories = 300;
    } else if (i % 3 === 1) {
      exerciseLog.name = 'Swimming';
      exerciseLog.calories = 400;
    } else {
      exerciseLog.name = 'Cycling';
      exerciseLog.calories = 350;
    }
    
    exerciseLogs.push(await entityManager.save('ExerciseLog', exerciseLog));
  }
  
  return exerciseLogs;
}

/**
 * Seed sleep logs table with test data
 * @param entityManager TypeORM entity manager
 * @param userId User ID to associate with sleep logs
 * @param count Number of sleep logs to create
 */
export async function seedSleepLogs(entityManager: EntityManager, userId: string, count: number = 1): Promise<any[]> {
  const sleepLogs = [];
  
  // Create sleep logs for different days
  for (let i = 0; i < count; i++) {
    const sleepLog = createMockSleepLog(userId);
    
    // Set time to different days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - i);
    startDate.setHours(23, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(7, 0, 0, 0);
    
    sleepLog.startTime = startDate;
    sleepLog.endTime = endDate;
    
    // Vary sleep quality
    sleepLog.quality = 5 + (i % 5); // Quality between 5-9
    
    sleepLogs.push(await entityManager.save('SleepLog', sleepLog));
  }
  
  return sleepLogs;
}

/**
 * Clear all data from the database
 * @param connection TypeORM connection
 */
export async function clearDatabase(connection: Connection): Promise<void> {
  const entities = connection.entityMetadatas;
  
  for (const entity of entities) {
    const repository = connection.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
  }
}
