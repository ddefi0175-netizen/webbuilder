export interface AIConfig {
    apiKey: string;
    organizationId?: string;
    chatModel?: string;
    fastModel?: string;
    embeddingModel?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIContext {
    selectedComponent?: {
        type: string;
        name: string;
        styles?: Record<string, string>;
        props?: Record<string, unknown>;
    };
    components?: Array<{
        type: string;
        name: string;
    }>;
    recentActions?: string[];
    designSystem?: {
        colors?: Record<string, string>;
        fonts?: Record<string, string>;
        spacing?: Record<string, string>;
    };
}

export interface ComponentGenerationResult {
    type: string;
    name: string;
    props: Record<string, unknown>;
    styles: Record<string, string>;
    children: ComponentGenerationResult[];
}

export interface StyleGenerationResult {
    [key: string]: string;
}

export interface ContentGenerationResult {
    content: string;
    type: string;
}

export interface Suggestion {
    id: string;
    type: 'style' | 'accessibility' | 'performance' | 'ux';
    title: string;
    description: string;
    action?: {
        type: 'updateStyle' | 'updateProp' | 'addComponent';
        payload: unknown;
    };
}

export interface CodeAnalysis {
    issues: Array<{
        type: 'error' | 'warning' | 'info';
        message: string;
        line?: number;
        suggestion?: string;
    }>;
    score: number;
    suggestions: string[];
}
