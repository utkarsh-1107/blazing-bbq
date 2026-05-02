FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY apps/client/package*.json ./apps/client/

# Install dependencies
RUN npm install

# Copy client source
COPY apps/client ./apps/client

# Build Next.js
WORKDIR /app/apps/client
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/client/.next /app/.next
COPY --from=builder /app/apps/client/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/client/package.json /app/apps/client/package.json

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start", "--workspace=apps/client"]
