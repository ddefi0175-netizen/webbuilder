'use client';

import { useState } from 'react';
import {
    Bot,
    MessageSquare,
    Settings,
    Sparkles,
    PaintBucket,
    Send,
    Plus,
    Trash2,
    GripVertical,
    Eye,
    Code,
    Save,
    Zap,
    Brain,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatbotFlow {
    id: string;
    trigger: string;
    response: string;
}

export function ChatbotPanel() {
    const [activeTab, setActiveTab] = useState<'setup' | 'flows' | 'design' | 'preview'>('setup');
    const [chatbotEnabled, setChatbotEnabled] = useState(true);
    const [chatbotName, setChatbotName] = useState('Support Bot');
    const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
    const [primaryColor, setPrimaryColor] = useState('#7c3aed');

    const [flows, setFlows] = useState<ChatbotFlow[]>([
        { id: '1', trigger: 'pricing', response: 'Our pricing starts at $9/month. Would you like me to show you our pricing page?' },
        { id: '2', trigger: 'support', response: 'I\'d be happy to help! You can reach our support team at support@example.com or describe your issue here.' },
        { id: '3', trigger: 'features', response: 'We offer AI-powered design tools, drag-and-drop editing, templates, and much more!' },
    ]);

    const [previewMessages, setPreviewMessages] = useState([
        { role: 'bot', content: 'Hi! How can I help you today?' },
    ]);
    const [previewInput, setPreviewInput] = useState('');

    const handlePreviewSend = () => {
        if (!previewInput.trim()) return;

        setPreviewMessages([
            ...previewMessages,
            { role: 'user', content: previewInput },
            { role: 'bot', content: 'Thanks for your message! I\'ll help you with that.' },
        ]);
        setPreviewInput('');
    };

    const tabs = [
        { id: 'setup', label: 'Setup', icon: Settings },
        { id: 'flows', label: 'Flows', icon: Zap },
        { id: 'design', label: 'Design', icon: PaintBucket },
        { id: 'preview', label: 'Preview', icon: Eye },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">AI Chatbot</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Add an AI-powered chatbot to your website
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'setup' && (
                        <>
                            {/* Enable Toggle */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">Enable Chatbot</p>
                                    <p className="text-xs text-muted-foreground">Show chatbot on your website</p>
                                </div>
                                <button
                                    onClick={() => setChatbotEnabled(!chatbotEnabled)}
                                    className={cn(
                                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                                        chatbotEnabled ? 'bg-primary' : 'bg-muted'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                            chatbotEnabled ? 'translate-x-6' : 'translate-x-1'
                                        )}
                                    />
                                </button>
                            </div>

                            {/* Basic Settings */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Chatbot Name</Label>
                                    <Input
                                        value={chatbotName}
                                        onChange={(e) => setChatbotName(e.target.value)}
                                        placeholder="Enter chatbot name"
                                        className="text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Welcome Message</Label>
                                    <Textarea
                                        value={welcomeMessage}
                                        onChange={(e) => setWelcomeMessage(e.target.value)}
                                        placeholder="Enter welcome message"
                                        className="min-h-[80px] text-sm"
                                    />
                                </div>
                            </div>

                            {/* AI Settings */}
                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">AI Configuration</Label>

                                <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">AI Model</span>
                                    </div>
                                    <select className="w-full h-9 px-3 border rounded-md text-sm">
                                        <option>GPT-4 (Recommended)</option>
                                        <option>GPT-3.5 Turbo</option>
                                        <option>Custom Model</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Enable AI responses</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Learn from conversations</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Require human handoff for complex queries</span>
                                    </label>
                                </div>
                            </div>

                            {/* Knowledge Base */}
                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">Knowledge Base</Label>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm mb-2">Train your chatbot with custom content</p>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Website Pages
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Upload Documents
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add FAQs
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'flows' && (
                        <>
                            <p className="text-xs text-muted-foreground">
                                Create automated response flows for common queries
                            </p>

                            <div className="space-y-3">
                                {flows.map((flow) => (
                                    <div key={flow.id} className="p-3 border rounded-lg space-y-2">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                            <div className="flex-1">
                                                <Label className="text-xs text-muted-foreground">When visitor says</Label>
                                                <Input
                                                    value={flow.trigger}
                                                    className="text-sm mt-1"
                                                    placeholder="Trigger keyword..."
                                                />
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Bot responds with</Label>
                                            <Textarea
                                                value={flow.response}
                                                className="min-h-[60px] text-sm mt-1"
                                                placeholder="Response message..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setFlows([...flows, { id: Date.now().toString(), trigger: '', response: '' }])}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Flow
                            </Button>

                            <div className="pt-4 border-t">
                                <Button variant="outline" className="w-full justify-start">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Flows with AI
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'design' && (
                        <>
                            {/* Colors */}
                            <div className="space-y-3">
                                <Label className="text-xs">Appearance</Label>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Primary Color</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer"
                                            />
                                            <Input
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-24 h-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Position */}
                            <div className="space-y-3">
                                <Label className="text-xs">Position</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Bottom Right', 'Bottom Left', 'Top Right', 'Top Left'].map((position) => (
                                        <button
                                            key={position}
                                            className={cn(
                                                'p-3 border rounded-lg text-sm transition-colors',
                                                position === 'Bottom Right' && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            {position}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className="space-y-3">
                                <Label className="text-xs">Bot Avatar</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['🤖', '💬', '🎯', '⚡'].map((emoji) => (
                                        <button
                                            key={emoji}
                                            className={cn(
                                                'p-4 border rounded-lg text-2xl transition-colors hover:bg-muted',
                                                emoji === '🤖' && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    Upload Custom Avatar
                                </Button>
                            </div>

                            {/* Display Options */}
                            <div className="space-y-2 pt-4 border-t">
                                <Label className="text-xs">Display Options</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Show typing indicator</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Show message timestamps</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Auto-open on page load</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Sound notification</span>
                                </label>
                            </div>
                        </>
                    )}

                    {activeTab === 'preview' && (
                        <>
                            {/* Chat Preview */}
                            <div
                                className="border rounded-lg overflow-hidden"
                                style={{ maxHeight: '400px' }}
                            >
                                {/* Header */}
                                <div
                                    className="p-3 text-white flex items-center gap-2"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        🤖
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{chatbotName}</p>
                                        <p className="text-xs opacity-80">Online</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="p-3 bg-muted/50 min-h-[200px] space-y-3">
                                    {previewMessages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                'flex',
                                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'max-w-[80%] p-2 rounded-lg text-sm',
                                                    msg.role === 'user'
                                                        ? 'text-white'
                                                        : 'bg-white border'
                                                )}
                                                style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-2 border-t flex gap-2">
                                    <Input
                                        value={previewInput}
                                        onChange={(e) => setPreviewInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handlePreviewSend()}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handlePreviewSend}
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Code className="h-4 w-4 mr-2" />
                                    Get Embed Code
                                </Button>
                                <Button className="flex-1">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
