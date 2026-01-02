'use client';

import { useState } from 'react';
import {
    Search,
    FileText,
    ShoppingCart,
    Globe,
    BarChart3,
    Bot,
    Languages,
    Users,
    Cloud,
    Shield,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Import all feature panels
import { SEOPanel } from './panels/seo-panel';
import { ContentGeneratorPanel } from './panels/content-generator-panel';
import { EcommercePanel } from './panels/ecommerce-panel';
import { CustomDomainPanel } from './panels/custom-domain-panel';
import { AnalyticsPanel } from './panels/analytics-panel';
import { ChatbotPanel } from './panels/chatbot-panel';
import { MultiLanguagePanel } from './panels/multi-language-panel';
import { CollaborationPanel } from './panels/collaboration-panel';
import { CloudStoragePanel } from './panels/cloud-storage-panel';
import { SecurityPanel } from './panels/security-panel';
import { PreviewPanel } from './panels/preview-panel';

type ToolId =
    | 'seo'
    | 'content'
    | 'ecommerce'
    | 'domain'
    | 'analytics'
    | 'chatbot'
    | 'language'
    | 'collaboration'
    | 'storage'
    | 'security'
    | 'preview';

interface Tool {
    id: ToolId;
    name: string;
    icon: typeof Search;
    description: string;
    category: 'marketing' | 'commerce' | 'team' | 'settings';
}

const tools: Tool[] = [
    // Marketing & Content
    { id: 'seo', name: 'SEO', icon: Search, description: 'Optimize for search engines', category: 'marketing' },
    { id: 'content', name: 'AI Content', icon: Sparkles, description: 'Generate AI content', category: 'marketing' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'View website stats', category: 'marketing' },

    // E-Commerce
    { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, description: 'Manage products & sales', category: 'commerce' },
    { id: 'chatbot', name: 'AI Chatbot', icon: Bot, description: 'Add a chatbot to your site', category: 'commerce' },

    // Team & Collaboration
    { id: 'collaboration', name: 'Team', icon: Users, description: 'Collaborate with team', category: 'team' },
    { id: 'language', name: 'Languages', icon: Languages, description: 'Multi-language support', category: 'team' },

    // Settings & Infrastructure
    { id: 'domain', name: 'Domain', icon: Globe, description: 'Custom domain settings', category: 'settings' },
    { id: 'storage', name: 'Storage', icon: Cloud, description: 'Cloud file storage', category: 'settings' },
    { id: 'security', name: 'Security', icon: Shield, description: 'SSL & GDPR settings', category: 'settings' },
    { id: 'preview', name: 'Preview', icon: Eye, description: 'Device preview options', category: 'settings' },
];

const categoryLabels: Record<Tool['category'], string> = {
    marketing: 'Marketing',
    commerce: 'Commerce',
    team: 'Team',
    settings: 'Settings',
};

const toolPanels: Record<ToolId, React.ComponentType> = {
    seo: SEOPanel,
    content: ContentGeneratorPanel,
    ecommerce: EcommercePanel,
    domain: CustomDomainPanel,
    analytics: AnalyticsPanel,
    chatbot: ChatbotPanel,
    language: MultiLanguagePanel,
    collaboration: CollaborationPanel,
    storage: CloudStoragePanel,
    security: SecurityPanel,
    preview: PreviewPanel,
};

interface ToolsSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function ToolsSidebar({ isOpen, onToggle }: ToolsSidebarProps) {
    const [activeTool, setActiveTool] = useState<ToolId | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const ActivePanel = activeTool ? toolPanels[activeTool] : null;
    const activeTooInfo = activeTool ? tools.find(t => t.id === activeTool) : null;

    const groupedTools = tools.reduce((acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
    }, {} as Record<Tool['category'], Tool[]>);

    if (!isOpen) return null;

    return (
        <div className="fixed left-16 top-14 bottom-0 z-40 flex">
            {/* Tool Icons Sidebar */}
            <div className={cn(
                'bg-card border-r border-border flex flex-col transition-all duration-200',
                isCollapsed ? 'w-0 overflow-hidden' : 'w-16'
            )}>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-4">
                        {Object.entries(groupedTools).map(([category, categoryTools]) => (
                            <div key={category}>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-1">
                                    {categoryLabels[category as Tool['category']]}
                                </p>
                                <div className="space-y-1">
                                    {categoryTools.map((tool) => (
                                        <Button
                                            key={tool.id}
                                            variant={activeTool === tool.id ? 'secondary' : 'ghost'}
                                            size="sm"
                                            className={cn(
                                                'w-full h-10 flex flex-col items-center justify-center gap-0.5 p-1',
                                                activeTool === tool.id && 'bg-primary/10 text-primary'
                                            )}
                                            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                                            title={tool.name}
                                        >
                                            <tool.icon className="h-4 w-4" />
                                            <span className="text-[9px] leading-none">{tool.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Collapse Toggle */}
                <div className="p-2 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8"
                        onClick={() => setIsCollapsed(true)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Collapsed State Toggle */}
            {isCollapsed && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-r-lg rounded-l-none border-l-0"
                    onClick={() => setIsCollapsed(false)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}

            {/* Active Panel Content */}
            {activeTool && ActivePanel && (
                <div className="w-80 bg-card border-r border-border flex flex-col shadow-lg">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between p-3 border-b">
                        <div className="flex items-center gap-2">
                            {activeTooInfo && <activeTooInfo.icon className="h-4 w-4 text-primary" />}
                            <span className="font-medium text-sm">{activeTooInfo?.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setActiveTool(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-hidden">
                        <ActivePanel />
                    </div>
                </div>
            )}
        </div>
    );
}
