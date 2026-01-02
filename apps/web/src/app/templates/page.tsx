'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    Star,
    Download,
    Eye,
    Heart,
    ShoppingCart,
    Layout,
    Briefcase,
    Store,
    FileText,
    Users,
    Palette,
    Crown,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TEMPLATE_CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: Layout },
    { id: 'landing', label: 'Landing Pages', icon: Layout },
    { id: 'portfolio', label: 'Portfolio', icon: Palette },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'ecommerce', label: 'E-Commerce', icon: Store },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'agency', label: 'Agency', icon: Users },
];

const MOCK_TEMPLATES = [
    {
        id: '1',
        name: 'Modern SaaS Landing',
        description: 'Clean, conversion-focused landing page for SaaS products',
        category: 'landing',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        author: 'WebBuilder Team',
        price: 0,
        isPremium: false,
        downloads: 12543,
        rating: 4.9,
        reviews: 234,
        tags: ['saas', 'startup', 'modern', 'dark'],
        featured: true,
    },
    {
        id: '2',
        name: 'Creative Portfolio',
        description: 'Stunning portfolio template for designers and artists',
        category: 'portfolio',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        author: 'DesignStudio',
        price: 29,
        isPremium: true,
        downloads: 5621,
        rating: 4.8,
        reviews: 156,
        tags: ['portfolio', 'creative', 'minimal'],
        featured: true,
    },
    {
        id: '3',
        name: 'E-Commerce Pro',
        description: 'Full-featured online store with product pages and cart',
        category: 'ecommerce',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        author: 'ShopTemplates',
        price: 49,
        isPremium: true,
        downloads: 8934,
        rating: 4.7,
        reviews: 312,
        tags: ['ecommerce', 'shop', 'products'],
        featured: false,
    },
    {
        id: '4',
        name: 'Startup One-Pager',
        description: 'Simple one-page template for startups',
        category: 'landing',
        thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
        author: 'WebBuilder Team',
        price: 0,
        isPremium: false,
        downloads: 23456,
        rating: 4.6,
        reviews: 567,
        tags: ['startup', 'simple', 'one-page'],
        featured: false,
    },
    {
        id: '5',
        name: 'Agency Premium',
        description: 'Professional agency website with case studies',
        category: 'agency',
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        author: 'AgencyPro',
        price: 39,
        isPremium: true,
        downloads: 3421,
        rating: 4.9,
        reviews: 89,
        tags: ['agency', 'professional', 'corporate'],
        featured: true,
    },
    {
        id: '6',
        name: 'Blog Starter',
        description: 'Clean blog template with article layouts',
        category: 'blog',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
        author: 'WebBuilder Team',
        price: 0,
        isPremium: false,
        downloads: 15678,
        rating: 4.5,
        reviews: 432,
        tags: ['blog', 'content', 'articles'],
        featured: false,
    },
    {
        id: '7',
        name: 'Business Corporate',
        description: 'Professional corporate website template',
        category: 'business',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
        author: 'CorpDesigns',
        price: 19,
        isPremium: true,
        downloads: 7823,
        rating: 4.7,
        reviews: 201,
        tags: ['business', 'corporate', 'professional'],
        featured: false,
    },
    {
        id: '8',
        name: 'Photography Portfolio',
        description: 'Gallery-focused template for photographers',
        category: 'portfolio',
        thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
        author: 'PhotoTemplates',
        price: 24,
        isPremium: true,
        downloads: 4532,
        rating: 4.8,
        reviews: 134,
        tags: ['photography', 'gallery', 'portfolio'],
        featured: false,
    },
];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
        if (selectedCategory !== 'all' && template.category !== selectedCategory) return false;
        if (showPremiumOnly && !template.isPremium) return false;
        if (showFreeOnly && template.isPremium) return false;
        if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const featuredTemplates = MOCK_TEMPLATES.filter(t => t.featured);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Template Marketplace</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start with a professional template and customize it to your needs. Free and premium options available.
                    </p>
                </div>

                {/* Featured Templates */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Featured Templates</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {featuredTemplates.slice(0, 3).map((template) => (
                            <TemplateCard key={template.id} template={template} featured />
                        ))}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={showFreeOnly ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => { setShowFreeOnly(!showFreeOnly); setShowPremiumOnly(false); }}
                        >
                            Free
                        </Button>
                        <Button
                            variant={showPremiumOnly ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => { setShowPremiumOnly(!showPremiumOnly); setShowFreeOnly(false); }}
                        >
                            <Crown className="h-4 w-4 mr-1" />
                            Premium
                        </Button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Categories Sidebar */}
                    <div className="w-56 shrink-0">
                        <h3 className="font-medium mb-4">Categories</h3>
                        <div className="space-y-1">
                            {TEMPLATE_CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                        selectedCategory === category.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    )}
                                >
                                    <category.icon className="h-4 w-4" />
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Grid */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground">
                                {filteredTemplates.length} templates found
                            </p>
                            <select className="text-sm border rounded-lg px-3 py-1.5">
                                <option>Most Popular</option>
                                <option>Newest</option>
                                <option>Highest Rated</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => (
                                <TemplateCard key={template.id} template={template} />
                            ))}
                        </div>

                        {filteredTemplates.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No templates found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sell Templates CTA */}
                <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Are You a Designer?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Sell your templates on our marketplace and earn money. We handle hosting, payments, and customer support.
                    </p>
                    <Button size="lg">
                        <Store className="h-4 w-4 mr-2" />
                        Become a Creator
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface TemplateCardProps {
    template: typeof MOCK_TEMPLATES[0];
    featured?: boolean;
}

function TemplateCard({ template, featured }: TemplateCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={cn(
                'group relative bg-card rounded-xl border overflow-hidden transition-all',
                featured && 'ring-2 ring-primary'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className={cn(
                    'absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity',
                    isHovered ? 'opacity-100' : 'opacity-0'
                )}>
                    <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                    </Button>
                    <Button size="sm">
                        {template.isPremium ? (
                            <>
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                ${template.price}
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4 mr-1" />
                                Use Free
                            </>
                        )}
                    </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {template.isPremium && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Premium
                        </span>
                    )}
                    {featured && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            Featured
                        </span>
                    )}
                </div>

                {/* Favorite button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{template.rating}</span>
                        <span className="text-muted-foreground">({template.reviews})</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        {template.downloads.toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-sm text-muted-foreground">by {template.author}</span>
                    <span className="font-semibold">
                        {template.isPremium ? `$${template.price}` : 'Free'}
                    </span>
                </div>
            </div>
        </div>
    );
}
