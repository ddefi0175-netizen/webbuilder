import { create } from 'zustand';
import type { Message, AISuggestion } from '@/types';
import { generateId } from '@/lib/utils';

interface AIState {
    // Messages
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // Suggestions
    suggestions: AISuggestion[];

    // Streaming
    streamingContent: string;
    isStreaming: boolean;

    // Actions
    addMessage: (role: Message['role'], content: string) => void;
    clearMessages: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Streaming actions
    startStreaming: () => void;
    appendStreamContent: (content: string) => void;
    finishStreaming: () => void;

    // Suggestions
    setSuggestions: (suggestions: AISuggestion[]) => void;
    clearSuggestions: () => void;

    // AI Operations
    sendMessage: (content: string, context?: any) => Promise<void>;
    generateComponent: (description: string) => Promise<any>;
    generateStyles: (description: string, componentId: string) => Promise<any>;
    explainCode: (code: string) => Promise<string>;
}

export const useAIStore = create<AIState>((set, get) => ({
    messages: [],
    isLoading: false,
    error: null,
    suggestions: [],
    streamingContent: '',
    isStreaming: false,

    addMessage: (role, content) => {
        const message: Message = {
            id: generateId(),
            role,
            content,
            timestamp: Date.now(),
        };

        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    clearMessages: () => {
        set({ messages: [], error: null });
    },

    setLoading: (loading) => {
        set({ isLoading: loading });
    },

    setError: (error) => {
        set({ error, isLoading: false });
    },

    startStreaming: () => {
        set({ isStreaming: true, streamingContent: '' });
    },

    appendStreamContent: (content) => {
        set((state) => ({
            streamingContent: state.streamingContent + content,
        }));
    },

    finishStreaming: () => {
        const content = get().streamingContent;
        if (content) {
            get().addMessage('assistant', content);
        }
        set({ isStreaming: false, streamingContent: '' });
    },

    setSuggestions: (suggestions) => {
        set({ suggestions });
    },

    clearSuggestions: () => {
        set({ suggestions: [] });
    },

    sendMessage: async (content, context) => {
        const { addMessage, setLoading, setError, startStreaming, appendStreamContent, finishStreaming } = get();

        addMessage('user', content);
        setLoading(true);
        setError(null);
        startStreaming();

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: get().messages,
                    context,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value);
                    appendStreamContent(text);
                }
            }

            finishStreaming();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            finishStreaming();
        } finally {
            setLoading(false);
        }
    },

    generateComponent: async (description) => {
        const { setLoading, setError } = get();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/generate-component', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate component');
            }

            const component = await response.json();
            return component;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    },

    generateStyles: async (description, componentId) => {
        const { setLoading, setError } = get();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/generate-styles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, componentId }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate styles');
            }

            const styles = await response.json();
            return styles;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    },

    explainCode: async (code) => {
        const { setLoading, setError } = get();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error('Failed to explain code');
            }

            const { explanation } = await response.json();
            return explanation;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
            return '';
        } finally {
            setLoading(false);
        }
    },
}));
