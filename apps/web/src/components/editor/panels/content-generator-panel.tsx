'use client';

import { useState } from 'react';
import {
    Wand2,
    FileText,
    Heading,
    AlignLeft,
    Image,
    Loader2,
    Copy,
    Check,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ContentType = 'headline' | 'paragraph' | 'tagline' | 'cta' | 'product' | 'blog' | 'faq';

interface ContentTemplate {
    id: ContentType;
    name: string;
    icon: React.ElementType;
    description: string;
    placeholder: string;
}

const contentTemplates: ContentTemplate[] = [
    {
        id: 'headline',
        name: 'Headline',
        icon: Heading,
        description: 'Generate attention-grabbing headlines',
        placeholder: 'A website builder for small businesses'
    },
    {
        id: 'paragraph',
        name: 'Paragraph',
        icon: AlignLeft,
        description: 'Generate descriptive paragraphs',
        placeholder: 'Describe the features of our product'
    },
    {
        id: 'tagline',
        name: 'Tagline',
        icon: Sparkles,
        description: 'Generate catchy taglines',
        placeholder: 'A productivity app for teams'
    },
    {
        id: 'cta',
        name: 'Call to Action',
        icon: Wand2,
        description: 'Generate compelling CTAs',
        placeholder: 'Encourage users to sign up'
    },
    {
        id: 'product',
        name: 'Product Description',
        icon: FileText,
        description: 'Generate product descriptions',
        placeholder: 'Wireless headphones with noise cancellation'
    },
    {
        id: 'blog',
        name: 'Blog Intro',
        icon: FileText,
        description: 'Generate blog post introductions',
        placeholder: 'A post about healthy eating habits'
    },
    {
        id: 'faq',
        name: 'FAQ Answer',
        icon: FileText,
        description: 'Generate FAQ answers',
        placeholder: 'How do I reset my password?'
    },
];

// Mock AI responses for different content types
const mockGenerations: Record<ContentType, string[]> = {
    headline: [
        'Build Beautiful Websites in Minutes',
        'Transform Your Ideas Into Reality',
        'The Future of Website Building Is Here',
        'Create. Customize. Conquer.'
    ],
    paragraph: [
        'Our intuitive drag-and-drop builder makes website creation a breeze. With AI-powered suggestions and hundreds of templates, you can create professional websites without writing a single line of code. Start your digital journey today.',
        'Experience the power of modern web design with our cutting-edge platform. From stunning visuals to seamless functionality, we provide everything you need to build an online presence that stands out.',
        'Whether you\'re a small business owner, freelancer, or creative professional, our platform adapts to your needs. Customize every element, integrate your favorite tools, and launch in record time.'
    ],
    tagline: [
        'Design made simple.',
        'Your vision, our tools.',
        'Build without limits.',
        'Where creativity meets simplicity.'
    ],
    cta: [
        'Start Building for Free',
        'Get Started Today',
        'Try It Free - No Credit Card Required',
        'Launch Your Website Now',
        'Join 1 Million+ Users'
    ],
    product: [
        'Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation technology, 40-hour battery life, and ultra-comfortable design. Perfect for work, travel, or immersive music sessions.',
        'Elevate your listening experience with industry-leading sound quality. Memory foam ear cushions ensure all-day comfort, while smart features like auto-pause and voice assistant make every day easier.'
    ],
    blog: [
        'In today\'s fast-paced world, maintaining healthy eating habits can feel like a challenge. But with the right strategies and a bit of planning, you can transform your relationship with food and fuel your body for success.',
        'Have you ever wondered why some people seem to effortlessly maintain a healthy diet while others struggle? The secret lies not in willpower, but in understanding the psychology behind our food choices.'
    ],
    faq: [
        'To reset your password, click the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you a secure link to create a new password. The link expires in 24 hours for security reasons.',
        'You can reset your password easily through your account settings. Go to Settings > Security > Change Password. You\'ll need to enter your current password for verification before setting a new one.'
    ]
};

export function ContentGeneratorPanel() {
    const [selectedType, setSelectedType] = useState<ContentType>('headline');
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'persuasive'>('professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setGeneratedContent([]);

        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get mock content based on type
        const results = mockGenerations[selectedType] || [];
        setGeneratedContent(results);
        setIsGenerating(false);
    };

    const handleCopy = async (text: string, index: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleRegenerate = () => {
        handleGenerate();
    };

    const selectedTemplate = contentTemplates.find(t => t.id === selectedType);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">AI Content Generator</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Generate content for your website with AI
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Content Type Selection */}
                    <div className="space-y-2">
                        <Label className="text-xs">Content Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {contentTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedType(template.id)}
                                    className={cn(
                                        'p-3 rounded-lg border text-left transition-colors',
                                        selectedType === template.id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-primary/50'
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <template.icon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{template.name}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {template.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-2">
                        <Label className="text-xs">Describe what you need</Label>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={selectedTemplate?.placeholder || 'Enter your prompt...'}
                            rows={3}
                            className="text-sm resize-none"
                        />
                    </div>

                    {/* Tone Selection */}
                    <div className="space-y-2">
                        <Label className="text-xs">Tone</Label>
                        <div className="flex gap-2">
                            {[
                                { value: 'professional', label: 'Professional' },
                                { value: 'casual', label: 'Casual' },
                                { value: 'friendly', label: 'Friendly' },
                                { value: 'persuasive', label: 'Persuasive' },
                            ].map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value as any)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                                        tone === t.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Content
                            </>
                        )}
                    </Button>

                    {/* Generated Results */}
                    {generatedContent.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs">Generated Content</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={handleRegenerate}
                                    disabled={isGenerating}
                                >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Regenerate
                                </Button>
                            </div>

                            {generatedContent.map((content, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted rounded-lg group relative"
                                >
                                    <p className="text-sm pr-8">{content}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleCopy(content, index)}
                                    >
                                        {copiedIndex === index ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="pt-4 border-t">
                        <Label className="text-xs mb-2 block">Quick Generate</Label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Hero headline',
                                'About section',
                                'Feature description',
                                'Testimonial',
                                'Footer tagline'
                            ].map((quickAction) => (
                                <button
                                    key={quickAction}
                                    onClick={() => {
                                        setPrompt(quickAction);
                                        setSelectedType(quickAction.includes('headline') ? 'headline' : 'paragraph');
                                    }}
                                    className="px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
                                >
                                    {quickAction}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
