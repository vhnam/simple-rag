# Simple RAG

A simple Retrieval-Augmented Generation (RAG) application built with NestJS and React. This project demonstrates a full-stack RAG implementation for AI-powered recipe suggestions based on available ingredients, using vector database support with PostgreSQL and `pgvector`.

## Features

- **AI Recipe Suggestions**: Get personalized recipe recommendations based on ingredients you have
- **Vector Search**: Fast semantic search using PostgreSQL with pgvector extension
- **Authentication**: Secure JWT-based authentication with Auth0
- **Role-Based Access Control (RBAC)**: Fine-grained permissions system with roles (viewer, admin) and permissions
- **Health Monitoring**: Built-in health check endpoints for database, memory, and disk monitoring
- **Rate Limiting**: API rate limiting to prevent abuse
- **Structured Logging**: Winston-based logging for better observability
- **Modern UI**: Beautiful, responsive interface built with React 19 and Tailwind CSS
- **Type-Safe**: End-to-end type safety with TypeScript

## Architecture

The project is organized as a monorepo with two main components:

- **simple-rag-api**: NestJS backend API that handles RAG queries using LangChain, OpenAI embeddings, and PostgreSQL with `pgvector`
- **simple-rag-app**: React frontend built with TanStack Router, React Query, and Tailwind CSS

## Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **LangChain** - LLM application framework
- **OpenAI** - Embeddings and LLM (GPT models)
- **PostgreSQL + pgvector** - Vector database for embeddings
- **TypeORM** - TypeScript ORM for database operations
- **Auth0** - JWT authentication with Passport.js
- **Winston** - Structured logging
- **NestJS Terminus** - Health check endpoints
- **NestJS Throttler** - Rate limiting
- **TypeScript** - Type-safe development

### Frontend

- **React 19** - UI library
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and state management
- **Auth0 React SDK** - Authentication integration
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library built with Radix UI and Tailwind CSS
- **Vite** - Build tool and dev server

### Infrastructure

- **Docker Compose** - Container orchestration
- **pnpm workspaces** - Monorepo package management

## Prerequisites

- **Node.js** (v22 or higher)
- **pnpm** (v10 or higher)
- **Docker** and **Docker Compose** (for containerized deployment)

## Getting Started

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd simple-rag
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # API Configuration
   NODE_ENV=development
   API_PORT=4000
   ALLOWED_ORIGINS=http://localhost:3000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=ragdb

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Auth0 Configuration (Backend)
   AUTH0_ISSUER_URL=https://your-tenant.auth0.com
   AUTH0_AUDIENCE=your_api_identifier

   # Frontend Configuration
   APP_PORT=3000
   SERVER_URL=http://localhost:3000
   VITE_APP_TITLE=Simple RAG
   VITE_API_URL=http://localhost:4000
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   ```

   **Note**: You'll need to:

   - Create an OpenAI account and get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Set up an Auth0 account and application at [Auth0](https://auth0.com)
   - Configure Auth0 with the appropriate callback URLs and API settings

4. **Start the database**

   ```bash
   docker compose up db -d
   ```

5. **Run the API server**

   ```bash
   pnpm --filter simple-rag-api start:dev
   ```

   Or from the root:

   ```bash
   pnpm dev
   ```

6. **Run the frontend (in a new terminal)**

   ```bash
   cd simple-rag-app
   pnpm dev
   ```

   The application will be available at:

   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - Health Check: http://localhost:4000/health

### Docker Compose

To run the entire stack with Docker Compose:

1. **Create `.env` file** (see environment variables above)

2. **Start all services**

   ```bash
   docker compose up -d
   ```

3. **View logs**

   ```bash
   docker compose logs -f
   ```

4. **Stop services**
   ```bash
   docker compose down
   ```

## Project Structure

```
simple-rag/
├── simple-rag-api/          # NestJS backend
│   ├── src/
│   │   ├── rag/            # RAG module (controller, service, entities, DTOs)
│   │   ├── auth/           # Authentication module (JWT strategy, user sync)
│   │   ├── rbac/           # RBAC module (roles, permissions, guards)
│   │   ├── health/         # Health check endpoints
│   │   ├── config/         # Configuration schemas (env validation, CORS, logging, throttler)
│   │   ├── database/       # Database module and migrations
│   │   ├── entities/       # TypeORM entities (User, Role, Permission, Recipe, etc.)
│   │   ├── constants/      # Application constants
│   │   └── main.ts         # Application entry point
│   ├── test/               # E2E tests
│   ├── Dockerfile          # Docker configuration
│   └── package.json
├── simple-rag-app/          # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Shadcn UI)
│   │   ├── modules/        # Feature modules (ai-recipe, chat, landing)
│   │   ├── routes/         # TanStack Router routes
│   │   ├── layouts/        # Layout components
│   │   ├── integrations/  # Auth and query providers
│   │   ├── queries/        # React Query hooks and mutations
│   │   ├── schemas/        # Zod validation schemas
│   │   └── lib/            # Utilities (axios, utils)
│   ├── public/             # Static assets
│   ├── Dockerfile          # Docker configuration
│   └── package.json
├── compose.yml              # Docker Compose configuration
├── pnpm-workspace.yaml     # pnpm workspace config
└── package.json            # Root package.json
```

## Development

### Available Scripts

**Root level:**

- `pnpm dev` - Start the API in development mode

**API (`simple-rag-api`):**

- `pnpm start` - Start the API
- `pnpm start:dev` - Start in watch mode
- `pnpm build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests

**Frontend (`simple-rag-app`):**

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Format and lint code

## Database Setup

The application uses PostgreSQL with the `pgvector` extension for vector similarity search. The database will be automatically initialized when you start the Docker container.

### Running Migrations

Database migrations are handled automatically by the application on startup. The `MigrationService` ensures the database schema is up to date, including:

- Recipe entity tables
- User and authentication tables
- RBAC tables (roles, permissions, user-roles, role-permissions)
- Default role and permission seeding (viewer and admin roles)

## API Endpoints

### Health Checks

- `GET /health` - Comprehensive health check (database, memory, disk)
- `GET /health/liveness` - Simple liveness probe
- `GET /health/readiness` - Readiness check with database connectivity

### Authentication

- `POST /auth/sync` - Sync user from Auth0 (creates user if new, assigns default 'viewer' role)

### RAG

- `POST /rag/query` - Query recipes using RAG (requires authentication and appropriate permissions)

## RBAC System

The application includes a Role-Based Access Control (RBAC) system:

### Default Roles

- **viewer**: Can view recipes (default role for new users)
- **admin**: Full access to all features

### Permissions

- `recipes:read` - Can read recipes
- `recipes:create` - Can create recipes
- `recipes:update` - Can update recipes
- `recipes:delete` - Can delete recipes
- `recipes:all` - Full access to all recipe operations (assigned to admin role)

New users are automatically assigned the `viewer` role upon first authentication.

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure PostgreSQL is running and credentials match your `.env` file
2. **Auth0 authentication fails**: Verify your Auth0 configuration and callback URLs
3. **OpenAI API errors**: Check that your API key is valid and has sufficient credits
4. **Port conflicts**: Change port numbers in `.env` if default ports are in use

### Development Tips

- Use `pnpm dev` from the root to start the API in watch mode
- Frontend hot-reloads automatically on file changes
- Check Docker logs with `docker compose logs -f` for container issues
- API logs will show detailed information about RAG queries and embeddings
- Health check endpoints are useful for monitoring and debugging
- RBAC permissions can be managed through the database or by modifying the migration service
