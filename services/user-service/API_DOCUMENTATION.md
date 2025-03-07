# User Service API Documentation

## Introduction

The User Service API provides endpoints for managing user accounts, profiles, and activity logs in the OptiFit application. This document outlines how frontend applications can interface with the API.

## Base Information

- **Base URL**: `http://localhost:3000` (development)
- **API Documentation**: `/docs` (Swagger UI)
- **Content Type**: `application/json`

## Authentication

The API uses Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## API Endpoints

### User Management

#### Create User

Creates a new user account with optional profile information.

- **URL**: `/user`
- **Method**: `POST`
- **Auth Required**: No (for registration)

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "secret123",
  "phoneNumber": "1234567890",
  "profile": {
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "heightCm": 180,
    "weightKg": 75,
    "activityLevel": "active",
    "dietaryPreferences": ["vegan", "low-carb"],
    "exercisePreferences": ["cardio", "strength training"],
    "medicalConditions": ["diabetes", "hypertension"],
    "supplements": {"vitaminD": "2000IU"},
    "sleepPatterns": {"hours": 7, "quality": "good"},
    "stressLevel": 5,
    "nutritionInfo": {"calories": 2000},
    "location": {"city": "New York", "country": "USA"},
    "additionalInfo": {"notes": "no known allergies"}
  }
}
```

**Response** (201 Created):

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "hashedPassword": "[hashed value]",
  "phoneNumber": "1234567890",
  "isActive": true,
  "createdAt": "2025-03-07T00:00:00.000Z",
  "updatedAt": "2025-03-07T00:00:00.000Z"
}
```

#### Get All Users

Retrieves a list of all users.

- **URL**: `/user`
- **Method**: `GET`
- **Auth Required**: Yes

**Response** (200 OK):

```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "hashedPassword": "[hashed value]",
    "phoneNumber": "1234567890",
    "isActive": true,
    "createdAt": "2025-03-07T00:00:00.000Z",
    "updatedAt": "2025-03-07T00:00:00.000Z"
  },
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "hashedPassword": "[hashed value]",
    "phoneNumber": "0987654321",
    "isActive": true,
    "createdAt": "2025-03-07T00:00:00.000Z",
    "updatedAt": "2025-03-07T00:00:00.000Z"
  }
]
```

#### Get User by ID

Retrieves a specific user by their ID.

- **URL**: `/user/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]` (required)

**Response** (200 OK):

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "hashedPassword": "[hashed value]",
  "phoneNumber": "1234567890",
  "isActive": true,
  "createdAt": "2025-03-07T00:00:00.000Z",
  "updatedAt": "2025-03-07T00:00:00.000Z"
}
```

#### Update User

Updates a user's information.

- **URL**: `/user/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]` (required)

**Request Body** (all fields optional):

```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "email": "johnny.doe@example.com",
  "password": "newpassword123",
  "phoneNumber": "5551234567"
}
```

**Response** (200 OK):

```json
{
  "id": 1,
  "firstName": "Johnny",
  "lastName": "Doe",
  "email": "johnny.doe@example.com",
  "hashedPassword": "[new hashed value]",
  "phoneNumber": "5551234567",
  "isActive": true,
  "createdAt": "2025-03-07T00:00:00.000Z",
  "updatedAt": "2025-03-07T00:00:00.000Z"
}
```

#### Delete User

Deletes a user account.

- **URL**: `/user/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]` (required)

**Response** (200 OK):

```
No content
```

### User Profile Management

#### Get User Profile

Retrieves a user's profile information.

- **URL**: `/user/profile/:userId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `userId=[integer]` (required)

**Response** (200 OK):

```json
{
  "userId": 1,
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "heightCm": 180,
  "weightKg": 75,
  "activityLevel": "active",
  "dietaryPreferences": ["vegan", "low-carb"],
  "exercisePreferences": ["cardio", "strength training"],
  "medicalConditions": ["diabetes", "hypertension"],
  "supplements": {"vitaminD": "2000IU"},
  "sleepPatterns": {"hours": 7, "quality": "good"},
  "stressLevel": 5,
  "nutritionInfo": {"calories": 2000},
  "location": {"city": "New York", "country": "USA"},
  "additionalInfo": {"notes": "no known allergies"},
  "createdAt": "2025-03-07T00:00:00.000Z",
  "updatedAt": "2025-03-07T00:00:00.000Z"
}
```

#### Update User Profile

Updates a user's profile information.

- **URL**: `/user/profile/:userId`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**: `userId=[integer]` (required)

**Request Body** (all fields optional):

```json
{
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "heightCm": 182,
  "weightKg": 78,
  "activityLevel": "very active",
  "dietaryPreferences": ["vegan", "low-carb", "gluten-free"],
  "exercisePreferences": ["cardio", "strength training", "yoga"],
  "medicalConditions": ["diabetes"],
  "supplements": {"vitaminD": "2000IU", "omega3": "1000mg"},
  "sleepPatterns": {"hours": 8, "quality": "excellent"},
  "stressLevel": 3,
  "nutritionInfo": {"calories": 2200, "protein": "150g"},
  "location": {"city": "San Francisco", "country": "USA"},
  "additionalInfo": {"notes": "no known allergies", "goals": "weight loss"}
}
```

**Response** (200 OK):

