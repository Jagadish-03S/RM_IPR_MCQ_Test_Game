FROM node:20-slim

WORKDIR /app

# Install openssl and certificates required by Prisma engines on Linux
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY prisma ./prisma/

# Set build-time and run-time environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV JWT_SECRET="rm-ipr-secure-secret-token-key-university-2026-vtu"
ENV SESSION_SECRET="rm-ipr-session-crypto-salt-secure-hash-2026"
ENV ADMIN_INITIAL_EMAIL="sjagadish89772@gmail.com"
ENV ADMIN_INITIAL_PASSWORD="Prathiksha@123"
ENV ADMIN_INITIAL_NAME="Jagadish S"

# Create fallback .env files so Prisma CLI and Node automatically load them
RUN echo 'DATABASE_URL="file:/app/prisma/dev.db"' > /app/.env && \
    echo 'DATABASE_URL="file:/app/prisma/dev.db"' > /app/server/.env

# Install dependencies for both client and server
RUN npm run install:all

# Generate Prisma client for linux engine
RUN npm --prefix server run prisma:generate

# Copy application source code (node_modules is excluded by .dockerignore)
COPY . .

# Build client (Vite -> client/dist) and server (TypeScript -> server/dist)
RUN npm --prefix client run build
RUN npm --prefix server run build

# Ensure database directory exists and is writable
RUN mkdir -p /app/prisma && chmod 777 /app/prisma

EXPOSE 5000

CMD ["sh", "-c", "export DATABASE_URL=\"${DATABASE_URL:-file:/app/prisma/dev.db}\"; npm --prefix server run prisma:push && node server/dist/seed.js && node server/dist/index.js"]
