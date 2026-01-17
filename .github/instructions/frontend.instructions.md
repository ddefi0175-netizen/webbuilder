# Frontend (apps/web) - Specific Instructions

**Applies to:** `apps/web/**`

## Next.js 14 App Router

### Route Structure
- **App Router**: All routes in `src/app/` directory
- **API Routes**: `src/app/api/[route]/route.ts` using route handlers
- **Server Components**: Default - add `'use client'` only when needed
- **Layouts**: Use `layout.tsx` for shared UI across routes

### Client vs Server Components
```typescript
// Server Component (default) - can directly access backend
export default async function Page() {
  const data = await fetchData() // Direct DB/API calls OK
  return <div>{data}</div>
}

// Client Component - for interactivity
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Rules:**
- Use server components by default
- Only add `'use client'` when you need:
  - React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Zustand stores

## Component Patterns

### shadcn/ui Components
Located in `src/components/ui/` - DO NOT modify these directly:
- Button, Input, Dialog, Dropdown, etc.
- Import and use as-is
- To customize, create wrapper components

### Editor Components
Located in `src/components/editor/`:
- `Canvas`: Main visual editor area
- `ComponentTree`: Hierarchical component view
- `PropertiesPanel`: Component property editor
- `AIAssistant`: AI chat interface

**Pattern**: All editor components connect to stores via hooks

### Canvas Component Rendering
Each canvas component type has a renderer:
```typescript
// components/editor/renderers/[type]-renderer.tsx
export function ButtonRenderer({ component }: { component: Component }) {
  const { props, styles } = component
  return <button style={styles}>{props.text}</button>
}
```

## State Management (Zustand)

### Store Access Pattern
```typescript
// GOOD - Selector pattern (prevents unnecessary re-renders)
const selectedId = useEditorStore(state => state.selectedComponentId)
const selectComponent = useEditorStore(state => state.selectComponent)

// AVOID - Full store access
const store = useEditorStore()
```

### Mutating State with Immer
```typescript
// In store definition
set(produce((draft) => {
  draft.components.set(id, newComponent) // Direct mutation OK with immer
  draft.selectedComponentId = id
}))
```

## Styling

### Tailwind Usage
- Use Tailwind classes for UI chrome (panels, buttons, menus)
- Use inline styles for canvas components (user-editable)
- Use `cn()` utility for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils'
  <div className={cn('base-class', isActive && 'active-class')} />
  ```

### Responsive Design
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Canvas has its own breakpoint state for preview
- Don't mix canvas breakpoints with Tailwind breakpoints

## API Routes

### Route Handler Pattern
```typescript
// app/api/[route]/route.ts
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validation
    if (!body.required_field) {
      return Response.json({ error: 'Missing field' }, { status: 400 })
    }
    
    // Process
    const result = await processData(body)
    
    return Response.json(result)
  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### Streaming Responses
For AI streaming:
```typescript
export async function POST(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of aiService.chat(messages)) {
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

## Testing

### Frontend Test Structure
Tests in `src/__tests__/` mirror `src/` structure:
```
src/
  components/
    editor/
      canvas.tsx
  __tests__/
    components/
      editor/
        canvas.test.tsx
```

### Testing Components
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Canvas', () => {
  it('renders selected component', () => {
    render(<Canvas />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  
  it('handles click events', async () => {
    const user = userEvent.setup()
    render(<Canvas />)
    await user.click(screen.getByText('Click me'))
    // Assertions
  })
})
```

### Testing Stores
```typescript
import { renderHook, act } from '@testing-library/react'

describe('useEditorStore', () => {
  it('updates selected component', () => {
    const { result } = renderHook(() => useEditorStore())
    
    act(() => {
      result.current.selectComponent('component-1')
    })
    
    expect(result.current.selectedComponentId).toBe('component-1')
  })
})
```

## Performance

### Code Splitting
- Use dynamic imports for heavy components:
  ```typescript
  const HeavyComponent = dynamic(() => import('./heavy-component'), {
    loading: () => <Spinner />,
    ssr: false // If client-only
  })
  ```

### Memoization
- Use `useMemo` for expensive computations
- Use `useCallback` for callbacks passed to children
- Use `React.memo` for pure components that re-render often

### Image Optimization
- Use Next.js `<Image>` component
- Specify width/height or fill with container
- Use appropriate sizes for responsive images

## Common Pitfalls

1. **Hydration Errors**: Ensure server and client render the same initial HTML
2. **Missing 'use client'**: Add directive when using hooks or event handlers
3. **Route Caching**: Next.js caches routes - use `revalidate` or `cache: 'no-store'`
4. **Store Subscriptions**: Clean up subscriptions in useEffect return
5. **Key Props**: Always provide unique keys in lists (use component IDs)
