FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the shared library
COPY ../shared ../shared
RUN cd ../shared && npm install && npm run build

COPY . .

RUN npm run build

EXPOSE 4002

# Environment variables
ENV NODE_ENV=production
ENV PORT=4002
ENV CORS_ORIGIN=*
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=optifit_logs
ENV DB_SYNC=true
ENV JWT_SECRET=your-secret-key-change-in-production

CMD ["node", "dist/main"]
