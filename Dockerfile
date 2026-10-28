FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for both client and server
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY prisma ./prisma/

RUN npm run install:all
RUN npm --prefix server run prisma:generate

# Copy all source code
COPY . .

# Build client and server
RUN npm --prefix client run build
RUN npm --prefix server run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY server/package*.json ./server/
COPY prisma ./prisma/

RUN npm --prefix server install --omit=dev
RUN npm --prefix server run prisma:generate

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/textbook ./textbook
COPY --from=builder /app/BRMK557\ RM&IPR\ Textbook.pdf ./

EXPOSE 5000

CMD ["sh", "-c", "npm --prefix server run prisma:push && npm --prefix server run prisma:seed && node server/dist/index.js"]

