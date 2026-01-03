'use client';

import { useState } from 'react';
import {
    Image,
    Sparkles,
    Wand2,
    Scissors,
    Maximize,
    Palette,
    Download,
    RefreshCw,
    Copy,
    Loader2,
    ImagePlus,
    Eraser,
    Layers,
    SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ImageTool = 'generate' | 'remove-bg' | 'upscale' | 'style' | 'edit';

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
}

const imageStyles = [
    { id: 'photo', label: 'Photorealistic', preview: '📷' },
    { id: 'illustration', label: 'Illustration', preview: '🎨' },
    { id: 'cartoon', label: 'Cartoon', preview: '🖼️' },
    { id: '3d', label: '3D Render', preview: '🧊' },
    { id: 'watercolor', label: 'Watercolor', preview: '💧' },
    { id: 'sketch', label: 'Sketch', preview: '✏️' },
];

const aspectRatios = [
    { id: '1:1', label: 'Square', value: '1024x1024' },
    { id: '16:9', label: 'Landscape', value: '1792x1024' },
    { id: '9:16', label: 'Portrait', value: '1024x1792' },
    { id: '4:3', label: 'Standard', value: '1365x1024' },
];

export function AIImagePanel() {
    const [activeTool, setActiveTool] = useState<ImageTool>('generate');
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('photo');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => {
            setGeneratedImages([
                ...generatedImages,
                {
                    id: Date.now().toString(),
                    url: `https://placehold.co/512x512/7c3aed/white?text=AI+Generated`,
                    prompt: prompt,
                }
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    const tools: { id: ImageTool; label: string; icon: typeof Sparkles }[] = [
        { id: 'generate', label: 'Generate', icon: Sparkles },
        { id: 'remove-bg', label: 'Remove BG', icon: Eraser },
        { id: 'upscale', label: 'Upscale', icon: Maximize },
        { id: 'style', label: 'Style', icon: Palette },
        { id: 'edit', label: 'Edit', icon: Wand2 },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Image className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">AI Image Tools</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Generate and edit images with AI
                </p>
            </div>

            {/* Tool Tabs */}
            <div className="flex overflow-x-auto border-b no-scrollbar">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                            activeTool === tool.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tool.icon className="h-3.5 w-3.5" />
                        {tool.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTool === 'generate' && (
                        <>
                            {/* Prompt Input */}
                            <div className="space-y-2">
                                <Label className="text-xs">Describe your image</Label>
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="A modern office space with large windows, plants, and minimalist furniture..."
                                    className="min-h-[100px] text-sm"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrompt('Professional headshot of a business person, studio lighting')}
                                    >
                                        Portrait
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrompt('Abstract geometric pattern, vibrant colors, modern design')}
                                    >
                                        Abstract
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setPrompt('Minimalist product photography on white background')}
                                    >
                                        Product
                                    </Button>
                                </div>
                            </div>

                            {/* Style Selection */}
                            <div className="space-y-2">
                                <Label className="text-xs">Style</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {imageStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setSelectedStyle(style.id)}
                                            className={cn(
                                                'flex flex-col items-center gap-1 p-2 border rounded-lg transition-colors',
                                                selectedStyle === style.id && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <span className="text-xl">{style.preview}</span>
                                            <span className="text-xs">{style.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="space-y-2">
                                <Label className="text-xs">Aspect Ratio</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {aspectRatios.map((ratio) => (
                                        <button
                                            key={ratio.id}
                                            onClick={() => setAspectRatio(ratio.id)}
                                            className={cn(
                                                'p-2 border rounded-lg text-center transition-colors',
                                                aspectRatio === ratio.id && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <p className="text-xs font-medium">{ratio.id}</p>
                                            <p className="text-[10px] text-muted-foreground">{ratio.label}</p>
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
                                        Generate Image
                                    </>
                                )}
                            </Button>

                            {/* Generated Images */}
                            {generatedImages.length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-xs">Generated Images</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {generatedImages.map((img) => (
                                            <div key={img.id} className="relative group">
                                                <img
                                                    src={img.url}
                                                    alt={img.prompt}
                                                    className="w-full aspect-square object-cover rounded-lg border"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                    <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                                                        <Download className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                                                        <ImagePlus className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTool === 'remove-bg' && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Eraser className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium mb-1">Drop an image here</p>
                                <p className="text-xs text-muted-foreground mb-3">or click to upload</p>
                                <Button variant="outline" size="sm">Choose Image</Button>
                            </div>

                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium mb-1">AI Background Removal</p>
                                <p className="text-xs text-muted-foreground">
                                    Automatically remove backgrounds from any image with one click
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Options</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Transparent background</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Add solid color background</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Add shadow</span>
                                </label>
                            </div>
                        </>
                    )}

                    {activeTool === 'upscale' && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Maximize className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium mb-1">Upload image to upscale</p>
                                <p className="text-xs text-muted-foreground mb-3">PNG, JPG, WEBP supported</p>
                                <Button variant="outline" size="sm">Choose Image</Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Upscale Factor</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['2x', '4x', '8x'].map((factor) => (
                                        <button
                                            key={factor}
                                            className={cn(
                                                'p-3 border rounded-lg text-center transition-colors',
                                                factor === '2x' && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <p className="text-lg font-bold">{factor}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {factor === '2x' && '2048px'}
                                                {factor === '4x' && '4096px'}
                                                {factor === '8x' && '8192px'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Enhancement</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Enhance details</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Remove noise</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Sharpen edges</span>
                                </label>
                            </div>

                            <Button className="w-full" disabled>
                                <Maximize className="h-4 w-4 mr-2" />
                                Upscale Image
                            </Button>
                        </>
                    )}

                    {activeTool === 'style' && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Palette className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium mb-1">Upload image to transform</p>
                                <p className="text-xs text-muted-foreground mb-3">Apply AI style transfer</p>
                                <Button variant="outline" size="sm">Choose Image</Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Style Presets</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { name: 'Van Gogh', preview: '🌻' },
                                        { name: 'Anime', preview: '🎌' },
                                        { name: 'Cyberpunk', preview: '🌃' },
                                        { name: 'Vintage', preview: '📺' },
                                        { name: 'Watercolor', preview: '🎨' },
                                        { name: 'Pop Art', preview: '🎪' },
                                    ].map((style) => (
                                        <button
                                            key={style.name}
                                            className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <span className="text-xl">{style.preview}</span>
                                            <span className="text-sm">{style.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Style Strength</Label>
                                    <span className="text-xs font-medium">75%</span>
                                </div>
                                <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                            </div>

                            <Button className="w-full" disabled>
                                <Palette className="h-4 w-4 mr-2" />
                                Apply Style
                            </Button>
                        </>
                    )}

                    {activeTool === 'edit' && (
                        <>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <Wand2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium mb-1">Upload image to edit</p>
                                <p className="text-xs text-muted-foreground mb-3">AI-powered image editing</p>
                                <Button variant="outline" size="sm">Choose Image</Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Edit Instructions</Label>
                                <Textarea
                                    placeholder="Describe what you want to change... e.g., 'Make the sky more dramatic' or 'Add a mountain in the background'"
                                    className="min-h-[80px] text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Quick Edits</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        'Remove object',
                                        'Change color',
                                        'Add element',
                                        'Extend image',
                                        'Fix lighting',
                                        'Enhance face',
                                    ].map((edit) => (
                                        <Button key={edit} variant="outline" size="sm" className="text-xs">
                                            {edit}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full" disabled>
                                <Wand2 className="h-4 w-4 mr-2" />
                                Apply Edit
                            </Button>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
