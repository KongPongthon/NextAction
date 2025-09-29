# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build Next.js
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install pnpm & bash
RUN npm install -g pnpm
RUN apk add --no-cache bash curl

# Copy built app from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Add wait-for-it and startup.sh
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
COPY startup.sh ./
RUN chmod +x /wait-for-it.sh startup.sh

EXPOSE 3000

# Start web app
CMD ["./startup.sh"]
