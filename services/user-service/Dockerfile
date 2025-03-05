# Build stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy root package files
COPY package.json .
COPY package-lock.json .
COPY nx.json .
COPY tsconfig.base.json .
COPY jest.preset.js .

# Copy service and shared packages
COPY services/user-service ./services/user-service
COPY shared ./shared

# Install dependencies
RUN npm ci

# Build the service
RUN npx nx build user-service

# Production stage
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist/services/user-service ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 4000

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV CORS_ORIGIN=*
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=optifit_users
ENV DB_SYNC=true
ENV JWT_SECRET=your-secret-key-change-in-production

# Run the application
CMD ["node", "dist/main"]
