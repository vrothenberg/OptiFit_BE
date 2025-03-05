# Contributing to OptiFit Backend

Thank you for considering contributing to the OptiFit Backend project! This document provides guidelines and instructions for contributing to this monorepo.

## Development Setup

1. **Prerequisites**
   - Node.js v18 (use nvm to install: `nvm install 18`)
   - Docker and Docker Compose
   - Nx CLI (`npm install -g nx`)

2. **Clone the Repository**
   ```bash
   git clone https://github.com/your-organization/optifit-backend.git
   cd optifit-backend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

## Monorepo Structure

The project is organized as a monorepo using Nx:

```
OptiFit_BE/
├── services/
│   ├── user-service/     # User authentication and profile management
│   ├── logging-service/  # Food, exercise, and sleep logging
│   └── ai-service/       # AI-powered insights and recommendations
├── shared/               # Shared code used across services
```

## Development Workflow

### Running Services

```bash
# Run all services
npm start

# Run a specific service
npm run user-service
npm run logging-service
npm run ai-service

# Or using Nx directly
nx serve user-service
```

### Building

```bash
# Build all services
npm run build

# Build a specific service
nx build user-service
```

### Testing

```bash
# Run all tests
npm test

# Test a specific service
nx test user-service
```

### Linting

```bash
# Lint all services
npm run lint

# Lint a specific service
nx lint user-service
```

## Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the code style and conventions used in the project
   - Keep changes focused on a single feature or bug fix

3. **Test Your Changes**
   ```bash
   # Run tests for the affected services
   nx affected:test
   
   # Run linting for the affected services
   nx affected:lint
   ```

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding or modifying tests
   - `chore:` for maintenance tasks

5. **Push Your Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Request reviews from team members

## Working with Nx

### Affected Commands

Nx provides "affected" commands that only run for projects affected by your changes:

```bash
# Run tests only for affected projects
nx affected:test

# Build only affected projects
nx affected:build

# Lint only affected projects
nx affected:lint
```

### Dependency Graph

To visualize the dependency graph of the monorepo:

```bash
nx dep-graph
```

## Docker Development

To run the services using Docker:

```bash
docker-compose up
```

To rebuild the Docker images after making changes:

```bash
docker-compose up --build
```

## Code Style and Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Document public APIs and complex logic
- Keep services modular and focused on their specific domain

## Questions and Support

If you have questions or need help, please reach out to the project maintainers.

Thank you for contributing to OptiFit Backend!
