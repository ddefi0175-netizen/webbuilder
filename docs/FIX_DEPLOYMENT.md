# Fix Deployment Errors - Quick Guide

This guide helps you fix the current deployment error and get your application running on Vercel.

## Current Issue

**Error Message:**
```
Error: Environment Variable "NEXT_PUBLIC_APP_URL" references Secret "next_public_app_url", which does not exist.
```

**Root Cause:**
Vercel environment variables are configured to reference non-existent secrets instead of being set directly.

## Solution: Reconfigure Vercel Environment Variables

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your WebBuilder project
3. Click **Settings** tab
4. Click **Environment Variables** in the sidebar

### Step 2: Remove Old Variable References

If you see any variables that reference secrets (they'll show `@secret-name`):

1. Click the **...** menu next to each variable
2. Select **Remove**
3. Confirm removal

Common variables to check:
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`
- `DATABASE_URL`
- `OPENAI_API_KEY`

### Step 3: Add Environment Variables Correctly

Add the following variables **as plain text values** (Vercel encrypts them automatically):

#### Required Variables

| Variable Name | Value | Environments |
|---------------|-------|--------------|
| **NEXT_PUBLIC_APP_URL** | `https://your-project.vercel.app` | Production |
| **NEXT_PUBLIC_APP_URL** | (Leave empty for auto) | Preview |
| **NEXTAUTH_SECRET** | [Generate secure random string]* | Production, Preview |
| **NEXTAUTH_URL** | `https://your-project.vercel.app` | Production |
| **NEXTAUTH_URL** | (Leave empty for auto) | Preview |
| **OPENAI_API_KEY** | `sk-your-openai-key` | Production, Preview |
| **DATABASE_URL** | [Your PostgreSQL connection string] | Production, Preview |

*Generate with: `openssl rand -base64 32`

#### How to Add Each Variable

For each variable:

1. Click **Add New** button
2. Enter the **Variable Name** (e.g., `NEXT_PUBLIC_APP_URL`)
3. Enter the **Value** (e.g., `https://your-project.vercel.app`)
4. Select which **Environments** it applies to:
   - ✓ Production (for production deployment)
   - ✓ Preview (for PR previews)
   - ☐ Development (optional, for local with Vercel CLI)
5. Click **Save**

**Important**: 
- Do NOT select "Create as Secret" or use `@secret-name` format
- Just enter the value directly
- Vercel automatically encrypts sensitive values

### Step 4: Get Your Vercel Project URL

If you don't know your project URL:

1. Go to Vercel dashboard
2. Click on your project
3. The URL is shown at the top (e.g., `webbuilder-abc123.vercel.app`)
4. Or go to **Domains** tab to see all domains

Use this URL for:
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`

### Step 5: Database Setup

If you haven't set up a database yet:

#### Option A: Vercel Postgres (Easiest)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Create Postgres database
vercel postgres create webbuilder-db

# Get connection string
vercel env pull .env.local
```

The `DATABASE_URL` will be automatically added to your Vercel environment variables.

#### Option B: Use External Provider

Choose a PostgreSQL provider:
- **Supabase**: https://supabase.com/ (Free tier)
- **Neon**: https://neon.tech/ (Serverless, free tier)
- **Railway**: https://railway.app/ (Free tier)

Then:
1. Create a PostgreSQL database
2. Copy the connection string
3. Add as `DATABASE_URL` in Vercel environment variables

**Format**: `postgresql://user:password@host:port/database?sslmode=require`

### Step 6: Initialize Database

Once DATABASE_URL is set:

```bash
# Clone repository
git clone https://github.com/ddefi0175-netizen/webbuilder.git
cd webbuilder

# Install dependencies
pnpm install

# Navigate to web app
cd apps/web

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database (optional - adds test users)
pnpm db:seed
```

Test credentials (after seeding):
- Email: `demo@example.com` / Password: `demo1234`
- Email: `admin@example.com` / Password: `admin1234`

### Step 7: Redeploy

After configuring all environment variables:

#### Option A: Via Vercel Dashboard

1. Go to your project in Vercel
2. Click **Deployments** tab
3. Find the latest deployment
4. Click **...** menu → **Redeploy**
5. Confirm redeployment

#### Option B: Via Git Push

```bash
# Make a small change (or use --allow-empty)
git commit --allow-empty -m "Trigger redeploy with fixed env vars"
git push origin main
```

#### Option C: Via GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy** workflow
4. Click **Run workflow** button
5. Select `main` branch
6. Click **Run workflow**

### Step 8: Verify Deployment

1. **Check deployment status**
   - Go to GitHub Actions tab
   - Or Vercel dashboard → Deployments
   - Wait for deployment to complete

2. **Test the application**
   - Visit your Vercel URL
   - Try to load the homepage
   - Try authentication (register/login)
   - Test AI features

3. **Check logs if issues persist**
   - Vercel Dashboard → Your deployment → **Function Logs**
   - GitHub Actions → Failed workflow → Expand steps

## Common Follow-up Issues

### Issue: "PrismaClient is unable to connect to the database"

**Solution**: 
1. Verify `DATABASE_URL` is correct in Vercel
2. Ensure database allows connections from Vercel IPs
3. Check connection string includes `?sslmode=require` for cloud databases

### Issue: "OpenAI API key is invalid"

**Solution**:
1. Verify API key starts with `sk-`
2. Check OpenAI dashboard: https://platform.openai.com/api-keys
3. Ensure API key has sufficient credits
4. Regenerate key if needed and update in Vercel

### Issue: "Authentication not working"

**Solution**:
1. Verify `NEXTAUTH_SECRET` is set (random 32-char string)
2. Verify `NEXTAUTH_URL` matches your actual Vercel URL
3. Check that database migrations ran successfully
4. Clear browser cookies and try again

### Issue: Still see "Secret does not exist" error

**Solution**:
1. Go back to Vercel Environment Variables
2. Find any variable that shows `@secret-name` in the value
3. Delete it completely
4. Re-add it with the actual value (no @ symbol)
5. Save and redeploy

## Environment Variables Checklist

Before redeploying, verify you have:

- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `OPENAI_API_KEY` - OpenAI API key (starts with sk-)
- [x] `NEXTAUTH_SECRET` - Random 32-character string
- [x] `NEXTAUTH_URL` - Your Vercel production URL
- [x] `NEXT_PUBLIC_APP_URL` - Your Vercel production URL

Optional but recommended:
- [ ] `REDIS_URL` - For rate limiting (can use Upstash)
- [ ] `STRIPE_SECRET_KEY` - If using payments
- [ ] `STRIPE_WEBHOOK_SECRET` - If using payments

## Testing Locally First

Before deploying to production, test locally:

```bash
# Create .env.local
cp .env.example apps/web/.env.local

# Edit .env.local with your values
nano apps/web/.env.local

# Install dependencies
pnpm install

# Run database setup
cd apps/web
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Start development server
cd ../..
pnpm dev

# Open http://localhost:3000
```

If it works locally, it should work on Vercel with the same environment variables.

## Need More Help?

- **Full Setup Guide**: See `docs/DATABASE_SETUP.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md` (if available)
- **Create Issue**: https://github.com/ddefi0175-netizen/webbuilder/issues

## Quick Commands Reference

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Reset database (⚠️ deletes data)
pnpm prisma migrate reset

# Check Vercel env vars
vercel env ls

# Pull Vercel env vars locally
vercel env pull .env.local

# Deploy manually
vercel --prod
```

---

**Last Updated**: January 2026

**Next Steps After Fix**:
1. ✅ Fix Vercel environment variables (this guide)
2. ✅ Redeploy successfully
3. ✅ Test authentication
4. ✅ Test AI features
5. ✅ Configure optional features (payments, OAuth, etc.)