```json
{
  "userId": 1,
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "heightCm": 182,
  "weightKg": 78,
  "activityLevel": "very active",
  "dietaryPreferences": ["vegan", "low-carb", "gluten-free"],
  "exercisePreferences": ["cardio", "strength training", "yoga"],
  "medicalConditions": ["diabetes"],
  "supplements": {"vitaminD": "2000IU", "omega3": "1000mg"},
  "sleepPatterns": {"hours": 8, "quality": "excellent"},
  "stressLevel": 3,
  "nutritionInfo": {"calories": 2200, "protein": "150g"},
  "location": {"city": "San Francisco", "country": "USA"},
  "additionalInfo": {"notes": "no known allergies", "goals": "weight loss"},
  "createdAt": "2025-03-07T00:00:00.000Z",
  "updatedAt": "2025-03-07T00:00:00.000Z"
}
```

## Data Models

### User

| Field          | Type      | Description                                  | Example                  |
|----------------|-----------|----------------------------------------------|--------------------------|
| id             | number    | Unique identifier                            | 1                        |
| firstName      | string    | User's first name                            | "John"                   |
| lastName       | string    | User's last name                             | "Doe"                    |
| email          | string    | User's email address (unique)                | "john.doe@example.com"   |
| hashedPassword | string    | Hashed password (not returned to frontend)   | "[hashed value]"         |
| phoneNumber    | string    | User's phone number (optional)               | "1234567890"             |
| isActive       | boolean   | Flag indicating if the account is active     | true                     |
| createdAt      | Date      | Account creation timestamp                   | "2025-03-07T00:00:00Z"   |
| updatedAt      | Date      | Account last update timestamp                | "2025-03-07T00:00:00Z"   |

### UserProfile

| Field               | Type     | Description                                | Example                                |
|---------------------|----------|--------------------------------------------|----------------------------------------|
| userId              | number   | User ID (primary key)                      | 1                                      |
| dateOfBirth         | Date     | User's date of birth                       | "1990-01-01"                           |
| gender              | string   | User's gender                              | "male"                                 |
| heightCm            | number   | Height in centimeters                      | 180                                    |
| weightKg            | number   | Weight in kilograms                        | 75                                     |
| activityLevel       | string   | Activity level description                 | "active"                               |
| dietaryPreferences  | JSON     | Dietary preferences                        | ["vegan", "low-carb"]                  |
| exercisePreferences | JSON     | Exercise preferences                       | ["cardio", "strength training"]        |
| medicalConditions   | string[] | Medical conditions                         | ["diabetes", "hypertension"]           |
| supplements         | JSON     | Supplements information                    | {"vitaminD": "2000IU"}                 |
| sleepPatterns       | JSON     | Sleep patterns information                 | {"hours": 7, "quality": "good"}        |
| stressLevel         | number   | Stress level (1-10)                        | 5                                      |
| nutritionInfo       | JSON     | Nutrition information                      | {"calories": 2000}                     |
| location            | JSON     | Location information                       | {"city": "New York", "country": "USA"} |
| additionalInfo      | JSON     | Additional information                     | {"notes": "no known allergies"}        |
| createdAt           | Date     | Profile creation timestamp                 | "2025-03-07T00:00:00Z"                 |
| updatedAt           | Date     | Profile last update timestamp              | "2025-03-07T00:00:00Z"                 |

### UserActivityLog

| Field       | Type     | Description                                | Example                                       |
|-------------|----------|--------------------------------------------|-----------------------------------------------|
| id          | number   | Unique identifier                          | 1                                             |
| user        | User     | Associated user                            | User object                                   |
| eventType   | string   | Type of event                              | "login"                                       |
| eventData   | JSON     | Additional event data                      | {"ip": "192.168.0.1", "userAgent": "Mozilla"} |
| createdAt   | Date     | Event timestamp                            | "2025-03-07T00:00:00Z"                        |

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request:

- **200 OK**: The request was successful
- **201 Created**: The resource was successfully created
- **400 Bad Request**: The request was invalid or cannot be served
- **401 Unauthorized**: Authentication is required or failed
- **403 Forbidden**: The authenticated user doesn't have permission
- **404 Not Found**: The requested resource doesn't exist
- **500 Internal Server Error**: An error occurred on the server

Error responses include a JSON object with details:

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Frontend Integration

### Example: Creating a User

```typescript
// Using fetch API
async function createUser(userData) {
  try {
    const response = await fetch('http://localhost:3000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Using axios
import axios from 'axios';

async function createUser(userData) {
  try {
    const response = await axios.post('http://localhost:3000/user', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
}
```

### Example: Fetching User Profile with Authentication

```typescript
// Using fetch API
async function getUserProfile(userId, token) {
  try {
    const response = await fetch(`http://localhost:3000/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Using axios
import axios from 'axios';

async function getUserProfile(userId, token) {
  try {
    const response = await axios.get(`http://localhost:3000/user/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
}
```

## Best Practices

1. **Error Handling**: Always implement proper error handling in your frontend code to gracefully handle API errors.

2. **Authentication**: Store authentication tokens securely (e.g., in HttpOnly cookies or secure storage).

3. **Validation**: Validate user input on the frontend before sending it to the API to improve user experience.

4. **Loading States**: Implement loading states in your UI to indicate when API requests are in progress.

5. **Caching**: Consider caching frequently accessed data to reduce API calls and improve performance.

6. **Refresh Tokens**: Implement refresh token logic to maintain user sessions without requiring frequent logins.

7. **Rate Limiting**: Be aware of API rate limits and implement appropriate retry logic.

## Notes for Frontend Developers

- The API automatically creates a user profile when a user is created, even if no profile data is provided.
- When updating a user profile, you only need to include the fields you want to update.
- JSON fields (like dietaryPreferences, exercisePreferences, etc.) should be properly serialized before sending to the API.
- The API uses NestJS and TypeORM, which provides robust validation and error handling.
