# OptiFit Backend Monorepo

This repository contains the backend services for the OptiFit wellness application, focused on circadian rhythm optimization, food and exercise logging, and AI-powered health insights.

## Architecture

The backend is structured as a monorepo with three main microservices:

1. **User Service** - Handles authentication, user profiles, and user data management
2. **Logging Service** - Manages food logs, exercise logs, and sleep logs
3. **AI Service** - Provides AI-powered insights and recommendations using Google's Gemini API

Each service is containerized using Docker and can be run independently or together using Docker Compose.

## Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- PostgreSQL (if running services locally)
- Nx CLI (`npm install -g nx`)
- API keys for external services:
  - Google Gemini API key
  - Edamam Food Database API key

## Environment Setup

1. Copy the example environment file:
   ```
   cp .env.example .env
   ```

2. Fill in the required API keys in the `.env` file:
   ```
   JWT_SECRET=your-secret-key
   GEMINI_API_KEY=your-gemini-api-key
   EDAMAM_APP_ID=your-edamam-app-id
   EDAMAM_APP_KEY=your-edamam-app-key
   ```

## Running the Services

### Using Docker Compose

To start all services together:

```bash
docker-compose up
```

This will start:
- User Service on port 4000
- AI Service on port 4001
- Logging Service on port 4002
- PostgreSQL instances for each service that needs it

### Running Services Individually with Nx

Each service can be run individually for development using Nx:

```bash
# Install dependencies
npm install

# User Service
npm run user-service
# or
nx serve user-service

# Logging Service
npm run logging-service
# or
nx serve logging-service

# AI Service
npm run ai-service
# or
nx serve ai-service
```

## API Documentation

### User Service (Port 4000)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Logging Service (Port 4002)

- `POST /api/food` - Create a food log
- `GET /api/food` - Get food logs
- `GET /api/exercise` - Get exercise logs
- `POST /api/exercise` - Create an exercise log
- `GET /api/sleep` - Get sleep logs
- `POST /api/sleep` - Create a sleep log

### AI Service (Port 4001)

- `POST /api/chat` - Chat with the AI assistant
- `POST /api/analyze` - Get AI analysis of user data
- `POST /api/voice-log` - Process voice input for logging

## Development

The project uses a monorepo structure with Nx for managing the workspace. The shared library for common code is located in the `shared` directory and includes DTOs, interfaces, and utility functions used across services.

### Building

```bash
# Build all services
npm run build
# or
nx run-many --target=build --all

# Build a specific service
nx build user-service
```

### Testing

```bash
# Run all tests
npm test
# or
nx run-many --target=test --all

# Test a specific service
nx test user-service
```

### Linting

```bash
# Lint all services
npm run lint
# or
nx run-many --target=lint --all

# Lint a specific service
nx lint user-service
```

## Monorepo Structure

```
OptiFit_BE/
├── services/
│   ├── user-service/     # User authentication and profile management
│   ├── logging-service/  # Food, exercise, and sleep logging
│   └── ai-service/       # AI-powered insights and recommendations
├── shared/               # Shared code used across services
├── docker-compose.yml    # Docker Compose configuration
├── package.json          # Root package.json with workspaces
├── nx.json               # Nx configuration
└── tsconfig.base.json    # Base TypeScript configuration
```

## License

This project is proprietary and confidential.
