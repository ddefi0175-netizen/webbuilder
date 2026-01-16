# Backend Setup Guide

This guide will help you set up the complete backend infrastructure for AI WebBuilder including authentication, database, and API security.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or cloud)
- Redis (optional, for rate limiting)
- pnpm 8+

## Environment Setup

### 1. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb webbuilder

# Get connection URL
echo "postgresql://$(whoami)@localhost:5432/webbuilder"
```

#### Option B: Cloud Database (Recommended for Production)

Services like [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech) offer free PostgreSQL databases.

### 2. Redis Setup (Optional but Recommended)

#### Option A: Local Redis

```bash
# Install Redis (macOS)
brew install redis
brew services start redis
```

#### Option B: Upstash (Recommended)

1. Sign up at [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and token

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update the following required variables in `.env.local`:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/webbuilder"

# NextAuth (Required)
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (Required for AI features)
OPENAI_API_KEY="sk-..."

# Rate Limiting (Optional but recommended)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

## Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
cd apps/web
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed the database with test data
pnpm db:seed
```

## Database Migrations

### Create a new migration

```bash
cd apps/web
pnpm db:migrate
```

### Apply migrations in production

```bash
cd apps/web
pnpm db:migrate:deploy
```

### Reset database (development only)

```bash
cd apps/web
pnpm db:reset
```

### Open Prisma Studio (Database GUI)

```bash
cd apps/web
pnpm db:studio
```

## Test Credentials

After seeding, you can use these test accounts:

- **Admin**: `admin@webbuilder.dev` / `Test1234!`
- **User**: `user@webbuilder.dev` / `Test1234!`

## OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### GitHub OAuth

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

## Running the Application

```bash
# From root directory
pnpm dev

# Or from apps/web
cd apps/web
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - Login (NextAuth)
- `POST /api/auth/signout` - Logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile
- `GET /api/user/usage` - Get usage statistics
- `GET /api/user/projects` - List projects
- `POST /api/user/projects` - Create project
- `PATCH /api/user/projects/:id` - Update project
- `DELETE /api/user/projects/:id` - Delete project

### AI Endpoints (Protected)

All AI endpoints require authentication and deduct credits:

- `POST /api/ai/chat` - AI chat (1 credit)
- `POST /api/ai/generate-component` - Generate component (5 credits)
- `POST /api/ai/generate-styles` - Generate styles (2 credits)
- `POST /api/ai/explain` - Explain code (free)
- `POST /api/ai/auto-build` - Auto-build website (20 credits)

## Security Features

✅ Password hashing with bcrypt  
✅ JWT-based session management  
✅ Email verification  
✅ Password reset flow  
✅ Rate limiting (with Redis)  
✅ Input validation (Zod)  
✅ SQL injection prevention (Prisma)  
✅ XSS prevention  
✅ CSRF protection  
✅ Security headers  

## Credit System

- **Free Tier**: 100 credits
- **Pro Tier**: 1,000 credits
- **Business Tier**: 10,000 credits

Credits are used for AI operations and reset monthly for paid tiers.

## Rate Limits

| Tier | Requests per Hour | AI Requests per Hour |
|------|-------------------|---------------------|
| Anonymous | 10 / 15 min | N/A |
| Free | 50 | 20 |
| Pro | 500 | 500 |
| Business | 5000 | 5000 |

## Troubleshooting

### Database connection errors

```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection URL
echo $DATABASE_URL
```

### Prisma Client errors

```bash
# Regenerate Prisma Client
cd apps/web
pnpm db:generate
```

### Migration errors

```bash
# Reset database (WARNING: This deletes all data)
cd apps/web
pnpm db:reset
```

### Rate limiting not working

If Redis is not configured, rate limiting will be disabled in development. For production, configure Upstash Redis.

## Production Deployment

### Environment Variables

Ensure all required environment variables are set:

- `DATABASE_URL` - Production database
- `NEXTAUTH_SECRET` - Secure secret (different from dev)
- `NEXTAUTH_URL` - Production URL
- `OPENAI_API_KEY` - Production API key
- `UPSTASH_REDIS_REST_URL` - Production Redis
- `UPSTASH_REDIS_REST_TOKEN` - Production Redis token

### Database Migrations

```bash
cd apps/web
pnpm db:migrate:deploy
```

### Security Checklist

- [ ] Use HTTPS
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Configure CORS properly
- [ ] Enable rate limiting with Redis
- [ ] Set strong database passwords
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Monitor API usage and errors

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Upstash Documentation](https://docs.upstash.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## Support

If you encounter any issues, please check:

1. All environment variables are set correctly
2. Database is running and accessible
3. Dependencies are installed: `pnpm install`
4. Prisma Client is generated: `pnpm db:generate`
5. Migrations are applied: `pnpm db:migrate`

For more help, open an issue on GitHub.
