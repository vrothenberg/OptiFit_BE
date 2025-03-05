FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the shared library
COPY ../shared ../shared
RUN cd ../shared && npm install && npm run build

COPY . .

RUN npm run build

EXPOSE 4001

# Environment variables
ENV NODE_ENV=production
ENV PORT=4001
ENV CORS_ORIGIN=*
ENV JWT_SECRET=your-secret-key-change-in-production
ENV GEMINI_API_KEY=your-gemini-api-key
ENV GEMINI_MODEL=gemini-1.5-flash

CMD ["node", "dist/main"]
