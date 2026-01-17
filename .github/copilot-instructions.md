# AI WebBuilder - Copilot Instructions

## Project Overview

AI-powered web builder combining visual drag-and-drop editing with AI code generation. Turborepo monorepo with Next.js 14 frontend and shared AI service layer backed by PostgreSQL, Prisma ORM, and OpenAI integration.

## Architecture

### Monorepo Structure
- **apps/web**: Next.js 14 App Router, React 18, Tailwind CSS, TypeScript
- **packages/ai-core**: Shared AI service layer (OpenAI integration, prompts, types)
- **Turborepo**: Build orchestration and caching - use `pnpm dev` to run all apps
- **Database**: PostgreSQL with Prisma ORM (schema in `apps/web/prisma/schema.prisma`)

### State Management
Global state uses **Zustand with immer middleware** for immutable updates:
- `editor-store.ts`: Canvas, component tree (`Map<id, Component>`), selection, history
- `ai-store.ts`: Chat messages, streaming state, suggestions
- `user-store.ts`: Auth, subscription, credits

**Key Pattern**: Component tree stored as `Map<string, Component>` NOT array. Always use `getComponent(id)`, `getChildren(id)` helper methods.

### Component System
Components are data structures (not React components) rendered by `ComponentRenderer`:
- `component-definitions.ts`: Metadata for each type (default props/styles, categories)
- `types/index.ts`: Core types (`Component`, `ComponentStyles`, `ComponentType`)
- Each component: `id` (nanoid), `type`, `props`, `styles`, `children[]`, `parentId`
- Root component always has `id: 'root'` (never delete or hardcode elsewhere)

**Adding component types**: Update `ComponentType` union → add definition → implement renderer in `canvas/`

## Development Workflows

### Running Locally
```bash
pnpm install                # Install all workspace deps
pnpm dev                    # Start all apps (Next.js on :3000)
pnpm build                  # Production build all packages
pnpm test                   # Run all Vitest tests
pnpm lint                   # ESLint across workspace
pnpm typecheck              # TypeScript check
pnpm db:migrate             # Create new migration
pnpm db:push                # Push schema changes to dev DB
pnpm db:reset               # Reset database (dev only)
pnpm db:studio              # Open Prisma Studio
```

### Testing
- **Framework**: Vitest with jsdom (React component testing)
- **Location**: `apps/web/src/__tests__/` mirroring src structure
- **Config**: `vitest.config.ts` with path aliases matching tsconfig
- **Run**: `pnpm test` or `pnpm test:coverage`
- **Pattern**: Test stores with immer mutations, mock external API calls with vi.mock()

### Path Aliases (TypeScript)
In `apps/web/tsconfig.json`:
- `@/*` → `./src/*`
- Always use aliases: `import { useEditorStore } from '@/stores/editor-store'`

## AI Integration

### OpenAI Configuration
- **API Key**: `OPENAI_API_KEY` required in `.env.local` and Vercel
- **Chat Model**: `OPENAI_MODEL_CHAT` (default: `gpt-4-turbo-preview`)
- **Fast Model**: `OPENAI_MODEL_FAST` (default: `gpt-3.5-turbo`)
- **Instance Pattern**: Call `getOpenAIClient()` in each route to get fresh OpenAI instance

### AI Service Architecture
- **Package**: `packages/ai-core/src/ai-service.ts`
- **Provider**: OpenAI SDK (GPT-4 for chat, GPT-3.5 for fast operations)
- **Pattern**: Streaming responses for chat, structured JSON for code generation

### API Routes (Next.js Route Handlers)
Located in `apps/web/src/app/api/ai/`:
- `/api/ai/chat` - Streaming chat with context (uses `gpt-4-turbo-preview`)
- `/api/ai/generate-component` - JSON component structure (5 credits)
- `/api/ai/generate-styles` - Tailwind-compatible styles (2 credits)
- `/api/ai/explain` - Code explanation
- `/api/ai/auto-build` - Full website generation (20 credits)

**Route Pattern**: All routes require auth, track usage in DB, deduct credits, force dynamic rendering

### AI Context
Operations receive `AIContext` with:
- Selected component details for context-aware suggestions
- Current breakpoint state ('desktop' | 'tablet' | 'mobile')
- Recent editor actions
- Design system (colors, fonts, spacing)

