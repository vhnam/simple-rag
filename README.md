# Simple RAG

A simple Retrieval-Augmented Generation (RAG) application built with NestJS and React. This project demonstrates a full-stack RAG implementation for AI-powered recipe suggestions based on available ingredients, using vector database support with PostgreSQL and `pgvector`.

## Features

- **AI Recipe Suggestions**: Get personalized recipe recommendations based on ingredients you have (with rate limiting for cost control)
- **Vector Search**: Fast semantic search using PostgreSQL with pgvector extension
- **Authentication**: Secure JWT-based authentication with Auth0
- **Role-Based Access Control (RBAC)**: Comprehensive permissions system with auto-discovery of permissions from decorators
- **User Management**: Full CRUD operations for managing users with role-based access, plus user profile management
- **Role Management**: Create, update, and delete roles with customizable permissions
- **Recipe Management**: Browse and create recipes with permission-based access control
- **Health Monitoring**: Built-in health check endpoints for database, memory, and disk monitoring
- **Rate Limiting**: API rate limiting to prevent abuse
- **Structured Logging**: Winston-based logging for better observability
- **Modern UI**: Beautiful, responsive interface built with React 19, Shadcn UI, TanStack Router, TanStack Table, and Tailwind CSS
- **Type-Safe**: End-to-end type safety with TypeScript and Zod validation

## Architecture

The project is organized as a monorepo with two main components:

- **simple-rag-api**: NestJS backend API that handles RAG queries using LangChain, OpenAI embeddings, and PostgreSQL with `pgvector`
- **simple-rag-app**: React frontend built with TanStack Router, React Query, and Tailwind CSS

## Tech Stack

### Backend

- **NestJS 11** - Progressive Node.js framework
- **LangChain 1.0** - LLM application framework
- **OpenAI** - Embeddings and LLM (GPT models)
- **PostgreSQL + pgvector** - Vector database for embeddings
- **TypeORM 0.3** - TypeScript ORM for database operations
- **Auth0** - JWT authentication with Passport.js
- **Zod 4.1** - Schema validation for requests and responses
- **Winston 3.18** - Structured logging
- **NestJS Terminus** - Health check endpoints
- **NestJS Throttler** - Rate limiting
- **TypeScript 5.7** - Type-safe development

### Frontend

- **React 19** - UI library
- **TanStack Router 1.x** - Type-safe routing
- **TanStack Query 5.x** - Data fetching and state management
- **TanStack Table 8.x** - Powerful table/data grid library
- **Auth0 React SDK** - Authentication integration
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library built with Radix UI and Tailwind CSS
- **Zustand 5.0** - Lightweight state management
- **Axios 1.13** - HTTP client
- **Vite 7.1** - Build tool and dev server

### Infrastructure

- **Docker Compose** - Container orchestration
- **pnpm workspaces** - Monorepo package management

## Prerequisites

- **Node.js** v22.17.0 or higher
- **pnpm** v10.15.1 or higher
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
│   │   ├── rbac/           # RBAC module (roles, permissions, guards, decorators)
│   │   ├── users/          # User management module (CRUD operations)
│   │   ├── roles/          # Role management module (CRUD operations)
│   │   ├── recipes/        # Recipe management module (CRUD operations)
│   │   ├── health/         # Health check endpoints
│   │   ├── config/         # Configuration schemas (env validation, CORS, logging, throttler)
│   │   ├── database/       # Database module and migrations
│   │   ├── entities/       # TypeORM entities (User, Role, Permission, Recipe, etc.)
│   │   ├── common/         # Common interfaces and utilities
│   │   └── main.ts         # Application entry point
│   ├── test/               # E2E tests
│   ├── Dockerfile          # Docker configuration
│   └── package.json
├── simple-rag-app/          # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Shadcn UI)
│   │   ├── modules/        # Feature modules (ai-recipe, users, roles, landing)
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

- `POST /rag/ask` - Query recipes using RAG based on ingredients (rate limited: 3 requests/second, 10 requests/minute)
- `GET /rag/status` - Get RAG service status including readiness and recipe count (requires authentication)

### Users

