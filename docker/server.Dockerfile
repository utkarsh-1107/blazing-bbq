FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY apps/server/tsconfig.json ./apps/server/
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build server
WORKDIR /app/apps/server
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Install production dependencies
RUN npm install --production --workspace=apps/server

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma/

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "dist/index.js"]