### Credit System
- Store credits in `subscription.creditsRemaining`
- Deduct before/during AI operations, track in `usage` table
- Different operations cost different amounts (chat: 0, generate-component: 5, etc.)
- Track via `db.usage.create({ userId, type: 'ai_chat', amount: 1 })`

## Authentication & Security

### NextAuth Configuration
- **Strategy**: JWT sessions (30 days max age)
- **File**: `apps/web/src/lib/auth.ts`
- **Providers**: Credentials (email/password), Google OAuth, GitHub OAuth
- **Adapter**: Prisma for DB persistence
- **Middleware**: `apps/web/src/middleware.ts` - protects `/dashboard`, `/ai-builder`, `/credits`, `/templates`

**Auth Flow**:
1. Login via NextAuth provider
2. JWT stored in session
3. Use `getSession()` or `requireAuth()` in API routes
4. Redirect unauthenticated users to `/auth/login`

### Protected Routes Pattern
```typescript
// In API routes
import { requireAuth, getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await requireAuth(); // Throws 401 if no session
    const userId = session.user.id;
    // ...
}
```

### Rate Limiting
- **Service**: Upstash Redis (optional but recommended)
- **Functions**: `checkRateLimit()`, `getRateLimitIdentifier()`
- **Pattern**: Check before expensive operations (AI requests)
- **Config**: `apps/web/src/lib/rate-limit.ts`

## Database & Schema

### Prisma ORM
- **Schema**: `apps/web/prisma/schema.prisma`
- **Client**: Auto-generated in `node_modules/.prisma/client`
- **Adapter**: PrismaAdapter for NextAuth
- **Connection**: PostgreSQL via `DATABASE_URL`

### Key Models
- **User**: Auth identity with subscription and usage tracking
- **Project**: User's created websites
- **Subscription**: Tier (FREE/PRO/BUSINESS), credits, status
- **Usage**: Track AI operation costs (type, amount, userId)
- **Session**: NextAuth session persistence

### Database Commands
```bash
pnpm db:generate   # Regenerate Prisma client after schema changes
pnpm db:migrate    # Create and run migrations
pnpm db:push       # Push schema to dev DB (non-production)
pnpm db:reset      # Reset DB completely (dev only)
pnpm db:studio     # GUI for DB inspection
```

## Code Conventions

### Component IDs
- Generated with `nanoid()` from `@/lib/utils`
- Root component always has id `'root'`
- Never hardcode IDs except root

### History/Undo System
- `editor-store.ts` maintains `history: HistoryEntry[]` and `historyIndex`
- **Call `saveHistory()`** before mutations to enable undo
- Undo/redo operations restore entire component tree state

### Database Interaction Pattern
```typescript
// Import Prisma client
import { db } from '@/lib/db';

// Query with auth check
const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
});

// Track usage
await db.usage.create({
    data: {
        userId,
        type: 'ai_generate_component',
        amount: 5, // Credits deducted
    }
});

// Update subscription credits
await db.subscription.update({
    where: { userId },
    data: { creditsRemaining: { decrement: 5 } }
});
```

### Keyboard Shortcuts
Defined in `use-keyboard-shortcuts.ts`:
- `Delete`/`Backspace`: Delete selected
- `Cmd/Ctrl+Z`: Undo
- `Cmd/Ctrl+Shift+Z`: Redo
- `Cmd/Ctrl+D`: Duplicate
- `Cmd/Ctrl+K`: Toggle AI panel

**Pattern**: Check `isInput` to prevent shortcuts when typing in form fields

### Styling Approach
- **Framework**: Tailwind CSS with `tailwind.config.ts`
- **Components**: shadcn/ui (Radix primitives + Tailwind)
- **Utilities**: `cn()` from `@/lib/utils` for conditional classes
- **Theme**: `next-themes` for dark mode

**Convention**: Generate inline styles for canvas components, use Tailwind classes for UI chrome

## Common Patterns

### Adding Canvas Components
1. Add type to `ComponentType` union in `types/index.ts`
2. Create definition in `component-definitions.ts` (category, default props/styles)
3. Implement renderer in canvas (check existing patterns)
4. Update AI prompts in `packages/ai-core/src/prompts.ts`

### Editor Operations Flow
```typescript
// Select → Modify → Save History → Update Store
selectComponent(id)
saveHistory()  // Before mutation!
updateComponent(id, updates)
```