- `GET /users` - Get paginated list of users with search and pagination (requires `users:view_list` permission)
- `GET /users/:id` - Get user details including assigned roles (requires `users:view_detail` permission)
- `GET /users/me/profile` - Get current user's profile with preferences (requires authentication)
- `PATCH /users/me/profile` - Update current user's profile and preferences (requires authentication)

### Roles (Admin only)

- `GET /roles` - Get paginated list of roles with search and pagination (requires `roles:view_list` permission)
- `GET /roles/:id` - Get role details including permissions (requires `roles:view_detail` permission)
- `POST /roles` - Create a new role with permissions (requires `roles:create` permission)
- `PUT /roles/:id` - Update role name, description, or permissions (requires `roles:update` permission)
- `DELETE /roles/:id` - Delete a role (prevents deletion if users are assigned) (requires `roles:delete` permission)
- `GET /roles/:id/users` - Get paginated list of users assigned to this role (requires `roles:view_detail` and `users:view_list` permissions)
- `POST /roles/:id/assign-users` - Assign multiple users to a role (requires `roles:view_detail` and `users:update` permissions)
- `DELETE /roles/:id/remove-user/:userId` - Remove user from role (ensures users retain at least one role) (requires `roles:view_detail` and `users:update` permissions)

### Recipes

- `GET /recipes` - Get paginated list of recipes with search and pagination (requires `recipes:view_list` permission)
- `POST /recipes` - Create a new recipe (requires `recipes:create` permission)

### Permissions

- `GET /permissions` - Get all available permissions grouped by resource (requires `permissions:view_list` permission)

## RBAC System

The application includes a comprehensive Role-Based Access Control (RBAC) system with automatic permission discovery:

### Key Features

- **Automatic Permission Discovery**: Permissions are automatically discovered from `@Permissions()` decorators in controllers via the `PermissionSyncService`
- **Dynamic Role Management**: Roles can be created, updated, and deleted dynamically through the API
- **Fine-Grained Access Control**: Each endpoint is protected with specific permissions
- **Default Roles**: Pre-configured viewer and admin roles with appropriate permissions

### Default Roles

- **viewer**: Can view recipes and users (default role for new users)
  - Permissions: `recipes:read`, `recipes:create`, `users:view_list`, `users:view_detail`
- **admin**: Full access to all features
  - Permissions: All recipe, user, role, and permission permissions (`recipes:all`, `users:all`, `roles:all`, `permissions:view_list`)

### Permission Categories

**Recipe Permissions:**

- `recipes:read` - Can read recipes
- `recipes:create` - Can create recipes
- `recipes:update` - Can update recipes
- `recipes:delete` - Can delete recipes
- `recipes:all` - Full access to all recipe operations

**User Permissions:**

- `users:view_list` - Can view list of users
- `users:view_detail` - Can view user details
- `users:create` - Can create users
- `users:update` - Can update users (including role assignment)
- `users:delete` - Can delete users
- `users:all` - Full access to all user operations

**Role Permissions:**

- `roles:view_list` - Can view list of roles
- `roles:view_detail` - Can view role details and assigned users
- `roles:create` - Can create roles
- `roles:update` - Can update role settings and permissions
- `roles:delete` - Can delete roles
- `roles:all` - Full access to all role operations

**Permission Management:**

- `permissions:view_list` - Can view available permissions


## Technical Debt

This section documents known technical debt items that should be addressed to improve code quality, maintainability, and reliability.

### TypeScript Configuration

- **Loose Type Checking**: `tsconfig.json` has several strict mode options disabled:
  - `noImplicitAny: false` - Allows implicit `any` types, reducing type safety
  - `strictBindCallApply: false` - Less strict checking for `bind`, `call`, and `apply`
  - `noFallthroughCasesInSwitch: false` - Allows fallthrough cases in switch statements
  - **Recommendation**: Enable strict mode gradually to improve type safety

### ESLint Configuration

- **Type Safety Rules Disabled**: ESLint config has type safety rules set to warnings or disabled:
  - `@typescript-eslint/no-explicit-any: 'off'` - Allows explicit `any` types
  - `@typescript-eslint/no-floating-promises: 'warn'` - Should be 'error' to catch unhandled promises
  - Multiple `eslint-disable` comments in `rag.service.ts` for unsafe type operations
  - **Recommendation**: Enable stricter rules and fix type issues incrementally

### Type Safety Issues

