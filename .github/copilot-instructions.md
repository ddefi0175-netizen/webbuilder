# AI WebBuilder - Copilot Instructions

## Project Overview

AI-powered web builder combining visual drag-and-drop editing with AI code generation. Turborepo monorepo with Next.js 14 frontend and shared AI service layer.

## Architecture

### Monorepo Structure
- **apps/web**: Next.js 14 app with App Router (main user-facing application)
- **packages/ai-core**: Shared AI service layer (OpenAI integration, prompts, types)
- **Turborepo**: Build orchestration - use `pnpm dev` to run all apps, `turbo` commands for builds

### State Management Pattern
Global state uses **Zustand with immer middleware** for immutable updates:
- `editor-store.ts`: Canvas, component tree (Map<id, Component>), selection, history (undo/redo)
- `ai-store.ts`: Chat messages, streaming state, suggestions
- `user-store.ts`: Auth, subscription, credits

**Key Convention**: Component tree stored as `Map<string, Component>` not array. Use `getComponent(id)`, `getChildren(id)` helpers.

### Component System
Components are data structures (not React components) rendered from definitions:
- `component-definitions.ts`: Metadata for each component type (default props/styles, categories)
- `types/index.ts`: Core types (`Component`, `ComponentStyles`, `ComponentType`)
- Each component has: `id`, `type`, `props`, `styles`, `children[]`, `parentId`

**Adding new component types**: Update `ComponentType` union → add definition → implement renderer

## Development Workflows

### Running Locally
```bash
pnpm install           # Install all workspace deps
pnpm dev              # Start all apps (Next.js on :3000)
pnpm build            # Production build all packages
pnpm test             # Run Vitest tests
pnpm lint             # ESLint across workspace
```

### Testing
- **Framework**: Vitest with jsdom
- **Location**: `apps/web/src/__tests__/` mirroring src structure
- **Config**: `vitest.config.ts` - path aliases match tsconfig
- **Run**: `pnpm test` or `pnpm test:coverage`

**Pattern**: Test stores with immer state updates, mock external API calls

### Path Aliases
TypeScript paths in `apps/web/tsconfig.json`:
- `@/*` → `./src/*`
- `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/stores/*`, `@/types/*`

**Always use aliases** in imports: `import { useEditorStore } from '@/stores/editor-store'`

## AI Integration

### AI Service Architecture
- **Package**: `packages/ai-core/src/ai-service.ts`
- **Provider**: OpenAI SDK (GPT-4 for chat, GPT-3.5 for fast operations)
- **Pattern**: Streaming responses for chat, structured JSON for code generation

### Key AI Operations
```typescript
// Component generation
generateComponent(description: string): Promise<ComponentGenerationResult>

// Style generation (Tailwind-friendly CSS)
generateStyles(description: string, targetComponent): Promise<StyleGenerationResult>

// Streaming chat
chat(messages: ChatMessage[], context?: AIContext): AsyncGenerator<string>
```

**API Routes**: Located in `apps/web/src/app/api/ai/` (Next.js route handlers)
- `/api/ai/chat` - Streaming chat responses
- `/api/ai/generate-component` - Component generation
- `/api/ai/generate-styles` - Style modifications

### Context Handling
AI operations receive `AIContext` with:
- Current component tree
- Selected component details
- Canvas breakpoint state

**Critical**: Always pass editor context to AI for context-aware suggestions

## Code Conventions

### Component IDs
- Generated with `nanoid()` from `@/lib/utils`
- Root component always has id `'root'`
- Never hardcode IDs except root

### History/Undo System
- `editor-store.ts` maintains `history: HistoryEntry[]` and `historyIndex`
- **Call `saveHistory()`** before mutations to enable undo
- Undo/redo operations restore entire component tree state

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
export async function POST(req: Request) {
  const body = await req.json()
  // Process
  return Response.json(result)
}
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
