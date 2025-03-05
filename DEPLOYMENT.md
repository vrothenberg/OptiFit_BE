# OptiFit Backend Deployment Guide

This document provides instructions for deploying and running the OptiFit backend microservices.

## Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- API keys for external services:
  - Google Gemini API key
  - Edamam Food Database API key

## Environment Setup

1. Copy the example environment file:
   ```bash
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

### Using Docker Compose (Recommended)

1. Stop any existing PostgreSQL containers that might conflict with the ports:
   ```bash
   docker stop $(docker ps -q --filter "name=postgres")
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

   This will start:
   - User Service on port 4000
   - AI Service on port 4001
   - Logging Service on port 4002
   - PostgreSQL instances for each service that needs it

3. Check if services are running:
   ```bash
   ./check-services.sh
   ```

4. View logs:
   ```bash
   docker-compose logs -f
   ```

5. Stop services:
   ```bash
   docker-compose down
   ```

   To remove volumes as well (this will delete all data):
   ```bash
   docker-compose down -v
   ```

### Running Services Individually (For Development)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start each service in a separate terminal:
   ```bash
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

The API documentation is available in the [API.md](API.md) file. It provides a comprehensive guide to all endpoints, request/response formats, and authentication requirements.

## Frontend Integration

The frontend should be configured to connect to the following endpoints:

- User Service: http://localhost:4000
- AI Service: http://localhost:4001
- Logging Service: http://localhost:4002

## Data Persistence

The Docker Compose setup includes named volumes for PostgreSQL data, which means:

- Data will persist between container restarts
- Data will persist even after running `docker-compose down`
- Data will be lost only if you explicitly remove the volumes with `docker-compose down -v`

## Troubleshooting

### Services Not Starting

1. Check if ports are already in use:
   ```bash
   lsof -i :4000
   lsof -i :4001
   lsof -i :4002
   lsof -i :5432
   lsof -i :5433
   ```

2. Check Docker logs:
   ```bash
   docker-compose logs
   ```

3. Check individual service logs:
   ```bash
   docker-compose logs user-service
   docker-compose logs ai-service
   docker-compose logs logging-service
   ```

### Database Connection Issues

1. Check if PostgreSQL containers are running:
   ```bash
   docker ps | grep postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres-user
   docker-compose logs postgres-logs
   ```

3. Verify database connection settings in `.env` files match the Docker Compose configuration.
