FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json first for better caching
COPY package.json ./

# Copy lock file if it exists, otherwise continue
# Using a pattern that won't fail if file doesn't exist
RUN touch pnpm-lock.yaml || true
COPY pnpm-lock.yaml* ./

# Install dependencies (will use lock file if present)
RUN if [ -f pnpm-lock.yaml ] && [ -s pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Copy all source files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["pnpm", "exec", "vite", "dev", "--port", "3000", "--host", "0.0.0.0"]

