# Simple RAG

A simple Retrieval-Augmented Generation (RAG) application built with NestJS and React. This project demonstrates a full-stack RAG implementation with vector database support using PostgreSQL with `pgvector`.

## Architecture

The project is organized as a monorepo with two main components:

- **simple-rag-api**: NestJS backend API that handles RAG queries using LangChain and PostgreSQL with `pgvector`
- **simple-rag-app**: React frontend built with TanStack Router, React Query, and Tailwind CSS

## Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **LangChain** - LLM application framework
- **PostgreSQL + pgvector** - Vector database for embeddings
- **TypeScript** - Type-safe development

### Frontend

- **React 19** - UI library
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first CSS framework
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

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=ragdb

   # Frontend Configuration
   APP_PORT=3000
   VITE_APP_TITLE=Simple RAG
   VITE_API_URL=http://localhost:4000
   ```

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
│   │   ├── rag/            # RAG module (controller, service)
│   │   ├── config/         # Configuration schemas
│   │   └── main.ts         # Application entry point
│   └── package.json
├── simple-rag-app/          # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── modules/        # Feature modules
│   │   └── routes/         # TanStack Router routes
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
