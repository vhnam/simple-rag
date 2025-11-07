# Development stage
FROM node:22-alpine AS development

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Copy source files
COPY . .

# Expose port 4000
EXPOSE 4000

# Set NODE_ENV to development
ENV NODE_ENV=development

# Run the application in development mode with hot-reloading
CMD ["pnpm", "start:dev"]
