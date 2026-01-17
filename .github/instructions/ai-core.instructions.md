# AI Core Package - Specific Instructions

**Applies to:** `packages/ai-core/**`

## Overview

The AI core package provides shared AI functionality across the monorepo. This is a pure TypeScript package (no React) that can be used by both frontend and backend.

## Architecture

### Service Layer
- **Location**: `src/ai-service.ts`
- **Purpose**: Main AI service interface
- **Provider**: OpenAI SDK
- **Pattern**: Singleton service with typed methods

### Key Components

#### AI Service (`ai-service.ts`)
```typescript
class AIService {
  // Component generation from natural language
  async generateComponent(description: string, context?: AIContext): Promise<ComponentGenerationResult>
  
  // Style generation/modification
  async generateStyles(description: string, component: Component): Promise<StyleGenerationResult>
  
  // Streaming chat
  async *chat(messages: ChatMessage[], context?: AIContext): AsyncGenerator<string>
  
  // Code explanation
  async explainCode(code: string): Promise<string>
}
```

#### Prompt Templates (`src/prompts.ts`)
- System prompts for different AI operations
- Few-shot examples for better outputs
- Structured output schemas

#### Types (`src/types.ts`)
- `AIContext`: Editor state context for AI operations
- `ComponentGenerationResult`: Structured component output
- `StyleGenerationResult`: CSS/Tailwind output
- `ChatMessage`: Message format for conversations

## OpenAI Integration

### Model Selection
```typescript
// GPT-4 for complex operations (code generation, explanations)
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
})

// GPT-3.5 Turbo for fast operations (simple edits, suggestions)
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [...],
})
```

**Guidelines:**
- Use GPT-4 for: Component generation, complex styling, code explanations
- Use GPT-3.5 for: Quick edits, simple suggestions, chat responses
- Always use streaming for user-facing chat

### Structured Output

For component/style generation, use JSON mode:
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [...],
  response_format: { type: 'json_object' },
})
```

**Critical**: Prompts must explicitly request JSON output when using this mode.

### Streaming Pattern

```typescript
async *streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    stream: true,
  })
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) yield content
  }
}
```

## Prompt Engineering

### Component Generation Prompts

Include in system prompt:
- Available component types
- Component structure (id, type, props, styles, children)
- Style format (inline CSS or Tailwind classes)
- Example outputs

```typescript
const systemPrompt = `
You are a web component generator. Generate components in this format:
{
  "type": "Container",
  "props": { "tag": "div" },
  "styles": { "display": "flex", "gap": "1rem" },
  "children": [...]
}

Available types: Container, Text, Button, Image, Input, ...
`
```

### Style Generation Prompts

Include:
- Current component structure
- Target styling system (Tailwind/CSS)
- Design constraints
- Responsive considerations

### Context Passing

Always pass relevant editor context:
```typescript
interface AIContext {
  componentTree: Map<string, Component>
  selectedComponentId?: string
  breakpoint: 'desktop' | 'tablet' | 'mobile'
}
```

This helps AI understand:
- Component hierarchy
- Parent/sibling relationships
- Current viewport state

## Error Handling

### API Errors
```typescript
try {
  const result = await aiService.generateComponent(description)
} catch (error) {
  if (error instanceof OpenAIError) {
    // Handle OpenAI-specific errors
    if (error.status === 429) {
      // Rate limit
    } else if (error.status === 401) {
      // Auth error
    }
  }
  throw error
}
```

### Validation

Always validate AI outputs:
```typescript
function validateComponent(data: unknown): Component {
  // Zod schema validation
  const schema = z.object({
    type: z.enum(['Container', 'Text', 'Button', ...]),
    props: z.record(z.unknown()),
    styles: z.record(z.string()),
    children: z.array(z.lazy(() => schema)).optional(),
  })
  
  return schema.parse(data)
}
```

## Testing

### Mock OpenAI Responses
```typescript
import { vi } from 'vitest'

vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: '{"type": "Container"}' } }]
        })
      }
    }
  }))
}))
```

### Test Patterns
- **Unit Tests**: Test prompt generation logic
- **Integration Tests**: Test full AI service methods with mocked OpenAI
- **Snapshot Tests**: Verify prompt templates don't change unexpectedly

## Rate Limiting & Costs

### Best Practices
- Cache common AI responses when possible
- Debounce user input before sending to AI
- Use streaming to show progress on long operations
- Implement fallbacks for rate limit errors

### Token Management
- Monitor token usage for billing
- Set max_tokens appropriately
- Use shorter contexts when possible
- Consider tiktoken for accurate token counting

## Common Patterns

### Retry Logic
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await delay(1000 * (i + 1)) // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}
```

### Context Serialization
```typescript
function serializeContext(context: AIContext): string {
  // Convert Map to array for JSON
  const components = Array.from(context.componentTree.values())
  return JSON.stringify({
    components,
    selectedId: context.selectedComponentId,
    breakpoint: context.breakpoint,
  })
}
```

## Security Considerations

### API Key Management
- **NEVER** expose API keys in client code
- Keys should only be used in API routes or backend
- Use environment variables: `process.env.OPENAI_API_KEY`
- Rotate keys periodically

### User Input Sanitization
- Validate and sanitize user prompts
- Limit prompt length to prevent abuse
- Filter potentially malicious instructions
- Rate limit user requests

### Output Validation
- Always validate AI-generated code
- Sanitize HTML/CSS before rendering
- Check for XSS vulnerabilities
- Validate component structure

## Performance

### Optimization Tips
- Use streaming for real-time feedback
- Cache frequent component patterns
- Batch similar requests when possible
- Use cheaper models (GPT-3.5) for simple tasks

### Monitoring
- Log AI request/response times
- Track token usage and costs
- Monitor error rates
- Alert on rate limit issues

## Updates & Maintenance

### OpenAI SDK Updates
- Check changelog before updating
- Test streaming functionality after updates
- Verify response format compatibility
- Update type definitions if needed

### Model Updates
When OpenAI releases new models:
- Test with existing prompts
- Compare output quality
- Measure performance/cost differences
- Update model constants if migrating
