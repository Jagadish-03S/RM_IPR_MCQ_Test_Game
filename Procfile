web: export DATABASE_URL="${DATABASE_URL:-file:/app/prisma/dev.db}"; npm --prefix server run prisma:push && node server/dist/seed.js && node server/dist/index.js
