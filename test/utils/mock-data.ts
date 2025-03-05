// Using a simple UUID generator since we don't need to install uuid package for tests
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Creates a mock user for testing
 * @returns Mock user object
 */
export const createMockUser = () => {
  const id = uuidv4();
  
  return {
    id,
    email: `user-${id.substring(0, 8)}@example.com`,
    name: 'Test User',
    location: 'Test City',
    phone: '555-123-4567',
    age: 30,
    password: 'Password123!',
    googleId: '',
    preferences: {
      darkMode: false,
      notifications: true,
      units: 'metric',
    },
    circadianQuestionnaire: {
      sleepTime: '23:00',
      wakeTime: '07:00',
      chronotype: 'intermediate',
      energyLevels: [3, 4, 5, 4, 3, 2, 1],
      mealTimes: ['07:30', '12:30', '18:30'],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Creates a mock food log for testing
 * @param logId Optional ID for the food log
 * @param userId Optional user ID to associate with the food log
 * @returns Mock food log object
 */
export const createMockFoodLog = (logId?: string, userId?: string) => {
  return {
    id: logId || uuidv4(),
    userId: userId || uuidv4(),
    foodName: 'Apple',
    amount: 1,
    unit: 'serving',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    time: new Date(),
    geolocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    imageUrl: 'https://example.com/apple.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Creates a mock exercise log for testing
 * @param logId Optional ID for the exercise log
 * @param userId Optional user ID to associate with the exercise log
 * @returns Mock exercise log object
 */
export const createMockExerciseLog = (logId?: string, userId?: string) => {
  return {
    id: logId || uuidv4(),
    userId: userId || uuidv4(),
    name: 'Running',
    duration: 30,
    intensity: 'moderate',
    calories: 300,
    time: new Date(),
    geolocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Creates a mock sleep log for testing
 * @param logId Optional ID for the sleep log
 * @param userId Optional user ID to associate with the sleep log
 * @returns Mock sleep log object
 */
export const createMockSleepLog = (logId?: string, userId?: string) => {
  const startTime = new Date();
  startTime.setHours(23, 0, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setDate(endTime.getDate() + 1);
  endTime.setHours(7, 0, 0, 0);
  
  return {
    id: logId || uuidv4(),
    userId: userId || uuidv4(),
    startTime,
    endTime,
    quality: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Creates a mock create user DTO for testing
 * @returns Mock create user DTO object
 */
export const createMockCreateUserDto = () => {
  return {
    email: `user-${uuidv4().substring(0, 8)}@example.com`,
    password: 'Password123!',
    name: 'Test User',
    location: 'Test City',
    phone: '555-123-4567',
    age: 30,
  };
};

/**
 * Creates a mock login user DTO for testing
 * @returns Mock login user DTO object
 */
export const createMockLoginUserDto = () => {
  return {
    email: `user-${uuidv4().substring(0, 8)}@example.com`,
    password: 'Password123!',
  };
};

/**
 * Creates a mock update user DTO for testing
 * @returns Mock update user DTO object
 */
export const createMockUpdateUserDto = () => {
  return {
    name: 'Updated User',
    location: 'Updated City',
    phone: '555-987-6543',
    age: 31,
  };
};

/**
 * Creates a mock create food log DTO for testing
 * @returns Mock create food log DTO object
 */
export const createMockCreateFoodLogDto = () => {
  return {
    foodName: 'Apple',
    amount: 1,
    unit: 'serving',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    time: new Date().toISOString(),
    geolocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    imageUrl: 'https://example.com/apple.jpg',
  };
};

/**
 * Creates a mock create exercise log DTO for testing
 * @returns Mock create exercise log DTO object
 */
export const createMockCreateExerciseLogDto = () => {
  return {
    name: 'Running',
    duration: 30,
    intensity: 'moderate',
    calories: 300,
    time: new Date().toISOString(),
    geolocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  };
};

/**
 * Creates a mock create sleep log DTO for testing
 * @returns Mock create sleep log DTO object
 */
export const createMockCreateSleepLogDto = () => {
  const startTime = new Date();
  startTime.setHours(23, 0, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setDate(endTime.getDate() + 1);
  endTime.setHours(7, 0, 0, 0);
  
  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    quality: 8,
  };
};

/**
 * Creates a mock chat request DTO for testing
 * @returns Mock chat request DTO object
 */
export const createMockChatRequestDto = () => {
  return {
    message: 'How can I improve my sleep?',
    userId: uuidv4(),
  };
};

/**
 * Creates a mock chat response DTO for testing
 * @param request Chat request DTO
 * @returns Mock chat response DTO object
 */
export const createMockChatResponseDto = (request: any) => {
  return {
    message: request.message,
    response: 'This is a mock AI response about improving sleep quality.',
  };
};