- **Extensive Use of `any` Types**:
  - Frontend: `search-input.tsx` and `ai-recipe-form.tsx` use `any` types extensively
  - Backend: `rag.service.ts` has multiple unsafe type assertions and operations with LangChain responses
  - Raw SQL queries with type assertions (`as unknown as Array<{ id: string }>`)
  - **Recommendation**: Create proper type definitions for LangChain responses and replace `any` with specific types

### Testing

- **Minimal Test Coverage**: Test files exist but only contain basic "should be defined" tests:
  - No unit tests for business logic
  - No integration tests for API endpoints
  - No frontend tests
  - E2E test only covers basic health check
  - **Recommendation**: Add comprehensive unit tests, integration tests, and frontend tests with meaningful coverage

### Database Migrations

- **Custom Migration System**: Uses a custom `MigrationService` instead of TypeORM's built-in migration system:
  - No migration versioning or rollback capability
  - Migrations run on every startup (idempotent but not versioned)
  - Hard to track schema changes over time
  - **Recommendation**: Migrate to TypeORM migrations for proper versioning and rollback support

### Error Handling

- **Inconsistent Error Handling Patterns**:
  - Some controllers catch errors and throw `BadRequestException`, others let errors bubble up
  - Migration service swallows errors on startup (logs but doesn't fail)
  - Some services throw generic `Error` instead of domain-specific exceptions
  - **Recommendation**: Standardize error handling with custom exception classes and consistent error response format

### Code Quality

- **Console Statements**: Several `console.log`, `console.error`, and `console.debug` statements instead of proper logging:
  - `simple-rag-app/src/integrations/auth/auth-provider.tsx`
  - `simple-rag-app/src/lib/axios.ts`
  - `simple-rag-api/src/main.ts`
  - **Recommendation**: Replace with proper logger instances

### Database Operations

- **Mixed Query Patterns**: Mix of TypeORM repositories and raw SQL queries:
  - `recipes.service.ts` uses raw SQL for inserts
  - `rbac.service.ts` uses raw SQL for role assignments
  - Inconsistent approach makes code harder to maintain
  - **Recommendation**: Standardize on TypeORM query builder or repositories where possible

### Transaction Management

- **Inconsistent Transaction Usage**: Some operations use transactions (e.g., `role-assignment.service.ts`) while others don't:
  - `recipes.service.ts` creates recipes without transactions
  - `rbac.service.ts` assigns roles without transactions in some paths
  - **Recommendation**: Use transactions for all multi-step database operations to ensure data consistency

### Performance

- **No Caching**: No caching mechanisms for:
  - User permissions (queried on every request)
  - Recipe embeddings (regenerated on every query)
  - Permission lists
  - **Recommendation**: Add Redis or in-memory caching for frequently accessed data

### Security

- **Input Validation**: While Zod schemas are used, need to verify:
  - SQL injection protection (currently using parameterized queries, but should audit all raw SQL)
  - XSS protection in frontend
  - Rate limiting coverage (currently only on RAG endpoint)
  - **Recommendation**: Security audit and add input sanitization where needed

### Documentation

- **Missing Documentation**:
  - No API documentation (OpenAPI/Swagger)
  - Limited inline documentation for complex business logic
  - No architecture decision records (ADRs)
  - **Recommendation**: Add Swagger/OpenAPI documentation and improve inline documentation

### Frontend

- **Type Safety**: Frontend has several `any` types that reduce type safety:
  - `search-input.tsx` uses `any` for generic items
  - `ai-recipe-form.tsx` has multiple `any` types
  - `health.types.ts` uses `[key: string]: any`
  - **Recommendation**: Create proper TypeScript interfaces and replace `any` types

### Environment Configuration

- **Typo in Filename**: `env.shema.ts` should be `env.schema.ts` (typo: "shema" instead of "schema")
  - **Recommendation**: Rename file and update imports

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
- RBAC permissions are auto-discovered from controller decorators - just add `@Permissions()` decorator to new endpoints
- Use the `/roles` API endpoints to manage roles and permissions dynamically
- Test different permission levels by creating custom roles through the role management interface
- The role management UI provides a complete interface for managing roles, permissions, and user assignments
- Admin role is protected from modifications to maintain system integrity
- All role operations include validation and safeguards to prevent data inconsistency