### API Route Pattern (Next.js App Router)
```typescript
// apps/web/src/app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  const userId = session.user.id;

  // Rate limiting
  await checkRateLimit(userId);

  const body = await req.json();

  // Business logic

  // Track usage
  await db.usage.create({
    data: { userId, type: 'operation_type', amount: 1 }
  });

  return NextResponse.json(result);
}
```

### Environment Variables (Required)
In `.env.local` (development) or Vercel (production):
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Auth
NEXTAUTH_SECRET="random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# AI (REQUIRED)
OPENAI_API_KEY="sk-..."
OPENAI_MODEL_CHAT="gpt-4-turbo-preview"
OPENAI_MODEL_FAST="gpt-3.5-turbo"

# Optional
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
GOOGLE_CLIENT_ID="..."
GITHUB_ID="..."
```

## Critical Files for AI Agents

- [apps/web/src/stores/editor-store.ts](/workspaces/webbuilder/apps/web/src/stores/editor-store.ts) - All editor state/actions
- [apps/web/src/stores/ai-store.ts](/workspaces/webbuilder/apps/web/src/stores/ai-store.ts) - AI state/streaming
- [packages/ai-core/src/ai-service.ts](/workspaces/webbuilder/packages/ai-core/src/ai-service.ts) - AI service implementation
- [apps/web/src/lib/component-definitions.ts](/workspaces/webbuilder/apps/web/src/lib/component-definitions.ts) - Component metadata
- [apps/web/src/types/index.ts](/workspaces/webbuilder/apps/web/src/types/index.ts) - Core type definitions

## Gotchas

- **Component Map**: Store uses `Map` not array - iterate with `Array.from(components.values())`
- **Immer**: Zustand uses immer middleware - mutate state directly in set callbacks
- **Streaming**: AI responses stream - handle partial content in UI
- **Root Protection**: Prevent deletion/modification of root component (id === 'root')
- **Breakpoints**: Canvas has breakpoint state ('desktop' | 'tablet' | 'mobile') - consider responsive styles

## Security & Privacy

### Never Touch
- **Secrets**: Never commit API keys, tokens, or credentials to source code
- **Environment Files**: `.env.local`, `.env.production` stay local - never commit
- **User Data**: Never log or expose user data in development
- **Production Configs**: Never modify production deployment configs without review

### Security Practices
- Always validate user inputs in API routes
- Use environment variables for sensitive configuration
- Sanitize data before rendering to prevent XSS
- Use HTTPS for all external API calls
- Follow OWASP guidelines for web security

## Package Management

### Dependency Rules
- **Package Manager**: Always use `pnpm` (not npm or yarn)
- **Adding Dependencies**: Run `pnpm add <package>` in appropriate workspace
- **Workspace Protocol**: Use `workspace:*` for internal package dependencies
- **Version Pinning**: Pin major versions for production stability
- **Security**: Check for known vulnerabilities before adding dependencies

### Workspace Commands
```bash
# Install to specific workspace
pnpm add <package> --filter web           # Frontend app
pnpm add <package> --filter ai-core       # AI package

# Install to all workspaces
pnpm add -w <package>
```

## Troubleshooting

### Common Issues

**Build Errors**
- Clear `.next` and `node_modules`: `pnpm clean && pnpm install`
- Check Node version: `node -v` (must be 20+)
- Verify pnpm version: `pnpm -v` (must be 8+)

**Type Errors**
- Regenerate types: `pnpm typecheck`
- Check path aliases in `tsconfig.json`
- Restart TypeScript server in IDE

**Test Failures**
- Update snapshots: `pnpm test -- -u`
- Clear test cache: `pnpm test -- --clearCache`
- Check for missing test dependencies

**AI API Issues**
- Verify `OPENAI_API_KEY` in `.env.local`
- Check API rate limits and quotas
- Review streaming implementation for partial responses

**State Management Issues**
- Check Immer middleware is properly configured
- Verify store subscriptions are cleaned up
- Use React DevTools to inspect Zustand state

## Best Practices for AI Agents

### Code Changes
- Make minimal, focused changes
- Preserve existing functionality unless explicitly asked to modify
- Add tests for new features
- Update documentation when changing public APIs
- Follow existing code patterns and conventions

### Testing Strategy
- Run tests before making changes to understand baseline
- Add tests for new functionality
- Run affected tests after changes
- Don't remove or modify unrelated tests

### Review Process
- Self-review changes before committing
- Ensure all linting and type checks pass
- Verify functionality in development environment
- Consider edge cases and error handling
