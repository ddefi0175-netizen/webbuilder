'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@/stores/ai-store';
import { useEditorStore } from '@/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Send,
    X,
    Sparkles,
    Copy,
    Check,
    Loader2,
    Trash2,
    Wand2,
    Code,
    Palette,
    FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

export function AIPanel() {
    const [input, setInput] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        isLoading,
        isStreaming,
        streamingContent,
        error,
        sendMessage,
        clearMessages,
    } = useAIStore();

    const { toggleAIPanel, selection, getComponent } = useEditorStore();

    const selectedComponent = selection.selectedIds[0]
        ? getComponent(selection.selectedIds[0])
        : null;

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const context = selectedComponent
            ? {
                selectedComponent: {
                    type: selectedComponent.type,
                    name: selectedComponent.name,
                    styles: selectedComponent.styles,
                },
            }
            : undefined;

        await sendMessage(input, context);
        setInput('');
    };

    const handleCopy = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const quickPrompts = [
        { icon: Wand2, label: 'Generate component', prompt: 'Create a ' },
        { icon: Palette, label: 'Style suggestion', prompt: 'Suggest styles for ' },
        { icon: Code, label: 'Generate code', prompt: 'Write code for ' },
        { icon: FileText, label: 'Generate content', prompt: 'Write content for ' },
    ];

    const renderMessage = (message: Message) => {
        return (
            <div
                key={message.id}
                className={cn(
                    'flex gap-3 p-4',
                    message.role === 'user' ? 'bg-muted/50' : 'bg-background'
                )}
            >
                <div
                    className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    )}
                >
                    {message.role === 'user' ? 'U' : <Sparkles className="h-4 w-4" />}
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium mb-1">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>

                    <div className="ai-message text-sm">
                        <ReactMarkdown
                            components={{
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeString = String(children).replace(/\n$/, '');
                                    const isInline = !match;

                                    if (!isInline && match) {
                                        return (
                                            <div className="relative group">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleCopy(codeString, message.id)}
                                                >
                                                    {copiedId === message.id ? (
                                                        <Check className="h-3 w-3" />
                                                    ) : (
                                                        <Copy className="h-3 w-3" />
                                                    )}
                                                </Button>
                                                <SyntaxHighlighter
                                                    style={oneDark as { [key: string]: React.CSSProperties }}
                                                    language={match[1]}
                                                    PreTag="div"
                                                >
                                                    {codeString}
                                                </SyntaxHighlighter>
                                            </div>
                                        );
                                    }

                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">AI Assistant</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={clearMessages}
                        disabled={messages.length === 0}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={toggleAIPanel}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
                {messages.length === 0 && !isStreaming ? (
                    <div className="p-4 space-y-4">
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">AI Assistant</h3>
                            <p className="text-sm text-muted-foreground">
                                I can help you build your website. Try asking me to:
                            </p>
                        </div>

                        <div className="grid gap-2">
                            {quickPrompts.map(({ icon: Icon, label, prompt }) => (
                                <Button
                                    key={label}
                                    variant="outline"
                                    className="justify-start gap-2 h-auto py-3"
                                    onClick={() => setInput(prompt)}
                                >
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{label}</span>
                                </Button>
                            ))}
                        </div>

                        {selectedComponent && (
                            <div className="p-3 rounded-lg bg-muted text-sm">
                                <span className="text-muted-foreground">Selected: </span>
                                <span className="font-medium">{selectedComponent.name}</span>
                                <span className="text-muted-foreground"> ({selectedComponent.type})</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {messages.map(renderMessage)}

                        {/* Streaming Message */}
                        {isStreaming && streamingContent && (
                            <div className="flex gap-3 p-4 bg-background">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium mb-1">AI Assistant</div>
                                    <div className="ai-message text-sm">
                                        <ReactMarkdown>{streamingContent}</ReactMarkdown>
                                        <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Error */}
            {error && (
                <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                <div className="flex gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AI to help you build..."
                        className="min-h-[80px] resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                        Press Enter to send, Shift+Enter for new line
                    </span>
                    <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
