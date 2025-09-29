#!/bin/sh

# รอ PostgreSQL พร้อม
echo "Waiting for PostgreSQL..."
./wait-for-it.sh postgres:5432 --timeout=30 --strict -- echo "PostgreSQL is up"

# Generate Prisma Client
echo "Generating Prisma Client..."
pnpm prisma generate

# Run migrations
echo "Running Prisma migrations..."
pnpm db:migrate:prod

# Start Next.js
echo "Starting Next.js..."
pnpm start
