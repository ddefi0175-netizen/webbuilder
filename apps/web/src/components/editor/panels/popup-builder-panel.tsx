'use client';

import { useState } from 'react';
import {
    MessageSquare,
    X,
    MousePointer,
    Clock,
    ArrowDown,
    Eye,
    Sparkles,
    Settings,
    Palette,
    Copy,
    Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type TriggerType = 'exit-intent' | 'time-delay' | 'scroll' | 'click';
type PopupType = 'modal' | 'slide-in' | 'fullscreen' | 'banner' | 'floating';

interface PopupTemplate {
    id: string;
    name: string;
    type: PopupType;
    preview: string;
}

const triggerOptions: { type: TriggerType; label: string; icon: typeof Clock; description: string }[] = [
    { type: 'exit-intent', label: 'Exit Intent', icon: MousePointer, description: 'Show when user moves to leave' },
    { type: 'time-delay', label: 'Time Delay', icon: Clock, description: 'Show after X seconds' },
    { type: 'scroll', label: 'Scroll Depth', icon: ArrowDown, description: 'Show at scroll percentage' },
    { type: 'click', label: 'On Click', icon: MousePointer, description: 'Show when element clicked' },
];

const popupTemplates: PopupTemplate[] = [
    { id: '1', name: 'Newsletter Signup', type: 'modal', preview: '📧' },
    { id: '2', name: 'Exit Discount', type: 'modal', preview: '🎁' },
    { id: '3', name: 'Cookie Consent', type: 'banner', preview: '🍪' },
    { id: '4', name: 'Announcement', type: 'slide-in', preview: '📢' },
    { id: '5', name: 'Welcome Message', type: 'fullscreen', preview: '👋' },
    { id: '6', name: 'Chat Widget', type: 'floating', preview: '💬' },
];

export function PopupBuilderPanel() {
    const [activeTab, setActiveTab] = useState<'templates' | 'trigger' | 'design' | 'preview'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>('exit-intent');
    const [timeDelay, setTimeDelay] = useState(5);
    const [scrollPercentage, setScrollPercentage] = useState(50);

    const tabs = [
        { id: 'templates', label: 'Templates', icon: MessageSquare },
        { id: 'trigger', label: 'Trigger', icon: MousePointer },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'preview', label: 'Preview', icon: Eye },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Popup Builder</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Create popups and modals
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
                    {activeTab === 'templates' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Choose a Template</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {popupTemplates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template.id)}
                                            className={cn(
                                                'p-4 border rounded-lg text-center transition-colors',
                                                selectedTemplate === template.id && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <span className="text-3xl mb-2 block">{template.preview}</span>
                                            <p className="text-sm font-medium">{template.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{template.type}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedTemplate('custom')}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Create Custom Popup
                            </Button>

                            {selectedTemplate && (
                                <Button className="w-full" onClick={() => setActiveTab('trigger')}>
                                    Continue to Trigger Settings
                                </Button>
                            )}
                        </>
                    )}

                    {activeTab === 'trigger' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">When to Show</Label>
                                {triggerOptions.map((trigger) => (
                                    <button
                                        key={trigger.type}
                                        onClick={() => setSelectedTrigger(trigger.type)}
                                        className={cn(
                                            'w-full flex items-start gap-3 p-3 border rounded-lg text-left transition-colors',
                                            selectedTrigger === trigger.type && 'border-primary bg-primary/5'
                                        )}
                                    >
                                        <trigger.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{trigger.label}</p>
                                            <p className="text-xs text-muted-foreground">{trigger.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Trigger-specific settings */}
                            {selectedTrigger === 'time-delay' && (
                                <div className="space-y-2 p-3 bg-muted rounded-lg">
                                    <Label className="text-xs">Delay (seconds)</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max="60"
                                            value={timeDelay}
                                            onChange={(e) => setTimeDelay(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-medium w-8">{timeDelay}s</span>
                                    </div>
                                </div>
                            )}

                            {selectedTrigger === 'scroll' && (
                                <div className="space-y-2 p-3 bg-muted rounded-lg">
                                    <Label className="text-xs">Scroll Percentage</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            step="10"
                                            value={scrollPercentage}
                                            onChange={(e) => setScrollPercentage(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-medium w-10">{scrollPercentage}%</span>
                                    </div>
                                </div>
                            )}

                            {/* Display Rules */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs">Display Rules</Label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Don&apos;t show again after closing</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Respect &ldquo;Do Not Track&rdquo;</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Show only to new visitors</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Hide on mobile devices</span>
                                </label>
                            </div>

                            {/* Frequency */}
                            <div className="space-y-2">
                                <Label className="text-xs">Frequency</Label>
                                <select className="w-full h-9 px-3 border rounded-md text-sm">
                                    <option>Show once per session</option>
                                    <option>Show once per day</option>
                                    <option>Show once per week</option>
                                    <option>Show every time</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'design' && (
                        <>
                            <div className="space-y-3">
                                <Label className="text-xs">Popup Content</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Headline</Label>
                                    <Input defaultValue="Get 10% Off Your First Order!" className="text-sm" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                        defaultValue="Subscribe to our newsletter and receive an exclusive discount code."
                                        className="min-h-[60px] text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Button Text</Label>
                                    <Input defaultValue="Get My Discount" className="text-sm" />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs">Appearance</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Background Color</Label>
                                    <div className="flex gap-2">
                                        <input type="color" defaultValue="#ffffff" className="w-10 h-9 rounded cursor-pointer" />
                                        <Input defaultValue="#ffffff" className="flex-1 text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Button Color</Label>
                                    <div className="flex gap-2">
                                        <input type="color" defaultValue="#7c3aed" className="w-10 h-9 rounded cursor-pointer" />
                                        <Input defaultValue="#7c3aed" className="flex-1 text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Border Radius</Label>
                                    <select className="w-full h-9 px-3 border rounded-md text-sm">
                                        <option>None</option>
                                        <option>Small (4px)</option>
                                        <option>Medium (8px)</option>
                                        <option>Large (16px)</option>
                                        <option>Full (9999px)</option>
                                    </select>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Show close button</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Close on backdrop click</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Add backdrop blur</span>
                                </label>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <Label className="text-xs">Animation</Label>
                                <select className="w-full h-9 px-3 border rounded-md text-sm">
                                    <option>Fade In</option>
                                    <option>Scale Up</option>
                                    <option>Slide from Top</option>
                                    <option>Slide from Bottom</option>
                                    <option>Bounce</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'preview' && (
                        <>
                            {/* Preview Window */}
                            <div className="aspect-video bg-gray-900/80 rounded-lg flex items-center justify-center relative">
                                <div className="bg-white rounded-lg p-6 max-w-[80%] text-center shadow-xl">
                                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                        <X className="h-4 w-4" />
                                    </button>
                                    <h3 className="font-bold text-lg mb-2">Get 10% Off!</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Subscribe to our newsletter
                                    </p>
                                    <Input placeholder="Enter your email" className="mb-2 text-sm" />
                                    <Button className="w-full" size="sm">Get My Discount</Button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Play className="h-4 w-4 mr-2" />
                                    Test Popup
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Code
                                </Button>
                            </div>

                            {/* A/B Testing */}
                            <div className="p-3 bg-muted rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">A/B Testing</span>
                                    <Button variant="outline" size="sm" className="h-7">Enable</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Create variations to test which popup performs better
                                </p>
                            </div>

                            <Button className="w-full">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Save & Activate Popup
                            </Button>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
