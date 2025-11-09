# Simple RAG

A simple Retrieval-Augmented Generation (RAG) application built with NestJS and React. This project demonstrates a full-stack RAG implementation for AI-powered recipe suggestions based on available ingredients, using vector database support with PostgreSQL and `pgvector`.

## Features

- **AI Recipe Suggestions**: Get personalized recipe recommendations based on ingredients you have
- **Vector Search**: Fast semantic search using PostgreSQL with pgvector extension
- **Authentication**: Secure JWT-based authentication with Auth0
- **Role-Based Access Control (RBAC)**: Comprehensive permissions system with auto-discovery of permissions from decorators
- **User Management**: Full CRUD operations for managing users with role-based access
- **Role Management**: Create, update, and delete roles with customizable permissions
- **Recipe Management**: Browse and create recipes with permission-based access control
- **Health Monitoring**: Built-in health check endpoints for database, memory, and disk monitoring
- **Rate Limiting**: API rate limiting to prevent abuse
- **Structured Logging**: Winston-based logging for better observability
- **Modern UI**: Beautiful, responsive interface built with React 19, TanStack Router, and Tailwind CSS
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

- `POST /rag/query` - Query recipes using RAG (requires authentication and appropriate permissions)

### Users (Admin only)

- `GET /users` - Get paginated list of users with search and pagination (requires `users:view_list` permission)
- `GET /users/:id` - Get user details including assigned roles (requires `users:view_detail` permission)

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

- `GET /recipes` - Get paginated list of recipes (requires `recipes:all` permission)
- `POST /recipes` - Create a new recipe (requires `recipes:create` permission)

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

### How It Works

1. **User Authentication**: Users authenticate via Auth0 JWT
2. **User Sync**: On first login, `/auth/sync` creates a user record and assigns the default `viewer` role
3. **Permission Check**: The `PermissionsGuard` checks if the user has the required permissions for each endpoint
4. **Auto-Discovery**: New permissions are automatically added to the database when controllers use the `@Permissions()` decorator

New users are automatically assigned the `viewer` role upon first authentication.

## Role Management Interface

The application includes a comprehensive role management interface for administrators:

### Roles List Page

- View all roles with pagination and search functionality
- Quick navigation to role details
- Create new roles with custom permissions

### Role Details Page

The role details page includes three tabs for complete role management:

#### Settings Tab

- Update role name and description
- Delete role with confirmation dialog
- Built-in admin role is protected from modifications

#### Permissions Tab

- View and manage role permissions grouped by resource (recipes, users, roles, permissions)
- Quick action buttons: "Select All", "Select None", "Reset"
- Bulk permission assignment with checkbox interface
- Real-time permission updates
- Admin role permissions are locked and cannot be modified

#### Users Tab

- View paginated list of users assigned to the role
- Add users to the role via searchable dialog
- Remove users from role with one-click actions
- Protection against removing the current user's role
- Safeguard ensures users always have at least one role
- Admin role user assignments are protected

### Role Management Features & Safeguards

- **Admin Role Protection**: The built-in 'admin' role cannot be modified or deleted
- **User Role Requirement**: Users must have at least one role; system prevents removing the last role
- **Transaction Safety**: Role assignment/removal operations use database transactions
- **Delete Prevention**: Cannot delete roles that are currently assigned to users
- **Permission Auto-Discovery**: New permissions are automatically discovered from controller decorators
- **Comprehensive Validation**: All role operations are validated using Zod schemas

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
