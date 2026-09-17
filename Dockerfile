# ==============================================================================
# Multi-stage Production Dockerfile for Bussinest B2B Marketplace
# ==============================================================================

# Stage 1: Build Frontend and Server Bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY tsconfig.json vite.config.ts ./
RUN npm ci

# Copy source code and prisma schema
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

# Build Vite client and bundle Node server
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install runtime dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built distribution files and public assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html

# Create uploads directory
RUN mkdir -p uploads

# Non-root security user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
