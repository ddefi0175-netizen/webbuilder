# Deployment Guide

This guide explains how to set up automated deployments to Vercel using GitHub Actions.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
  - [Step 1: Get Your Vercel Token](#step-1-get-your-vercel-token)
  - [Step 2: Add Secrets to GitHub](#step-2-add-secrets-to-github)
  - [Step 3: Set Up Vercel Project](#step-3-set-up-vercel-project)
  - [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
- [First Deployment](#first-deployment)
- [Deployment Workflow](#deployment-workflow)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Prerequisites

Before you begin, ensure you have:

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A GitHub repository with the WebBuilder project
- Admin access to the GitHub repository (to add secrets)
- Node.js 20+ and pnpm 8+ installed locally (for testing)

## Quick Start

If you're already familiar with Vercel and GitHub Actions, here's the quick version:

1. Generate a Vercel token: https://vercel.com/account/tokens
2. Add `VERCEL_TOKEN` to GitHub Secrets (Settings → Secrets → Actions)
3. Push to `main` branch or manually trigger the workflow
4. Monitor deployment in Actions tab

**Note:** The first deployment may require additional setup in Vercel dashboard for environment variables.

## Detailed Setup Instructions

### Step 1: Get Your Vercel Token

A Vercel token allows GitHub Actions to deploy on your behalf.

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign in with your account

2. **Navigate to Tokens page**
   - Click on your profile picture (top right)
   - Select "Settings" from the dropdown
   - Click "Tokens" in the left sidebar
   - Or go directly to: https://vercel.com/account/tokens

3. **Create a new token**
   - Click "Create Token" button
   - Give it a descriptive name (e.g., "GitHub Actions - WebBuilder")
   - Select appropriate scope:
     - For most cases, select "Full Account" scope
     - This allows deployment to any project in your account
   - Set expiration as needed (recommend: No Expiration for CI/CD)
   - Click "Create Token"

4. **Copy the token**
   - ⚠️ **Important:** Copy the token immediately
   - You won't be able to see it again
   - Store it temporarily in a secure location (password manager recommended)

### Step 2: Add Secrets to GitHub

GitHub Secrets securely store sensitive data like API tokens.

1. **Navigate to repository settings**
   - Go to your GitHub repository
   - Click "Settings" tab (top right)
   - Click "Secrets and variables" in left sidebar
   - Click "Actions"

2. **Add VERCEL_TOKEN**
   - Click "New repository secret" button
   - Name: `VERCEL_TOKEN`
   - Value: Paste the token you copied from Vercel
   - Click "Add secret"

3. **Verify secret was added**
   - You should see `VERCEL_TOKEN` in the list of secrets
   - The value will be hidden (shows as `***`)

#### Optional Secrets

These are optional and will be auto-detected if not provided:

- **VERCEL_ORG_ID**: Your Vercel organization/team ID
- **VERCEL_PROJECT_ID**: Your specific project ID

To find these IDs:
1. Deploy once to Vercel (manually or via CLI)
2. Check the `.vercel/project.json` file that gets created
3. Add as GitHub secrets if you want to lock deployment to specific project

### Step 3: Set Up Vercel Project

The first time you deploy, Vercel will create a project automatically. However, you can pre-configure it:

#### Option A: Automatic Setup (Recommended)

Let the GitHub Actions workflow create the project automatically on first deployment:

1. Push code to `main` branch
2. The workflow will run and create a new Vercel project
3. The project will be linked automatically

#### Option B: Manual Setup

1. **Create project in Vercel dashboard**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: `Next.js`
     - Build Command: `pnpm build` (or leave default)
     - Output Directory: `.next` (or leave default)
     - Install Command: `pnpm install`
     - Root Directory: `apps/web` (for monorepo) or `.` (for single app)

2. **Note the project details**
   - After creation, you'll see your project dashboard
   - Note the project name and URL

### Step 4: Configure Environment Variables

The WebBuilder app requires certain environment variables to function properly.

#### Required Environment Variables in Vercel

1. **Go to Vercel project settings**
   - Navigate to your project in Vercel dashboard
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

2. **Add required variables**

   For production, add at minimum:

   ```
   NEXT_PUBLIC_APP_URL
   Value: https://your-project.vercel.app (your production URL)
   Environment: Production

   OPENAI_API_KEY
   Value: sk-... (your OpenAI API key)
   Environment: Production, Preview, Development
   
   NEXTAUTH_SECRET
   Value: (generate a secure random string)
   Environment: Production, Preview, Development
   
   NEXTAUTH_URL
   Value: https://your-project.vercel.app (same as NEXT_PUBLIC_APP_URL)
   Environment: Production
   ```

   **Note:** These environment variables must be configured in Vercel's dashboard. They are not stored in the repository for security reasons.

   Other optional variables from `.env.example`:
   - `NEXT_PUBLIC_API_URL` - Your API endpoint
   - `STRIPE_SECRET_KEY` - For payment processing (if using Stripe)
   - `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
   - Database credentials (if applicable)
   - Any other API keys your app needs

3. **Environment-specific variables**
   - **Production**: Live environment, real API keys
   - **Preview**: Pull request deployments, can use test keys
   - **Development**: Local development, test keys

## First Deployment

### Via GitHub Actions (Recommended)

1. **Ensure all secrets are configured**
   - Verify `VERCEL_TOKEN` is in GitHub Secrets
   - Verify environment variables are in Vercel project settings

2. **Trigger deployment**
   - Push a commit to `main` branch, or
   - Go to Actions tab → Deploy workflow → "Run workflow"

3. **Monitor the deployment**
   - Go to "Actions" tab in your GitHub repository
   - Click on the running workflow
   - Expand each step to see progress
   - Wait for "Deploy Production to Vercel" step to complete

4. **Verify deployment**
   - Check the workflow output for deployment URL
   - Visit the URL to verify your app is running
   - Check Vercel dashboard for deployment details

### Via Vercel CLI (Alternative)

If GitHub Actions fails, you can deploy manually:

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Deployment Workflow

The repository includes a GitHub Actions workflow that automatically deploys:

### When Does It Deploy?

- **Production**: Automatically on every push to `main` branch
- **Preview**: Automatically on pull requests (if workflow is updated to enable)
- **Manual**: Via "Run workflow" button in Actions tab

### Deployment Process

1. **Checkout**: Code is checked out from repository
2. **Validation**: Checks if `VERCEL_TOKEN` is configured
3. **Setup**: Installs Node.js, pnpm, and Vercel CLI
4. **Pull Config**: Downloads Vercel project configuration
5. **Build**: Runs production build using Vercel's build system
6. **Deploy**: Uploads and deploys to Vercel
7. **Notify**: Reports success or failure

### Build Output

The workflow uses Vercel's build system which:
- Detects Next.js automatically
- Installs dependencies with pnpm
- Builds the application
- Optimizes for production
- Generates serverless functions

## Troubleshooting

### Common Errors and Solutions

#### Error: "VERCEL_TOKEN secret is not configured"

**Cause:** The `VERCEL_TOKEN` secret is missing or misspelled in GitHub Secrets.

**Solution:**
1. Go to GitHub repository → Settings → Secrets → Actions
2. Verify `VERCEL_TOKEN` exists (case-sensitive)
3. If missing, add it following [Step 2](#step-2-add-secrets-to-github)
4. If it exists, regenerate the token in Vercel and update the secret

#### Error: "No existing credentials found. Please run 'vercel login' or pass '--token'"

**Cause:** The token is not being passed correctly or is invalid.

**Solution:**
1. Verify the token in GitHub Secrets is correct
2. Regenerate the token in Vercel:
   - Go to https://vercel.com/account/tokens
   - Delete old token
   - Create new token
   - Update GitHub Secret with new token
3. Check that the workflow file correctly references `${{ secrets.VERCEL_TOKEN }}`

#### Error: "Environment Variable 'X' references Secret 'y', which does not exist"

**Cause:** The Vercel project expects an environment variable that references a secret not configured in Vercel.

**Solution:**
1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add the missing environment variable:
   - If it should be a secret, add it to Vercel Secrets first
   - Then reference it in environment variables
   - Or add it directly as a plaintext value if not sensitive
3. Common missing variables:
   - `NEXT_PUBLIC_APP_URL`
   - `OPENAI_API_KEY`
   - Database connection strings

**Quick fix for NEXT_PUBLIC_APP_URL:**
1. In Vercel dashboard, go to your project
2. Settings → Environment Variables
3. Add:
   - Key: `NEXT_PUBLIC_APP_URL`
   - Value: `https://your-project.vercel.app` (use your actual Vercel URL)
   - Environments: All (Production, Preview, Development)

#### Error: "Project not found"

**Cause:** The workflow can't find the Vercel project to deploy to.

**Solution:**
1. Ensure the project exists in Vercel dashboard
2. Check if `.vercel/project.json` exists in repository
3. If missing, do a manual deploy first: `vercel --prod`
4. Commit the `.vercel` directory (except `.vercel/.env*` files)

#### Error: "Build failed" or "Command failed"

**Cause:** The application build is failing.

**Solution:**
1. Check the build logs in GitHub Actions for specific error
2. Test the build locally:
   ```bash
   pnpm install
   pnpm build
   ```
3. Common causes:
   - Missing dependencies: Run `pnpm install`
   - TypeScript errors: Run `pnpm typecheck`
   - ESLint errors: Run `pnpm lint`
   - Missing environment variables: Check `.env.example`

#### Error: "Failed to upload deployment files"

**Cause:** Network issues or Vercel API problems.

**Solution:**
1. Re-run the workflow (sometimes temporary)
2. Check Vercel status: https://www.vercel-status.com/
3. Reduce deployment size by checking `.vercelignore` file

#### Deployment succeeds but app doesn't work

**Causes:** Missing environment variables or runtime errors.

**Solution:**
1. Check Vercel project logs:
   - Go to Vercel dashboard
   - Click on your deployment
   - Click "Functions" to see runtime logs
2. Verify all environment variables are set in Vercel
3. Check browser console for client-side errors
4. Verify API endpoints are accessible

### Debugging Tips

1. **Check GitHub Actions logs**
   - Actions tab → Click on failed workflow
   - Expand each step to see detailed output
   - Look for red error messages

2. **Check Vercel deployment logs**
   - Vercel dashboard → Your project → Deployments
   - Click on specific deployment
   - View build logs and runtime logs

3. **Test locally first**
   ```bash
   # Install dependencies
   pnpm install

   # Build the app
   pnpm build

   # Test production build
   pnpm start
   ```

4. **Validate environment variables**
   - Compare `.env.example` with Vercel environment variables
   - Ensure all required variables are set
   - Check that variable names match exactly (case-sensitive)

5. **Manual deployment test**
   ```bash
   # Login
   vercel login

   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

## Advanced Configuration

### Custom Domain

1. **Add domain in Vercel**
   - Vercel dashboard → Your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables**
   - Update `NEXT_PUBLIC_APP_URL` to use your custom domain
   - Update any other URL-dependent variables

### Deployment Branches

To deploy from branches other than `main`:

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [main, staging, develop]  # Add your branches
```

### Preview Deployments

To enable preview deployments on pull requests:

1. The workflow already includes a `deploy-preview` job
2. It's currently set to only run on PRs: `if: github.event_name == 'pull_request'`
3. Ensure you push to a PR to test preview deployments

### Environment-specific Configuration

Use different configurations per environment:

```yaml
# In workflow file
- name: Deploy
  env:
    VERCEL_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'preview' }}
  run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
```

### Monorepo Configuration

For monorepo deployments (this project uses Turborepo):

1. **Place `vercel.json` in the app directory (`apps/web`)**:
   - The `vercel.json` file must be located in `apps/web` directory, not at repository root
   - This ensures Vercel can properly detect Next.js and dependencies
   
2. **Use relative path commands in `vercel.json`**:
   ```json
   {
     "buildCommand": "cd ../.. && pnpm --filter @webbuilder/web db:generate && pnpm --filter @webbuilder/ai-core build && pnpm --filter @webbuilder/web build",
     "installCommand": "cd ../.. && pnpm install"
   }
   ```
   - Commands use `cd ../..` to navigate from `apps/web` to repository root
   - This allows pnpm workspace commands to work correctly

3. **Ensure Vercel project settings**
   - Set Root Directory to `apps/web` in Vercel project settings
   - The workflow should be run from repository root

### Deployment Notifications

Add notifications on deployment success/failure:

1. **Slack**: Use Slack GitHub app or webhook
2. **Discord**: Use Discord webhook action
3. **Email**: Configure GitHub notification settings

Example Slack notification:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ github.repository }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Project Issues**: https://github.com/ddefi0175-netizen/webbuilder/issues
- **Vercel Support**: https://vercel.com/support

## Security Notes

- Never commit the `.vercel/.env.*.local` files (they contain secrets)
- Never share your `VERCEL_TOKEN` publicly
- Use environment-specific secrets (different keys for production vs preview)
- Regularly rotate your Vercel tokens
- Review Vercel access logs periodically
- Use Vercel's secret management for sensitive environment variables

---

**Last Updated**: January 2026
**Vercel CLI Version**: 50.4.5
**Next.js Version**: 14.0.4
