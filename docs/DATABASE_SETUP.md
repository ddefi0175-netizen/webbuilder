# Database Setup Guide

This guide walks you through setting up PostgreSQL and initializing the WebBuilder database.

## Table of Contents

- [PostgreSQL Setup Options](#postgresql-setup-options)
- [Local PostgreSQL Setup](#local-postgresql-setup)
- [Cloud PostgreSQL Setup](#cloud-postgresql-setup)
- [Database Initialization](#database-initialization)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## PostgreSQL Setup Options

Choose one of the following options based on your needs:

### Option 1: Local PostgreSQL (Development)
- **Pros**: Free, fast, full control
- **Cons**: Requires local installation, not accessible remotely
- **Best for**: Local development and testing

### Option 2: Docker PostgreSQL (Development)
- **Pros**: Easy setup, isolated, reproducible
- **Cons**: Requires Docker installed
- **Best for**: Local development with containerization

### Option 3: Cloud PostgreSQL (Production)
- **Pros**: Managed, scalable, accessible anywhere
- **Cons**: May have costs
- **Best for**: Production deployments
- **Providers**: 
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (Recommended for Vercel deployments)
  - [Supabase](https://supabase.com/) (Free tier available)
  - [Neon](https://neon.tech/) (Serverless, free tier)
  - [Railway](https://railway.app/) (Free tier available)
  - AWS RDS, Google Cloud SQL, Azure Database

## Local PostgreSQL Setup

### macOS

```bash
# Install using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb webbuilder

# Verify connection
psql webbuilder
```

### Ubuntu/Debian Linux

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE webbuilder;
CREATE USER webbuilder_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE webbuilder TO webbuilder_user;
\q
```

### Windows

1. **Download PostgreSQL installer**
   - Visit https://www.postgresql.org/download/windows/
   - Download and run the installer
   - Follow installation wizard

2. **Create database**
   - Open pgAdmin or use psql command line
   - Create database: `webbuilder`
   - Create user with appropriate permissions

## Docker PostgreSQL Setup

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: webbuilder-postgres
    environment:
      POSTGRES_DB: webbuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: webbuilder-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

Start the services:

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Check logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

## Cloud PostgreSQL Setup

### Vercel Postgres (Recommended for Vercel deployments)

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Create Postgres database**
   ```bash
   # Link your project
   vercel link

   # Create Postgres storage
   vercel postgres create
   ```

4. **Get connection string**
   - Go to Vercel dashboard → Your Project → Storage
   - Copy the connection string (starts with `postgres://`)
   - Save it for environment configuration

### Supabase

1. **Sign up**: https://supabase.com/dashboard
2. **Create new project**
   - Choose a project name
   - Set a strong database password
   - Select a region close to your users
3. **Get connection string**
   - Go to Project Settings → Database
   - Copy the Connection string (URI mode)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

### Neon

1. **Sign up**: https://console.neon.tech/
2. **Create new project**
   - Choose a project name
   - Select a region
3. **Get connection string**
   - Go to your project dashboard
   - Copy the connection string
   - Format: `postgresql://[user]:[password]@[host]/[database]`

### Railway

1. **Sign up**: https://railway.app/
2. **New Project → Provision PostgreSQL**
3. **Get connection string**
   - Click on PostgreSQL service
   - Go to Connect tab
   - Copy the connection URL

## Database Initialization

Once you have PostgreSQL running, initialize the database:

```bash
# Navigate to the web app directory
cd apps/web

# Install dependencies if you haven't already
pnpm install

# Generate Prisma Client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed database with initial data
pnpm db:seed
```

### What Each Command Does

- **`pnpm db:generate`**: Generates Prisma Client based on your schema
- **`pnpm db:migrate`**: Creates database tables and applies schema changes
- **`pnpm db:seed`**: Populates database with sample data (users, templates, etc.)

### Verify Database Setup

```bash
# Check if tables were created
psql -d webbuilder -c "\dt"

# Or using Docker
docker exec -it webbuilder-postgres psql -U postgres -d webbuilder -c "\dt"
```

You should see tables like:
- `User`
- `Account`
- `Session`
- `Project`
- `Template`
- `ApiUsage`
- etc.

## Environment Configuration

### Local Development

Create `.env.local` file in `apps/web/` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/webbuilder"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="generate-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# AI Services (Required)
OPENAI_API_KEY="sk-your-openai-api-key"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Vercel Production

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Settings" → "Environment Variables"

2. **Add Environment Variables**

   Add each variable individually:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview |
   | `REDIS_URL` | Your Redis connection string | Production, Preview |
   | `NEXTAUTH_SECRET` | Random 32-char string | Production, Preview |
   | `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
   | `NEXTAUTH_URL` | Auto (Vercel sets this) | Preview |
   | `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview |
   | `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |
   | `NEXT_PUBLIC_APP_URL` | Auto (Vercel sets this) | Preview |

   **Important Notes:**
   - Set values directly, NOT as secret references
   - For Preview deployments, some variables like `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` can be left to auto-detect
   - Sensitive values like API keys and DATABASE_URL are automatically encrypted by Vercel

3. **Optional Variables (if using)**

   | Variable Name | Description |
   |---------------|-------------|
   | `STRIPE_SECRET_KEY` | Stripe payment processing |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature |
   | `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
   | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
   | `GITHUB_CLIENT_ID` | GitHub OAuth |
   | `GITHUB_CLIENT_SECRET` | GitHub OAuth secret |

4. **Redeploy**
   - After adding environment variables
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"

## Testing

### Test Database Connection

```bash
# From project root
cd apps/web

# Test Prisma connection
pnpm prisma db execute --stdin <<< "SELECT 1;" --url="$DATABASE_URL"

# Or use npx
npx prisma db execute --stdin <<< "SELECT 1;" --url="$DATABASE_URL"
```

### Test Authentication

1. **Start development server**
   ```bash
   pnpm dev
   ```

2. **Navigate to authentication**
   - Open http://localhost:3000/auth/register
   - Create a test account
   - Try logging in

3. **Default seed credentials** (if you ran `pnpm db:seed`):
   - **Email**: `demo@example.com`
   - **Password**: `demo1234`
   - **Email**: `admin@example.com`
   - **Password**: `admin1234`

### Test AI Features

1. **Verify OpenAI API key**
   ```bash
   # Test API connection
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

2. **Try AI Builder**
   - Login to your account
   - Navigate to `/ai-builder`
   - Test component generation
   - Test style generation

## Troubleshooting

### Connection Refused

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions**:
1. Check if PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready

   # Check process
   ps aux | grep postgres

   # Docker
   docker ps | grep postgres
   ```

2. Verify DATABASE_URL:
   ```bash
   echo $DATABASE_URL
   # Should match your PostgreSQL connection details
   ```

3. Check PostgreSQL is listening:
   ```bash
   # macOS/Linux
   sudo lsof -i :5432

   # Or check PostgreSQL config
   psql -c "SHOW port;"
   ```

### Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solutions**:
1. Verify credentials in DATABASE_URL
2. Reset PostgreSQL password:
   ```bash
   # macOS/Linux
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'newpassword';
   \q
   ```
3. Check `pg_hba.conf` authentication settings

### Migration Failed

**Error**: `Database schema drift detected`

**Solutions**:
1. Reset database (⚠️ deletes all data):
   ```bash
   pnpm prisma migrate reset
   ```

2. Or manually drop and recreate:
   ```bash
   dropdb webbuilder
   createdb webbuilder
   pnpm db:migrate
   pnpm db:seed
   ```

### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd apps/web
pnpm db:generate
```

### Vercel Deployment Error: Secret Not Found

**Error**: `Environment Variable "X" references Secret "y", which does not exist`

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Delete all environment variables that reference secrets
3. Add them again as plain values (Vercel encrypts them automatically)
4. Redeploy

### OpenAI API Errors

**Error**: `401 Unauthorized` or `429 Rate Limit`

**Solutions**:
1. Verify API key is correct:
   ```bash
   echo $OPENAI_API_KEY
   ```
2. Check OpenAI account has credits: https://platform.openai.com/usage
3. Verify API key permissions
4. Check rate limits for your OpenAI tier

### Redis Connection Issues

**Error**: `Error connecting to Redis`

**Solutions**:
1. Redis is optional for development - you can skip it
2. Start Redis:
   ```bash
   # macOS
   brew services start redis

   # Ubuntu/Debian
   sudo systemctl start redis

   # Docker
   docker-compose up -d redis
   ```

## Production Checklist

Before deploying to production:

- [ ] PostgreSQL database is set up (cloud hosted recommended)
- [ ] Database migrations have been run
- [ ] All required environment variables are configured in Vercel
- [ ] `NEXTAUTH_SECRET` is a secure random string (not the example value)
- [ ] `DATABASE_URL` uses SSL connection (`?sslmode=require`)
- [ ] OpenAI API key is valid and has sufficient credits
- [ ] Tested authentication flow in preview deployment
- [ ] Tested AI features in preview deployment
- [ ] Backups are configured for production database

## Next Steps

After completing database setup:

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Test Application**
   - Visit http://localhost:3000
   - Create an account or use seed credentials
   - Test AI builder features
   - Test authentication flows

3. **Deploy to Vercel**
   - Push to main branch or trigger workflow manually
   - Monitor deployment in GitHub Actions
   - Verify production deployment works

4. **Configure Additional Features** (Optional)
   - Stripe payment integration
   - OAuth providers (GitHub, Google)
   - Email service for password resets
   - Analytics and monitoring

## Support

- **Documentation**: See other docs in `/docs` folder
- **Issues**: https://github.com/ddefi0175-netizen/webbuilder/issues
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres

---

**Last Updated**: January 2026
