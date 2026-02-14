FROM node:22-alpine AS base

# --- Build stage ---
FROM base AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# --- Production stage ---
FROM base AS production
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server source (runs via tsx)
COPY server ./server
COPY tsconfig.json tsconfig.node.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "--import", "tsx", "server/index.ts"]
