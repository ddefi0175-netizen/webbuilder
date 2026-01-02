# AI Coding System Architecture

This document details the AI coding system that powers the WebBuilder's intelligent features.

## Overview

The AI Coding System is a multi-layered architecture that enables:

- Natural language to code conversion
- Intelligent code completion
- Contextual suggestions
- Code analysis and optimization

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           User Interface Layer                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
│  │  AI Chat    │   │  Inline     │   │  Command    │   │  Context    │  │
│  │  Panel      │   │  Suggestions│   │  Palette    │   │  Menu       │  │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘  │
│         │                 │                 │                 │          │
└─────────┼─────────────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │                 │
          └────────────────┬┴─────────────────┴┬────────────────┘
                           │                   │
┌──────────────────────────▼───────────────────▼──────────────────────────┐
│                        AI Orchestration Layer                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Request Router                               │    │
│  │   - Intent Classification                                        │    │
│  │   - Task Decomposition                                           │    │
│  │   - Priority Queue                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     Context Manager                              │    │
│  │   - Editor State                                                 │    │
│  │   - Component Tree                                               │    │
│  │   - User Preferences                                             │    │
│  │   - Conversation History                                         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│                         AI Service Layer                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │    Code      │  │   Layout     │  │   Content    │  │   Image     │  │
│  │  Generator   │  │  Analyzer    │  │  Generator   │  │  Generator  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │    Style     │  │    Code      │  │   Error      │  │  Embeddings │  │
│  │   Advisor    │  │   Explainer  │  │   Detector   │  │   Service   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│                          LLM Provider Layer                              │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   OpenAI     │  │  Anthropic   │  │   Google     │  │   Local     │  │
│  │   GPT-4      │  │   Claude     │  │   Gemini     │  │   (Ollama)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Intent Classification

Determines what the user wants to achieve:

```typescript
type Intent =
  | 'generate_component'     // Create new component
  | 'modify_component'       // Edit existing component
  | 'generate_styles'        // Create/modify CSS
  | 'generate_content'       // Create text content
  | 'generate_image'         // Create images
  | 'explain_code'           // Explain code
  | 'fix_error'              // Fix bugs
  | 'optimize_code'          // Improve code
  | 'answer_question'        // General Q&A
  | 'execute_action';        // Perform action

interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: Entity[];
  context: ContextData;
}
```

### 2. Context Manager

Maintains awareness of the current state:

```typescript
interface AIContext {
  // Current editor state
  editor: {
    selectedComponent: Component | null;
    activeFile: string | null;
    cursorPosition: Position;
    visibleCode: string;
  };
  
  // Project context
  project: {
    name: string;
    framework: 'vanilla' | 'react' | 'vue' | 'svelte';
    components: ComponentSummary[];
    styles: StyleSummary[];
    assets: AssetSummary[];
  };
  
  // Conversation context
  conversation: {
    messages: Message[];
    recentActions: Action[];
    userPreferences: Preferences;
  };
  
  // Code context
  code: {
    recentEdits: Edit[];
    relatedFiles: string[];
    imports: Import[];
    exports: Export[];
  };
}
```

### 3. Code Generator

Transforms natural language into code:

```typescript
interface CodeGenerator {
  // Generate complete component
  generateComponent(
    description: string,
    context: AIContext
  ): Promise<ComponentOutput>;
  
  // Generate code snippet
  generateSnippet(
    prompt: string,
    language: Language,
    context: AIContext
  ): Promise<CodeSnippet>;
  
  // Complete partial code
  completeCode(
    partialCode: string,
    cursorPosition: Position,
    context: AIContext
  ): Promise<Completion[]>;
  
  // Transform existing code
  transformCode(
    code: string,
    transformation: string,
    context: AIContext
  ): Promise<string>;
}

interface ComponentOutput {
  html: string;
  css: string;
  javascript?: string;
  component: Component;
  explanation: string;
}
```

### 4. Prompt Engineering

Structured prompts for consistent outputs:

```typescript
const COMPONENT_GENERATION_PROMPT = `
You are an expert web developer creating components for a visual web builder.

## Context
- Framework: {{framework}}
- Existing components: {{componentList}}
- Design system: {{designSystem}}
- User request: {{userRequest}}

## Requirements
1. Generate semantic HTML5
2. Use BEM naming convention for CSS classes
3. Ensure accessibility (ARIA labels, semantic tags)
4. Make responsive by default
5. Follow the existing design system

## Output Format
Return a JSON object with:
- html: The component HTML
- css: The component styles
- javascript: Optional interactivity
- explanation: Brief description of the component

## Example
User: "Create a pricing card with title, price, features list, and CTA button"
Output: {
  "html": "<div class=\"pricing-card\">...</div>",
  "css": ".pricing-card { ... }",
  "explanation": "A pricing card component with..."
}

Now generate a component for: {{userRequest}}
`;
```

### 5. Style Advisor

AI-powered styling assistance:

```typescript
interface StyleAdvisor {
  // Generate styles from description
  generateStyles(
    description: string,
    targetElement: Component
  ): Promise<CSSStyles>;
  
  // Suggest style improvements
  suggestImprovements(
    component: Component
  ): Promise<StyleSuggestion[]>;
  
  // Match existing design system
  matchDesignSystem(
    component: Component,
    designSystem: DesignSystem
  ): Promise<CSSStyles>;
  
  // Generate responsive styles
  generateResponsiveStyles(
    baseStyles: CSSStyles,
    breakpoints: Breakpoint[]
  ): Promise<ResponsiveStyles>;
}
```

### 6. Error Detection & Fixing

Intelligent error handling:

