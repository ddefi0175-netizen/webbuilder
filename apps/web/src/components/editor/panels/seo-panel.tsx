'use client';

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { useState } from 'react';
import {
    Search,
    FileText,
    Globe,
    AlertCircle,
    CheckCircle,
    Sparkles,
    Loader2,
    BarChart2,
    Link as LinkIcon,
    Image,
    Heading,
    Type,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SEOData {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalUrl: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
}

interface SEOIssue {
    id: string;
    type: 'error' | 'warning' | 'success';
    category: string;
    message: string;
    suggestion?: string;
}

const defaultSEO: SEOData = {
    title: '',
    description: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    robotsIndex: true,
    robotsFollow: true,
};

export function SEOPanel() {
    const [seoData, setSEOData] = useState<SEOData>(defaultSEO);
    const [keywordInput, setKeywordInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [seoScore, setSeoScore] = useState<number | null>(null);
    const [issues, setIssues] = useState<SEOIssue[]>([]);
    const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced' | 'analysis'>('basic');

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
            setSEOData(prev => ({
                ...prev,
                keywords: [...prev.keywords, keywordInput.trim()]
            }));
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (keyword: string) => {
        setSEOData(prev => ({
            ...prev,
            keywords: prev.keywords.filter(k => k !== keyword)
        }));
    };

    const analyzeSEO = async () => {
        setIsAnalyzing(true);

        // Simulate SEO analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newIssues: SEOIssue[] = [];
        let score = 100;

        // Title checks
        if (!seoData.title) {
            newIssues.push({
                id: '1',
                type: 'error',
                category: 'Title',
                message: 'Page title is missing',
                suggestion: 'Add a descriptive page title between 50-60 characters'
            });
            score -= 20;
        } else if (seoData.title.length < 30) {
            newIssues.push({
                id: '2',
                type: 'warning',
                category: 'Title',
                message: 'Page title is too short',
                suggestion: 'Expand title to 50-60 characters for better SEO'
            });
            score -= 10;
        } else if (seoData.title.length > 60) {
            newIssues.push({
                id: '3',
                type: 'warning',
                category: 'Title',
                message: 'Page title is too long',
                suggestion: 'Shorten title to under 60 characters'
            });
            score -= 5;
        } else {
            newIssues.push({
                id: '4',
                type: 'success',
                category: 'Title',
                message: 'Page title length is optimal'
            });
        }

        // Description checks
        if (!seoData.description) {
            newIssues.push({
                id: '5',
                type: 'error',
                category: 'Description',
                message: 'Meta description is missing',
                suggestion: 'Add a meta description between 150-160 characters'
            });
            score -= 20;
        } else if (seoData.description.length < 120) {
            newIssues.push({
                id: '6',
                type: 'warning',
                category: 'Description',
                message: 'Meta description is too short',
                suggestion: 'Expand description to 150-160 characters'
            });
            score -= 10;
        } else if (seoData.description.length > 160) {
            newIssues.push({
                id: '7',
                type: 'warning',
                category: 'Description',
                message: 'Meta description is too long',
                suggestion: 'Shorten description to under 160 characters'
            });
            score -= 5;
        } else {
            newIssues.push({
                id: '8',
                type: 'success',
                category: 'Description',
                message: 'Meta description length is optimal'
            });
        }

        // Keywords checks
        if (seoData.keywords.length === 0) {
            newIssues.push({
                id: '9',
                type: 'warning',
                category: 'Keywords',
                message: 'No focus keywords defined',
                suggestion: 'Add 3-5 relevant keywords for your content'
            });
            score -= 10;
        } else if (seoData.keywords.length < 3) {
            newIssues.push({
                id: '10',
                type: 'warning',
                category: 'Keywords',
                message: 'Few keywords defined',
                suggestion: 'Consider adding more relevant keywords'
            });
            score -= 5;
        } else {
            newIssues.push({
                id: '11',
                type: 'success',
                category: 'Keywords',
                message: 'Good number of focus keywords'
            });
        }

        // Open Graph checks
        if (!seoData.ogImage) {
            newIssues.push({
                id: '12',
                type: 'warning',
                category: 'Social',
                message: 'Open Graph image is missing',
                suggestion: 'Add an OG image for better social media sharing'
            });
            score -= 10;
        }

        setSeoScore(Math.max(0, score));
        setIssues(newIssues);
        setIsAnalyzing(false);
    };

    const generateWithAI = async (field: 'title' | 'description' | 'keywords') => {
        setIsGenerating(true);

        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (field === 'title') {
            setSEOData(prev => ({
                ...prev,
                title: 'Professional Website Builder | Create Stunning Sites with AI'
            }));
        } else if (field === 'description') {
            setSEOData(prev => ({
                ...prev,
                description: 'Build beautiful, responsive websites in minutes with our AI-powered website builder. No coding required. Start with professional templates and customize everything.'
            }));
        } else if (field === 'keywords') {
            setSEOData(prev => ({
                ...prev,
                keywords: ['website builder', 'AI website', 'drag and drop', 'no code', 'web design', 'templates']
            }));
        }

        setIsGenerating(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">SEO Optimization</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Optimize your page for search engines
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {[
                    { id: 'basic', label: 'Basic' },
                    { id: 'social', label: 'Social' },
                    { id: 'advanced', label: 'Advanced' },
                    { id: 'analysis', label: 'Analysis' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            'flex-1 py-2 text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'basic' && (
                        <>
                            {/* Page Title */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Page Title</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => generateWithAI('title')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-3 w-3 mr-1" />
                                        )}
                                        AI Generate
                                    </Button>
                                </div>
                                <Input
                                    value={seoData.title}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter page title..."
                                    className="text-sm"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{seoData.title.length} characters</span>
                                    <span className={seoData.title.length > 60 ? 'text-yellow-500' : ''}>
                                        Recommended: 50-60
                                    </span>
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Meta Description</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => generateWithAI('description')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-3 w-3 mr-1" />
                                        )}
                                        AI Generate
                                    </Button>
                                </div>
                                <Textarea
                                    value={seoData.description}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter meta description..."
                                    rows={3}
                                    className="text-sm resize-none"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{seoData.description.length} characters</span>
                                    <span className={seoData.description.length > 160 ? 'text-yellow-500' : ''}>
                                        Recommended: 150-160
                                    </span>
                                </div>
                            </div>

                            {/* Focus Keywords */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Focus Keywords</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() => generateWithAI('keywords')}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-3 w-3 mr-1" />
                                        )}
                                        AI Suggest
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        placeholder="Add keyword..."
                                        className="text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                                    />
                                    <Button size="sm" onClick={handleAddKeyword}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {seoData.keywords.map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                                        >
                                            {keyword}
                                            <button
                                                onClick={() => handleRemoveKeyword(keyword)}
                                                className="hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'social' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Open Graph Title</Label>
                                <Input
                                    value={seoData.ogTitle || seoData.title}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, ogTitle: e.target.value }))}
                                    placeholder="Title for social sharing..."
                                    className="text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Open Graph Description</Label>
                                <Textarea
                                    value={seoData.ogDescription || seoData.description}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, ogDescription: e.target.value }))}
                                    placeholder="Description for social sharing..."
                                    rows={3}
                                    className="text-sm resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Open Graph Image URL</Label>
                                <Input
                                    value={seoData.ogImage}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, ogImage: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended size: 1200 x 630 pixels
                                </p>
                            </div>

                            {/* Preview */}
                            <div className="space-y-2">
                                <Label className="text-xs">Social Preview</Label>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="aspect-video bg-muted flex items-center justify-center">
                                        {seoData.ogImage ? (
                                            <img src={seoData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Image className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-card">
                                        <div className="text-xs text-muted-foreground mb-1">yoursite.com</div>
                                        <div className="font-medium text-sm truncate">
                                            {seoData.ogTitle || seoData.title || 'Page Title'}
                                        </div>
                                        <div className="text-xs text-muted-foreground line-clamp-2">
                                            {seoData.ogDescription || seoData.description || 'Page description will appear here'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'advanced' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Canonical URL</Label>
                                <Input
                                    value={seoData.canonicalUrl}
                                    onChange={(e) => setSEOData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                                    placeholder="https://example.com/page"
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Set a canonical URL if this content exists elsewhere
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs">Search Engine Visibility</Label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={seoData.robotsIndex}
                                        onChange={(e) => setSEOData(prev => ({ ...prev, robotsIndex: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Allow search engines to index this page</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={seoData.robotsFollow}
                                        onChange={(e) => setSEOData(prev => ({ ...prev, robotsFollow: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Allow search engines to follow links</span>
                                </label>
                            </div>

                            <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs font-medium mb-2">Robots Meta Tag</div>
                                <code className="text-xs">
                                    {seoData.robotsIndex ? 'index' : 'noindex'}, {seoData.robotsFollow ? 'follow' : 'nofollow'}
                                </code>
                            </div>
                        </>
                    )}

                    {activeTab === 'analysis' && (
                        <>
                            {/* SEO Score */}
                            <div className="text-center py-4">
                                {seoScore !== null ? (
                                    <>
                                        <div className={cn('text-4xl font-bold mb-2', getScoreColor(seoScore))}>
                                            {seoScore}
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-4">SEO Score</div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full transition-all', getProgressColor(seoScore))}
                                                style={{ width: `${seoScore}%` }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Run analysis to see your SEO score
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full"
                                onClick={analyzeSEO}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Analyze SEO
                                    </>
                                )}
                            </Button>

                            {/* Issues List */}
                            {issues.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    <Label className="text-xs">Issues & Recommendations</Label>
                                    {issues.map((issue) => (
                                        <div
                                            key={issue.id}
                                            className={cn(
                                                'p-3 rounded-lg text-sm',
                                                issue.type === 'error' && 'bg-red-500/10 border border-red-500/20',
                                                issue.type === 'warning' && 'bg-yellow-500/10 border border-yellow-500/20',
                                                issue.type === 'success' && 'bg-green-500/10 border border-green-500/20'
                                            )}
                                        >
                                            <div className="flex items-start gap-2">
                                                {issue.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                                                {issue.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                                                {issue.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                                                <div>
                                                    <div className="font-medium">{issue.message}</div>
                                                    {issue.suggestion && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {issue.suggestion}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
