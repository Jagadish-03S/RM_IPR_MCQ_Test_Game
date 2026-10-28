FROM node:20-slim

WORKDIR /app

# Install openssl and certificates required by Prisma engines on Linux
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY prisma ./prisma/

# Install all dependencies including devDependencies (TypeScript, Vite, Tailwind)
RUN npm --prefix server install --include=dev
RUN npm --prefix client install --include=dev

# Generate Prisma client for linux engine
RUN npm --prefix server run prisma:generate

# Copy application source code (node_modules is excluded by .dockerignore)
COPY . .

# Build client (Vite -> client/dist) and server (TypeScript -> server/dist)
RUN npm --prefix client run build
RUN npm --prefix server run build

# Pre-initialize and seed SQLite database during build for instant 0.1s startup
RUN mkdir -p /app/prisma && chmod 777 /app/prisma
RUN DATABASE_URL="file:/app/prisma/dev.db" npx prisma db push --schema=/app/prisma/schema.prisma --accept-data-loss --skip-generate
RUN DATABASE_URL="file:/app/prisma/dev.db" node /app/server/dist/seed.js

# Default environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV JWT_SECRET="rm-ipr-secure-secret-token-key-university-2026-vtu"
ENV SESSION_SECRET="rm-ipr-session-crypto-salt-secure-hash-2026"
ENV ADMIN_INITIAL_EMAIL="sjagadish89772@gmail.com"
ENV ADMIN_INITIAL_PASSWORD="Prathiksha@123"
ENV ADMIN_INITIAL_NAME="Jagadish S"

ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
