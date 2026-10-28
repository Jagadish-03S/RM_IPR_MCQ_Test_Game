#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="file:/app/prisma/dev.db"
fi

if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET="rm-ipr-secure-secret-token-key-university-2026-vtu"
fi

echo "======================================================="
echo " Starting RM & IPR MCQ Assessment Engine               "
echo " DATABASE_URL: $DATABASE_URL                          "
echo " PORT: ${PORT:-5000}                                  "
echo "======================================================="

echo "[1/3] Syncing Prisma SQLite Schema..."
npm --prefix server run prisma:push

echo "[2/3] Seeding Initial Admin & Question Bank..."
node server/dist/seed.js

echo "[3/3] Launching Express Production Server..."
exec node server/dist/index.js
