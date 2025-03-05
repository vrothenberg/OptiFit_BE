# OptiFit API Documentation

This document provides a comprehensive guide to the OptiFit backend API endpoints. It serves as a reference for frontend developers to understand how to interact with the various microservices.

## Table of Contents

- [Authentication](#authentication)
- [User Service](#user-service)
- [Logging Service](#logging-service)
  - [Food Logging](#food-logging)
  - [Exercise Logging](#exercise-logging)
  - [Sleep Logging](#sleep-logging)
- [AI Service](#ai-service)

## Authentication

All API endpoints (except for login and registration) require authentication using JWT tokens.

### Headers

Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "jwt_token_here"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "jwt_token_here"
}
```

#### Google OAuth Login

```
GET /api/auth/google
```

This will redirect to Google's OAuth page. After successful authentication, the user will be redirected back to the application with a JWT token.

## User Service

### User Profile

#### Get user profile

```
GET /api/users/profile
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "location": "San Francisco, CA",
  "phone": "+1234567890",
  "age": 30,
  "circadianQuestionnaire": {
    "chronotype": "morning",
    "sleepTime": "22:00",
    "wakeTime": "06:00"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update user profile

```
PUT /api/users/profile
```

Request body:
```json
{
  "name": "John Smith",
  "location": "New York, NY",
  "phone": "+1987654321",
  "age": 31,
  "circadianQuestionnaire": {
    "chronotype": "evening",
    "sleepTime": "23:00",
    "wakeTime": "07:00"
  }
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Smith",
  "location": "New York, NY",
  "phone": "+1987654321",
  "age": 31,
  "circadianQuestionnaire": {
    "chronotype": "evening",
    "sleepTime": "23:00",
    "wakeTime": "07:00"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

### User Preferences

#### Get user preferences

```
GET /api/users/preferences
```

Response:
```json
{
  "darkMode": true,
  "notifications": true,
  "units": "metric",
  "language": "en"
}
```

#### Update user preferences

```
PUT /api/users/preferences
```

Request body:
```json
{
  "darkMode": false,
  "notifications": true,
  "units": "imperial",
  "language": "en"
}
```

Response:
```json
{
  "darkMode": false,
  "notifications": true,
  "units": "imperial",
  "language": "en"
}
```

## Logging Service

### Food Logging

#### Get food logs

```
GET /api/food/logs
```

Query parameters:
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number of logs to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

Response:
```json
{
  "logs": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "foodName": "Apple",
      "amount": 1,
      "unit": "piece",
      "calories": 95,
      "protein": 0.5,
      "carbs": 25,
      "fat": 0.3,
      "time": "2023-01-01T12:00:00.000Z",
      "createdAt": "2023-01-01T12:05:00.000Z",
      "updatedAt": "2023-01-01T12:05:00.000Z"
    }
  ],
  "total": 1
}
```

#### Create food log

```
POST /api/food/logs
```

Request body:
```json
{
  "foodName": "Banana",
  "amount": 1,
  "unit": "piece",
  "calories": 105,
  "protein": 1.3,
  "carbs": 27,
  "fat": 0.4,
  "time": "2023-01-01T15:00:00.000Z"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "foodName": "Banana",
  "amount": 1,
  "unit": "piece",
  "calories": 105,
  "protein": 1.3,
  "carbs": 27,
  "fat": 0.4,
  "time": "2023-01-01T15:00:00.000Z",
  "createdAt": "2023-01-01T15:05:00.000Z",
  "updatedAt": "2023-01-01T15:05:00.000Z"
}
```

#### Update food log

```
PUT /api/food/logs/:id
```

Request body:
```json
{
  "amount": 2,
  "calories": 210,
  "protein": 2.6,
  "carbs": 54,
  "fat": 0.8
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "foodName": "Banana",
  "amount": 2,
  "unit": "piece",
  "calories": 210,
  "protein": 2.6,
  "carbs": 54,
  "fat": 0.8,
  "time": "2023-01-01T15:00:00.000Z",
  "createdAt": "2023-01-01T15:05:00.000Z",
  "updatedAt": "2023-01-01T15:10:00.000Z"
}
```

#### Delete food log

```
DELETE /api/food/logs/:id
```

Response:
```json
{
  "success": true
}
```

### Exercise Logging

#### Get exercise logs

```
GET /api/exercise/logs
```

Query parameters:
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number of logs to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

Response:
```json
{
  "logs": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Running",
      "duration": 30,
      "distance": 5,
      "calories": 300,
      "time": "2023-01-01T08:00:00.000Z",
      "createdAt": "2023-01-01T08:30:00.000Z",
      "updatedAt": "2023-01-01T08:30:00.000Z"
    }
  ],
  "total": 1
}
```

#### Create exercise log

```
POST /api/exercise/logs
```

Request body:
```json
{
  "name": "Swimming",
  "duration": 45,
  "distance": 1.5,
  "calories": 400,
  "time": "2023-01-02T08:00:00.000Z"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Swimming",
  "duration": 45,
  "distance": 1.5,
  "calories": 400,
  "time": "2023-01-02T08:00:00.000Z",
  "createdAt": "2023-01-02T08:45:00.000Z",
  "updatedAt": "2023-01-02T08:45:00.000Z"
}
```

#### Update exercise log

```
PUT /api/exercise/logs/:id
```

Request body:
```json
{
  "duration": 60,
  "distance": 2,
  "calories": 500
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Swimming",
  "duration": 60,
  "distance": 2,
  "calories": 500,
  "time": "2023-01-02T08:00:00.000Z",
  "createdAt": "2023-01-02T08:45:00.000Z",
  "updatedAt": "2023-01-02T09:00:00.000Z"
}
```

#### Delete exercise log

```
DELETE /api/exercise/logs/:id
```

Response:
```json
{
  "success": true
}
```

### Sleep Logging

#### Get sleep logs

```
GET /api/sleep/logs
```

Query parameters:
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number of logs to return (default: 10)
- `offset` (optional): Offset for pagination (default: 0)

Response:
```json
{
  "logs": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "startTime": "2023-01-01T22:00:00.000Z",
      "endTime": "2023-01-02T06:00:00.000Z",
      "quality": 8,
      "notes": "Slept well",
      "createdAt": "2023-01-02T06:05:00.000Z",
      "updatedAt": "2023-01-02T06:05:00.000Z"
    }
  ],
  "total": 1
}
```

#### Create sleep log

```
POST /api/sleep/logs
```

Request body:
```json
{
  "startTime": "2023-01-02T23:00:00.000Z",
  "endTime": "2023-01-03T07:00:00.000Z",
  "quality": 7,
  "notes": "Woke up once"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "startTime": "2023-01-02T23:00:00.000Z",
  "endTime": "2023-01-03T07:00:00.000Z",
  "quality": 7,
  "notes": "Woke up once",
  "createdAt": "2023-01-03T07:05:00.000Z",
  "updatedAt": "2023-01-03T07:05:00.000Z"
}
```

#### Update sleep log

```
PUT /api/sleep/logs/:id
```

Request body:
```json
{
  "quality": 6,
  "notes": "Woke up twice"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "startTime": "2023-01-02T23:00:00.000Z",
  "endTime": "2023-01-03T07:00:00.000Z",
  "quality": 6,
  "notes": "Woke up twice",
  "createdAt": "2023-01-03T07:05:00.000Z",
  "updatedAt": "2023-01-03T07:10:00.000Z"
}
```

#### Delete sleep log

```
DELETE /api/sleep/logs/:id
```

Response:
```json
{
  "success": true
}
```

## AI Service

### Generate AI Response

```
POST /api/ai/chat
```

Request body:
```json
{
  "message": "How can I improve my sleep quality?"
}
```

Response:
```json
{
  "message": "How can I improve my sleep quality?",
  "response": "To improve your sleep quality, consider establishing a consistent sleep schedule, creating a relaxing bedtime routine, optimizing your sleep environment (cool, dark, and quiet), limiting screen time before bed, avoiding caffeine and alcohol close to bedtime, and getting regular exercise (but not too close to bedtime). Based on your recent sleep logs, I notice you've been going to bed around 11 PM and waking up at 7 AM, which provides a good 8-hour window for sleep. Your sleep quality ratings have been between 6-8, suggesting there's room for improvement. Consider implementing some of these strategies and tracking your sleep quality to see what works best for you."
}
```

The AI service uses the user's context (profile information, food logs, exercise logs, sleep logs) to provide personalized responses.
