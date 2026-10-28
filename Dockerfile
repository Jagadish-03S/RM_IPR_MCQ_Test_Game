FROM node:20-slim

WORKDIR /app

# Install openssl and certificates required by Prisma engines on Linux
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY prisma ./prisma/

# Install dependencies for both client and server
RUN npm run install:all

# Generate Prisma client for linux engine
RUN npm --prefix server run prisma:generate

# Copy application source code (node_modules is excluded by .dockerignore)
COPY . .

# Build client (Vite -> client/dist) and server (TypeScript -> server/dist)
RUN npm --prefix client run build
RUN npm --prefix server run build

# Ensure database directory exists
RUN mkdir -p /app/prisma

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["sh", "-c", "npm --prefix server run prisma:push && node server/dist/seed.js && node server/dist/index.js"]
