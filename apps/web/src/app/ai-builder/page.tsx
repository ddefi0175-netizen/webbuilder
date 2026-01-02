'use client';

import { useState } from 'react';
import {
    Sparkles,
    Wand2,
    Globe,
    ArrowRight,
    Check,
    Loader2,
    Layout,
    ShoppingCart,
    Briefcase,
    FileText,
    Image,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const WEBSITE_TYPES = [
    { id: 'landing', label: 'Landing Page', icon: Layout, description: 'Single page to showcase your product' },
    { id: 'portfolio', label: 'Portfolio', icon: Image, description: 'Showcase your work and skills' },
    { id: 'business', label: 'Business', icon: Briefcase, description: 'Professional company website' },
    { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart, description: 'Online store with products' },
    { id: 'blog', label: 'Blog', icon: FileText, description: 'Content and article website' },
    { id: 'saas', label: 'SaaS', icon: Globe, description: 'Software as a service landing' },
    { id: 'agency', label: 'Agency', icon: Users, description: 'Creative or marketing agency' },
];

const STYLE_PRESETS = [
    { id: 'modern', label: 'Modern', colors: ['#3B82F6', '#1F2937', '#F9FAFB'] },
    { id: 'minimal', label: 'Minimal', colors: ['#000000', '#FFFFFF', '#F3F4F6'] },
    { id: 'bold', label: 'Bold', colors: ['#EF4444', '#111827', '#FEE2E2'] },
    { id: 'elegant', label: 'Elegant', colors: ['#8B5CF6', '#1E1B4B', '#EDE9FE'] },
    { id: 'nature', label: 'Nature', colors: ['#10B981', '#064E3B', '#D1FAE5'] },
    { id: 'warm', label: 'Warm', colors: ['#F59E0B', '#451A03', '#FEF3C7'] },
    { id: 'cool', label: 'Cool', colors: ['#06B6D4', '#164E63', '#CFFAFE'] },
    { id: 'dark', label: 'Dark', colors: ['#6366F1', '#0F172A', '#1E293B'] },
];

const GENERATION_STEPS = [
    { id: 'analyzing', label: 'Analyzing your requirements...' },
    { id: 'structure', label: 'Creating page structure...' },
    { id: 'content', label: 'Generating content...' },
    { id: 'styling', label: 'Applying styles...' },
    { id: 'optimizing', label: 'Optimizing for performance...' },
    { id: 'finalizing', label: 'Finalizing your website...' },
];

interface AIAutoBuilderProps {
    onComplete?: (projectId: string) => void;
}

export function AIAutoBuilder({ onComplete }: AIAutoBuilderProps) {
    const [step, setStep] = useState(1);
    const [websiteType, setWebsiteType] = useState<string | null>(null);
    const [stylePreset, setStylePreset] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [generatedProjectId, setGeneratedProjectId] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStep(4);

        // Simulate generation process
        for (let i = 0; i < GENERATION_STEPS.length; i++) {
            setGenerationStep(i);
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        }

        // Simulate completion
        const projectId = `project_${Date.now()}`;
        setGeneratedProjectId(projectId);
        setIsGenerating(false);

        if (onComplete) {
            onComplete(projectId);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return websiteType !== null;
            case 2: return stylePreset !== null;
            case 3: return description.trim().length > 10;
            default: return false;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center">
                        <div
                            className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                                s < step ? 'bg-primary text-primary-foreground' :
                                    s === step ? 'bg-primary text-primary-foreground' :
                                        'bg-muted text-muted-foreground'
                            )}
                        >
                            {s < step ? <Check className="h-5 w-5" /> : s}
                        </div>
                        {s < 4 && (
                            <div className={cn(
                                'w-20 h-1 mx-2',
                                s < step ? 'bg-primary' : 'bg-muted'
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Website Type */}
            {step === 1 && (
                <div className="animate-in fade-in duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">What type of website do you want to create?</h2>
                        <p className="text-muted-foreground">Select the type that best matches your needs</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {WEBSITE_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setWebsiteType(type.id)}
                                className={cn(
                                    'p-4 rounded-xl border text-left transition-all',
                                    websiteType === type.id
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'hover:border-muted-foreground/50'
                                )}
                            >
                                <type.icon className={cn(
                                    'h-8 w-8 mb-3',
                                    websiteType === type.id ? 'text-primary' : 'text-muted-foreground'
                                )} />
                                <h3 className="font-medium mb-1">{type.label}</h3>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Style Preset */}
            {step === 2 && (
                <div className="animate-in fade-in duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Choose a style for your website</h2>
                        <p className="text-muted-foreground">Select a color scheme and design style</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STYLE_PRESETS.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setStylePreset(style.id)}
                                className={cn(
                                    'p-4 rounded-xl border text-center transition-all',
                                    stylePreset === style.id
                                        ? 'border-primary shadow-lg'
                                        : 'hover:border-muted-foreground/50'
                                )}
                            >
                                <div className="flex justify-center gap-1 mb-3">
                                    {style.colors.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <h3 className="font-medium">{style.label}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Description */}
            {step === 3 && (
                <div className="animate-in fade-in duration-500">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">Describe your website</h2>
                        <p className="text-muted-foreground">Tell our AI what you want to build</p>
                    </div>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Describe your business, target audience, and what you want your website to achieve. For example: 'A modern portfolio website for a freelance photographer. I want to showcase my best work in categories like weddings, portraits, and nature. Include a contact form and about me section.'"
                            className="min-h-[200px] text-lg"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2">
                            <p className="text-sm text-muted-foreground mr-2">Quick prompts:</p>
                            {[
                                'Include testimonials section',
                                'Add pricing table',
                                'Show team members',
                                'Feature blog posts',
                                'Include FAQ section',
                            ].map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setDescription(d => d + (d ? ' ' : '') + prompt + '.')}
                                    className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    + {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Generating */}
            {step === 4 && (
                <div className="animate-in fade-in duration-500 text-center">
                    {isGenerating ? (
                        <>
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <Wand2 className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Creating Your Website</h2>
                            <p className="text-muted-foreground mb-8">Our AI is building your dream website...</p>

                            <div className="max-w-md mx-auto space-y-3">
                                {GENERATION_STEPS.map((genStep, i) => (
                                    <div
                                        key={genStep.id}
                                        className={cn(
                                            'flex items-center gap-3 p-3 rounded-lg transition-all',
                                            i < generationStep ? 'bg-green-500/10 text-green-600' :
                                                i === generationStep ? 'bg-primary/10 text-primary' :
                                                    'text-muted-foreground'
                                        )}
                                    >
                                        {i < generationStep ? (
                                            <Check className="h-5 w-5" />
                                        ) : i === generationStep ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <div className="w-5 h-5" />
                                        )}
                                        <span>{genStep.label}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                <Check className="h-10 w-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Your Website is Ready!</h2>
                            <p className="text-muted-foreground mb-8">
                                We&apos;ve created a beautiful website based on your requirements.
                            </p>

                            <div className="flex gap-4 justify-center">
                                <Button size="lg">
                                    <Globe className="h-4 w-4 mr-2" />
                                    Preview Website
                                </Button>
                                <Button size="lg" variant="outline">
                                    Open in Editor
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Navigation */}
            {step < 4 && (
                <div className="flex justify-between mt-8">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                    >
                        Back
                    </Button>

                    <Button
                        onClick={() => step === 3 ? handleGenerate() : setStep(s => s + 1)}
                        disabled={!canProceed()}
                    >
                        {step === 3 ? (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Website
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function AIAutoBuilderPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Sparkles className="h-4 w-4" />
                    AI-Powered
                </div>
                <h1 className="text-4xl font-bold mb-4">Build Your Website in Minutes</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Just describe what you want, and our AI will create a complete, professional website for you.
                </p>
            </div>

            <AIAutoBuilder />
        </div>
    );
}