```typescript
interface ErrorDetector {
  // Analyze code for issues
  analyzeCode(code: string): Promise<Issue[]>;
  
  // Suggest fixes
  suggestFix(issue: Issue, context: AIContext): Promise<Fix>;
  
  // Auto-fix common issues
  autoFix(code: string, issues: Issue[]): Promise<string>;
  
  // Explain error
  explainError(error: Error, context: AIContext): Promise<string>;
}

interface Issue {
  type: 'error' | 'warning' | 'suggestion';
  severity: 'critical' | 'major' | 'minor';
  message: string;
  location: Location;
  rule?: string;
  suggestedFix?: Fix;
}

interface Fix {
  description: string;
  changes: Change[];
  confidence: number;
  impact: 'safe' | 'review' | 'risky';
}
```

## AI Workflows

### Component Generation Workflow

```
User Request
     │
     ▼
┌─────────────────┐
│ Intent Classify │ → Is this a component request?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Context Gather  │ → Get editor state, design system, existing components
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prompt Build    │ → Construct optimized prompt with context
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LLM Request     │ → Send to GPT-4 with streaming
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response Parse  │ → Extract HTML, CSS, JS from response
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validation      │ → Check syntax, accessibility, best practices
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Transform       │ → Convert to internal Component format
└────────┬────────┘
         │
         ▼
     Component
```

### Code Completion Workflow

```
Typing in Editor
       │
       ▼
┌──────────────────┐
│ Debounce (300ms) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Gather Context   │
│ - Current line   │
│ - Surrounding    │
│ - Component tree │
│ - Recent edits   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Build Prompt     │ → Include code context and cursor position
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ LLM Request      │ → Fast model (GPT-3.5) for speed
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Filter Results   │ → Remove invalid/duplicate suggestions
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Rank Suggestions │ → By relevance and confidence
└────────┬─────────┘
         │
         ▼
   Show Completions
```

## Conversation Memory

Long-term context management:

```typescript
interface ConversationMemory {
  // Short-term (current session)
  shortTerm: {
    messages: Message[];
    recentActions: Action[];
    activeContext: AIContext;
  };
  
  // Long-term (persisted)
  longTerm: {
    userPreferences: Preferences;
    frequentPatterns: Pattern[];
    savedSnippets: Snippet[];
    projectKnowledge: Knowledge[];
  };
  
  // Vector store for semantic search
  embeddings: {
    conversations: VectorEntry[];
    codeSnippets: VectorEntry[];
    documentation: VectorEntry[];
  };
}

// Retrieve relevant context
async function getRelevantContext(
  query: string,
  memory: ConversationMemory
): Promise<RelevantContext> {
  // Semantic search through embeddings
  const relevantConversations = await vectorSearch(
    query,
    memory.embeddings.conversations,
    { topK: 5 }
  );
  
  const relevantCode = await vectorSearch(
    query,
    memory.embeddings.codeSnippets,
    { topK: 3 }
  );
  
  return {
    conversations: relevantConversations,
    code: relevantCode,
    preferences: memory.longTerm.userPreferences,
    patterns: memory.longTerm.frequentPatterns
  };
}
```

## Safety & Validation

### Code Validation Pipeline

```typescript
async function validateGeneratedCode(
  code: CodeOutput
): Promise<ValidationResult> {
  const validators = [
    syntaxValidator,      // Valid syntax
    securityValidator,    // No XSS, injection
    accessibilityValidator, // WCAG compliance
    performanceValidator,  // No obvious issues
    styleValidator,       // Follows conventions
  ];
  
  const results = await Promise.all(
    validators.map(v => v.validate(code))
  );
  
  return {
    isValid: results.every(r => r.passed),
    issues: results.flatMap(r => r.issues),
    score: calculateScore(results),
  };
}
```

### Rate Limiting

```typescript
const rateLimits = {
  chat: {
    requests: 60,
    window: '1m',
    burst: 10
  },
  codeGeneration: {
    requests: 30,
    window: '1m',
    burst: 5
  },
  imageGeneration: {
    requests: 10,
    window: '1m',
    burst: 2
  }
};
```

## Performance Optimization

### Caching Strategy

```typescript
const cacheConfig = {
  // Cache generated components by hash of prompt + context
  components: {
    ttl: '24h',
    maxSize: 1000,
    keyStrategy: 'prompt-hash'
  },
  
  // Cache embeddings
  embeddings: {
    ttl: '7d',
    maxSize: 10000,
    keyStrategy: 'content-hash'
  },
  
  // Cache completions
  completions: {
    ttl: '1h',
    maxSize: 5000,
    keyStrategy: 'context-hash'
  }
};
```

### Streaming Responses

All chat and generation endpoints support streaming for better UX:

```typescript
async function* streamResponse(
  prompt: string,
  context: AIContext
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: buildMessages(prompt, context),
    stream: true
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
```

## Integration Points

### Editor Integration

```typescript
// Monaco editor integration
editor.onDidChangeModelContent(debounce(async (e) => {
  const context = gatherEditorContext(editor);
  const suggestions = await ai.getCompletions(context);
  showInlineSuggestions(suggestions);
}, 300));

// Keyboard shortcut for AI
editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyK, async () => {
  const selected = editor.getSelection();
  const code = editor.getModel().getValueInRange(selected);
  await openAIPanel({ selectedCode: code });
});
```

### Visual Editor Integration

```typescript
// Component generation from AI
async function handleAIComponentRequest(description: string) {
  const component = await ai.generateComponent(description, {
    parentComponent: selectedComponent,
    designSystem: currentDesignSystem,
    existingComponents: componentTree
  });
  
  if (component) {
    addComponentToCanvas(component);
    showSuccessNotification('Component added!');
  }
}
```

---

This AI coding system architecture enables intelligent assistance throughout the web building experience, from natural language commands to sophisticated code generation and optimization.
