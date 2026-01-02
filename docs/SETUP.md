# Development Environment Setup

## Prerequisites

- Node.js 20+ (LTS)
- pnpm 8+ (recommended) or npm
- Docker Desktop
- Git

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/webbuilder.git
cd webbuilder

# Install dependencies
pnpm install
```

### 2. Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your API keys
nano .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/webbuilder"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..."

# Optional: Image Generation
STABILITY_API_KEY="sk-..."

# Storage
S3_BUCKET="webbuilder-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed
```

### 4. Start Development Server

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter web dev      # Frontend on http://localhost:3000
pnpm --filter api dev      # Backend on http://localhost:4000
```

## Docker Development

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f web
```

## Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run specific package tests
pnpm --filter ai-core test
```

## Project Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development servers |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint all files |
| `pnpm format` | Format with Prettier |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm clean` | Clean build artifacts |

## IDE Setup

### VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitHub Copilot

### Recommended Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Reset database
pnpm db:reset
```

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```
