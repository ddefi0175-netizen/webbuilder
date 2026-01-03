'use client';

import { useState } from 'react';
import {
    Sparkles,
    Play,
    Pause,
    RotateCcw,
    Eye,
    Zap,
    MousePointer,
    ArrowDown,
    Clock,
    Sliders,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'flip';
type TriggerType = 'load' | 'scroll' | 'hover' | 'click';

interface Animation {
    id: string;
    name: string;
    type: AnimationType;
    trigger: TriggerType;
    duration: number;
    delay: number;
    easing: string;
}

const animationPresets: { type: AnimationType; label: string; preview: string }[] = [
    { type: 'fade', label: 'Fade In', preview: 'opacity-0 → opacity-100' },
    { type: 'slide', label: 'Slide Up', preview: 'translateY(20px) → translateY(0)' },
    { type: 'scale', label: 'Scale Up', preview: 'scale(0.8) → scale(1)' },
    { type: 'rotate', label: 'Rotate In', preview: 'rotate(-10deg) → rotate(0)' },
    { type: 'bounce', label: 'Bounce', preview: 'spring animation' },
    { type: 'flip', label: 'Flip', preview: 'rotateY(180deg) → rotateY(0)' },
];

const triggerOptions: { type: TriggerType; label: string; icon: typeof Zap }[] = [
    { type: 'load', label: 'On Page Load', icon: Zap },
    { type: 'scroll', label: 'On Scroll', icon: ArrowDown },
    { type: 'hover', label: 'On Hover', icon: MousePointer },
    { type: 'click', label: 'On Click', icon: MousePointer },
];

const easingOptions = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
    'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
];

export function AnimationPanel() {
    const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'scroll'>('presets');
    const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('fade');
    const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>('scroll');
    const [duration, setDuration] = useState(500);
    const [delay, setDelay] = useState(0);
    const [easing, setEasing] = useState('ease-out');
    const [isPlaying, setIsPlaying] = useState(false);

    const tabs = [
        { id: 'presets', label: 'Presets', icon: Sparkles },
        { id: 'custom', label: 'Custom', icon: Sliders },
        { id: 'scroll', label: 'Scroll', icon: ArrowDown },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Animations</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Add animations and interactions
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
                    {activeTab === 'presets' && (
                        <>
                            {/* Animation Preview */}
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div
                                    className={cn(
                                        'w-20 h-20 bg-primary rounded-lg transition-all',
                                        isPlaying && selectedAnimation === 'fade' && 'animate-fade-in',
                                        isPlaying && selectedAnimation === 'slide' && 'animate-slide-up',
                                        isPlaying && selectedAnimation === 'scale' && 'animate-scale-up',
                                        isPlaying && selectedAnimation === 'rotate' && 'animate-rotate-in',
                                        isPlaying && selectedAnimation === 'bounce' && 'animate-bounce',
                                        isPlaying && selectedAnimation === 'flip' && 'animate-flip'
                                    )}
                                    style={{
                                        transitionDuration: `${duration}ms`,
                                        transitionDelay: `${delay}ms`,
                                        transitionTimingFunction: easing,
                                    }}
                                />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => setIsPlaying(false)}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Animation Presets */}
                            <div className="space-y-2">
                                <Label className="text-xs">Animation Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {animationPresets.map((anim) => (
                                        <button
                                            key={anim.type}
                                            onClick={() => setSelectedAnimation(anim.type)}
                                            className={cn(
                                                'p-3 border rounded-lg text-left transition-colors',
                                                selectedAnimation === anim.type && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <p className="text-sm font-medium">{anim.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">{anim.preview}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trigger */}
                            <div className="space-y-2">
                                <Label className="text-xs">Trigger</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {triggerOptions.map((trigger) => (
                                        <button
                                            key={trigger.type}
                                            onClick={() => setSelectedTrigger(trigger.type)}
                                            className={cn(
                                                'flex items-center gap-2 p-2 border rounded-lg transition-colors',
                                                selectedTrigger === trigger.type && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <trigger.icon className="h-4 w-4" />
                                            <span className="text-sm">{trigger.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="space-y-3">
                                <Label className="text-xs">Timing</Label>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Duration</span>
                                        <span className="text-xs font-medium">{duration}ms</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100"
                                        max="2000"
                                        step="100"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Delay</span>
                                        <span className="text-xs font-medium">{delay}ms</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="50"
                                        value={delay}
                                        onChange={(e) => setDelay(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Easing</Label>
                                    <select
                                        value={easing}
                                        onChange={(e) => setEasing(e.target.value)}
                                        className="w-full h-9 px-3 border rounded-md text-sm"
                                    >
                                        {easingOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <Button className="w-full">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Apply Animation
                            </Button>
                        </>
                    )}

                    {activeTab === 'custom' && (
                        <>
                            <div className="space-y-3">
                                <Label className="text-xs">Custom CSS Animation</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Keyframes Name</Label>
                                    <Input placeholder="myAnimation" className="text-sm font-mono" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Keyframes CSS</Label>
                                    <textarea
                                        className="w-full h-32 p-2 text-xs font-mono border rounded-md resize-none"
                                        placeholder={`@keyframes myAnimation {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Duration</Label>
                                        <Input defaultValue="0.5s" className="text-sm" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Iteration</Label>
                                        <Input defaultValue="1" className="text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Fill Mode</Label>
                                    <select className="w-full h-9 px-3 border rounded-md text-sm">
                                        <option>forwards</option>
                                        <option>backwards</option>
                                        <option>both</option>
                                        <option>none</option>
                                    </select>
                                </div>
                            </div>

                            <Button className="w-full">Apply Custom Animation</Button>
                        </>
                    )}

                    {activeTab === 'scroll' && (
                        <>
                            <div className="space-y-3">
                                <Label className="text-xs">Scroll Animations</Label>

                                <div className="p-3 border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Parallax Effect</span>
                                        <input type="checkbox" className="rounded" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Elements move at different speeds while scrolling
                                    </p>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Speed</Label>
                                        <input type="range" min="-1" max="1" step="0.1" defaultValue="0.5" className="w-full" />
                                    </div>
                                </div>

                                <div className="p-3 border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Reveal on Scroll</span>
                                        <input type="checkbox" className="rounded" defaultChecked />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Animate elements when they enter the viewport
                                    </p>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Threshold</Label>
                                        <select className="w-full h-8 px-2 border rounded-md text-sm">
                                            <option>10% visible</option>
                                            <option>25% visible</option>
                                            <option>50% visible</option>
                                            <option>75% visible</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-3 border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Sticky Elements</span>
                                        <input type="checkbox" className="rounded" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Pin elements while scrolling
                                    </p>
                                </div>

                                <div className="p-3 border rounded-lg space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Progress Bar</span>
                                        <input type="checkbox" className="rounded" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Show reading progress indicator
                                    </p>
                                </div>
                            </div>

                            <Button className="w-full">Save Scroll Settings</Button>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
