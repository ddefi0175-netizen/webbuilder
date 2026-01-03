'use client';

import { useState } from 'react';
import {
    Code,
    FileCode,
    Globe,
    Settings,
    Copy,
    Check,
    Info,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type CodeLocation = 'head' | 'body-start' | 'body-end';

interface CodeSnippet {
    id: string;
    name: string;
    location: CodeLocation;
    code: string;
    enabled: boolean;
}

export function CustomCodePanel() {
    const [activeTab, setActiveTab] = useState<'snippets' | 'integrations'>('snippets');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [snippets, setSnippets] = useState<CodeSnippet[]>([
        {
            id: '1',
            name: 'Google Analytics',
            location: 'head',
            code: `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>`,
            enabled: true
        },
        {
            id: '2',
            name: 'Facebook Pixel',
            location: 'head',
            code: `<!-- Meta Pixel Code -->\n<script>!function(f,b,e,v,n,t,s){...};</script>`,
            enabled: true
        },
        {
            id: '3',
            name: 'Custom CSS',
            location: 'head',
            code: `<style>\n  .custom-class {\n    /* Your styles */\n  }\n</style>`,
            enabled: false
        },
    ]);

    const [headCode, setHeadCode] = useState('');
    const [bodyStartCode, setBodyStartCode] = useState('');
    const [bodyEndCode, setBodyEndCode] = useState('');

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleSnippet = (id: string) => {
        setSnippets(snippets.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
    };

    const tabs = [
        { id: 'snippets', label: 'Snippets', icon: FileCode },
        { id: 'integrations', label: 'Integrations', icon: Globe },
    ] as const;

    const integrations = [
        { name: 'Google Analytics', icon: '📊', connected: true },
        { name: 'Google Tag Manager', icon: '🏷️', connected: false },
        { name: 'Facebook Pixel', icon: '📘', connected: true },
        { name: 'Hotjar', icon: '🔥', connected: false },
        { name: 'Intercom', icon: '💬', connected: false },
        { name: 'Mailchimp', icon: '📧', connected: false },
        { name: 'HubSpot', icon: '🧡', connected: false },
        { name: 'Zapier', icon: '⚡', connected: false },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Code className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Custom Code</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Add custom HTML, CSS, and JavaScript
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
                    {activeTab === 'snippets' && (
                        <>
                            {/* Warning */}
                            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <p className="text-xs text-yellow-700">
                                    Custom code runs on your live site. Make sure to test thoroughly before publishing.
                                </p>
                            </div>

                            {/* Saved Snippets */}
                            <div className="space-y-2">
                                <Label className="text-xs">Saved Snippets</Label>
                                {snippets.map((snippet) => (
                                    <div key={snippet.id} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{snippet.name}</span>
                                                <span className="px-1.5 py-0.5 bg-muted text-xs rounded">
                                                    {snippet.location}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => handleCopy(snippet.code, snippet.id)}
                                                >
                                                    {copiedId === snippet.id ? (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                                <button
                                                    onClick={() => toggleSnippet(snippet.id)}
                                                    className={cn(
                                                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                                                        snippet.enabled ? 'bg-primary' : 'bg-muted'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                                                            snippet.enabled ? 'translate-x-4' : 'translate-x-1'
                                                        )}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                            <code>{snippet.code.slice(0, 100)}...</code>
                                        </pre>
                                    </div>
                                ))}
                            </div>

                            {/* Code Injection Areas */}
                            <div className="pt-4 border-t space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs">Head Code</Label>
                                        <span className="text-xs text-muted-foreground">&lt;head&gt;</span>
                                    </div>
                                    <textarea
                                        value={headCode}
                                        onChange={(e) => setHeadCode(e.target.value)}
                                        placeholder="<!-- Add tracking codes, meta tags, stylesheets -->"
                                        className="w-full h-24 p-2 text-xs font-mono border rounded-md resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs">Body Start</Label>
                                        <span className="text-xs text-muted-foreground">After &lt;body&gt;</span>
                                    </div>
                                    <textarea
                                        value={bodyStartCode}
                                        onChange={(e) => setBodyStartCode(e.target.value)}
                                        placeholder="<!-- Add scripts that need to load early -->"
                                        className="w-full h-24 p-2 text-xs font-mono border rounded-md resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs">Body End</Label>
                                        <span className="text-xs text-muted-foreground">Before &lt;/body&gt;</span>
                                    </div>
                                    <textarea
                                        value={bodyEndCode}
                                        onChange={(e) => setBodyEndCode(e.target.value)}
                                        placeholder="<!-- Add scripts that can load after page content -->"
                                        className="w-full h-24 p-2 text-xs font-mono border rounded-md resize-none"
                                    />
                                </div>
                            </div>

                            <Button className="w-full">
                                <Code className="h-4 w-4 mr-2" />
                                Save Custom Code
                            </Button>
                        </>
                    )}

                    {activeTab === 'integrations' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Third-Party Integrations</Label>
                                <p className="text-xs text-muted-foreground">
                                    Connect popular services with one click
                                </p>
                            </div>

                            <div className="space-y-2">
                                {integrations.map((integration) => (
                                    <div
                                        key={integration.name}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{integration.icon}</span>
                                            <span className="text-sm font-medium">{integration.name}</span>
                                        </div>
                                        {integration.connected ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-green-600">Connected</span>
                                                <Button variant="outline" size="sm" className="h-7">
                                                    Settings
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="outline" size="sm" className="h-7">
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* API Keys */}
                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">API Keys</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Google Analytics ID</Label>
                                    <Input placeholder="G-XXXXXXXXXX" className="text-sm font-mono" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Facebook Pixel ID</Label>
                                    <Input placeholder="XXXXXXXXXXXXXXX" className="text-sm font-mono" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Google Tag Manager ID</Label>
                                    <Input placeholder="GTM-XXXXXXX" className="text-sm font-mono" />
                                </div>
                            </div>

                            <Button className="w-full">
                                <Settings className="h-4 w-4 mr-2" />
                                Save Integration Settings
                            </Button>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
