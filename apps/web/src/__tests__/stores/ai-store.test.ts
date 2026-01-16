import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAIStore } from '@/stores/ai-store';

describe('AI Store', () => {
    beforeEach(() => {
        // Reset store before each test
        useAIStore.setState({
            messages: [],
            isLoading: false,
            error: null,
            suggestions: [],
            streamingContent: '',
            isStreaming: false,
        });
    });

    describe('Messages', () => {
        it('should add a user message', () => {
            const { addMessage } = useAIStore.getState();

            addMessage('user', 'Create a hero section');

            const state = useAIStore.getState();
            expect(state.messages.length).toBe(1);
            expect(state.messages[0].role).toBe('user');
            expect(state.messages[0].content).toBe('Create a hero section');
        });

        it('should add an assistant message', () => {
            const { addMessage } = useAIStore.getState();

            addMessage('assistant', 'I have created a hero section for you.');

            const state = useAIStore.getState();
            expect(state.messages.length).toBe(1);
            expect(state.messages[0].role).toBe('assistant');
        });

        it('should maintain message order', () => {
            const { addMessage } = useAIStore.getState();

            addMessage('user', 'First message');
            addMessage('assistant', 'Response');
            addMessage('user', 'Second message');

            const state = useAIStore.getState();
            expect(state.messages.length).toBe(3);
            expect(state.messages[0].content).toBe('First message');
            expect(state.messages[1].content).toBe('Response');
            expect(state.messages[2].content).toBe('Second message');
        });

        it('should clear all messages', () => {
            const { addMessage, clearMessages } = useAIStore.getState();

            addMessage('user', 'Test message');
            addMessage('assistant', 'Response');

            clearMessages();

            const state = useAIStore.getState();
            expect(state.messages.length).toBe(0);
        });
    });

    describe('Loading State', () => {
        it('should set loading state', () => {
            const { setLoading } = useAIStore.getState();

            setLoading(true);
            expect(useAIStore.getState().isLoading).toBe(true);

            setLoading(false);
            expect(useAIStore.getState().isLoading).toBe(false);
        });
    });

    describe('Error Handling', () => {
        it('should set error message', () => {
            const { setError } = useAIStore.getState();

            setError('API rate limit exceeded');

            const state = useAIStore.getState();
            expect(state.error).toBe('API rate limit exceeded');
        });

        it('should clear error', () => {
            const { setError } = useAIStore.getState();

            setError('Some error');
            setError(null);

            const state = useAIStore.getState();
            expect(state.error).toBeNull();
        });
    });

    describe('Streaming', () => {
        it('should start streaming', () => {
            const { startStreaming } = useAIStore.getState();

            startStreaming();

            const state = useAIStore.getState();
            expect(state.isStreaming).toBe(true);
            expect(state.streamingContent).toBe('');
        });

        it('should append streaming content', () => {
            const { startStreaming, appendStreamContent } = useAIStore.getState();

            startStreaming();
            appendStreamContent('Hello');
            appendStreamContent(' World');

            const state = useAIStore.getState();
            expect(state.streamingContent).toBe('Hello World');
        });

        it('should finish streaming', () => {
            const { startStreaming, finishStreaming } = useAIStore.getState();

            startStreaming();
            finishStreaming();

            const state = useAIStore.getState();
            expect(state.isStreaming).toBe(false);
        });
    });

    describe('Suggestions', () => {
        it('should set suggestions', () => {
            const { setSuggestions } = useAIStore.getState();

            const suggestions = [
                { id: '1', type: 'component' as const, title: 'Add Button', description: 'Add a button', action: () => {} },
            ];
            setSuggestions(suggestions);

            const state = useAIStore.getState();
            expect(state.suggestions.length).toBe(1);
        });

        it('should clear suggestions', () => {
            const { setSuggestions, clearSuggestions } = useAIStore.getState();

            setSuggestions([{ id: '1', type: 'component' as const, title: 'Test', description: 'Test', action: () => {} }]);
            clearSuggestions();

            const state = useAIStore.getState();
            expect(state.suggestions.length).toBe(0);
        });
    });
});
