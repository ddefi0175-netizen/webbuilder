import OpenAI from 'openai';
import { z } from 'zod';
import {
    AIConfig,
    ChatMessage,
    ComponentGenerationResult,
    StyleGenerationResult,
    ContentGenerationResult,
    AIContext,
} from './types';
import { PROMPTS } from './prompts';

export class AIService {
    private openai: OpenAI;
    private config: AIConfig;

    constructor(config: AIConfig) {
        this.config = config;
        this.openai = new OpenAI({
            apiKey: config.apiKey,
            organization: config.organizationId,
        });
    }

    /**
     * Stream a chat response
     */
    async *chat(
        messages: ChatMessage[],
        context?: AIContext
    ): AsyncGenerator<string> {
        const systemPrompt = this.buildSystemPrompt(context);

        const response = await this.openai.chat.completions.create({
            model: this.config.chatModel || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                })),
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
        });

        for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }

    /**
     * Generate a component from description
     */
    async generateComponent(
        description: string,
        context?: AIContext
    ): Promise<ComponentGenerationResult> {
        const systemPrompt = PROMPTS.componentGeneration(context);

        const response = await this.openai.chat.completions.create({
            model: this.config.chatModel || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate a component for: ${description}` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        return JSON.parse(content) as ComponentGenerationResult;
    }

    /**
     * Generate styles from description
     */
    async generateStyles(
        description: string,
        targetComponent?: { type: string; currentStyles?: Record<string, string> }
    ): Promise<StyleGenerationResult> {
        const systemPrompt = PROMPTS.styleGeneration(targetComponent);

        const response = await this.openai.chat.completions.create({
            model: this.config.fastModel || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate styles for: ${description}` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        return JSON.parse(content) as StyleGenerationResult;
    }

    /**
     * Generate text content
     */
    async generateContent(
        type: 'heading' | 'paragraph' | 'tagline' | 'cta',
        context: string
    ): Promise<ContentGenerationResult> {
        const systemPrompt = PROMPTS.contentGeneration(type);

        const response = await this.openai.chat.completions.create({
            model: this.config.fastModel || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate ${type} content for: ${context}` },
            ],
            temperature: 0.8,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }

        return { content, type };
    }

    /**
     * Explain code
     */
    async explainCode(code: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: this.config.fastModel || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: PROMPTS.codeExplanation },
                { role: 'user', content: `Explain this code:\n\n${code}` },
            ],
            temperature: 0.5,
        });

        return response.choices[0]?.message?.content || '';
    }

    /**
     * Suggest improvements for a component
     */
    async suggestImprovements(
        component: { type: string; styles: Record<string, string>; props: Record<string, any> }
    ): Promise<string[]> {
        const response = await this.openai.chat.completions.create({
            model: this.config.fastModel || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: PROMPTS.improvementSuggestions },
                {
                    role: 'user',
                    content: `Suggest improvements for this ${component.type} component:\nStyles: ${JSON.stringify(component.styles)}\nProps: ${JSON.stringify(component.props)}`,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.6,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return [];
        }

        const result = JSON.parse(content);
        return result.suggestions || [];
    }

    /**
     * Generate image with DALL-E
     */
    async generateImage(
        prompt: string,
        size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
    ): Promise<string> {
        const response = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: `Web design asset: ${prompt}. Clean, modern, professional.`,
            n: 1,
            size,
            quality: 'standard',
        });

        return response.data?.[0]?.url || '';
    }

    /**
     * Build system prompt with context
     */
    private buildSystemPrompt(context?: AIContext): string {
        let prompt = PROMPTS.base;

        if (context?.selectedComponent) {
            prompt += `\n\nContext: The user has selected a ${context.selectedComponent.type} component named "${context.selectedComponent.name}".`;
        }

        if (context?.recentActions?.length) {
            prompt += `\n\nRecent actions: ${context.recentActions.join(', ')}`;
        }

        return prompt;
    }
}

// Factory function
export function createAIService(config: AIConfig): AIService {
    return new AIService(config);
}
