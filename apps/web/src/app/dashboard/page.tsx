'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import Link from 'next/link';
import {
    Layout,
    Sparkles,
    FileText,
    Settings,
    Plus,
    Search,
    MoreHorizontal,
    Clock,
    Globe,
    Zap,
    ArrowRight,
    BookOpen,
    CreditCard,
    Users,
    TrendingUp,
    Eye,
    Edit,
    Copy,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock user data
const USER = {
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Pro',
    credits: 850,
    websites: 12,
    pagesCreated: 67,
    aiGenerations: 234,
};

// Mock websites
const MOCK_WEBSITES = [
    {
        id: '1',
        name: 'My Portfolio',
        domain: 'portfolio.webbuilder.app',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
        lastEdited: '2 hours ago',
        status: 'published',
        views: 1234,
        pages: 5,
    },
    {
        id: '2',
        name: 'Coffee Shop',
        domain: 'coffee-shop.webbuilder.app',
        thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop',
        lastEdited: 'Yesterday',
        status: 'published',
        views: 567,
        pages: 8,
    },
    {
        id: '3',
        name: 'Tech Startup',
        domain: null,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        lastEdited: '3 days ago',
        status: 'draft',
        views: 0,
        pages: 3,
    },
];

const QUICK_ACTIONS = [
    {
        icon: Sparkles,
        label: 'AI Auto-Build',
        description: 'Generate a complete website',
        href: '/ai-builder',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Layout,
        label: 'Templates',
        description: 'Start from a template',
        href: '/templates',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: FileText,
        label: 'Blank Page',
        description: 'Start from scratch',
        href: '/editor',
        color: 'from-green-500 to-emerald-500'
    },
];

export default function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWebsites = MOCK_WEBSITES.filter((site) =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Welcome back, {USER.name.split(' ')[0]}!</h1>
                        <p className="text-muted-foreground">
                            {USER.plan} Plan • {USER.credits} AI credits remaining
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/credits">
                            <Button variant="outline" size="sm">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Buy Credits
                            </Button>
                        </Link>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Website
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Globe className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{USER.websites}</div>
                                <div className="text-sm text-muted-foreground">Websites</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{USER.pagesCreated}</div>
                                <div className="text-sm text-muted-foreground">Pages Created</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{USER.aiGenerations}</div>
                                <div className="text-sm text-muted-foreground">AI Generations</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">2.4K</div>
                                <div className="text-sm text-muted-foreground">Total Views</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {QUICK_ACTIONS.map((action) => (
                            <Link key={action.label} href={action.href}>
                                <div className="group bg-card border rounded-xl p-5 hover:border-primary transition-colors cursor-pointer">
                                    <div className={cn(
                                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4',
                                        action.color
                                    )}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                        {action.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Websites */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Your Websites</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search websites..."
                                className="pl-9 w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* New Website Card */}
                        <Link href="/ai-builder">
                            <div className="bg-card border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer min-h-[280px]">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <Plus className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Create New Website</h3>
                                <p className="text-sm text-muted-foreground">
                                    Start with AI or choose a template
                                </p>
                            </div>
                        </Link>

                        {/* Website Cards */}
                        {filteredWebsites.map((website) => (
                            <WebsiteCard key={website.id} website={website} />
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Learning */}
                    <div className="bg-card border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Continue Learning</h3>
                            <Link href="/learn" className="text-sm text-primary hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {[
                                { title: 'Getting Started with AI', progress: 60 },
                                { title: 'Design Principles', progress: 25 },
                            ].map((course) => (
                                <div key={course.title} className="p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">{course.title}</span>
                                        <span className="text-xs text-muted-foreground">{course.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Link href="/learn">
                                <Button variant="ghost" size="sm" className="w-full">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Browse Courses
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-card border rounded-xl p-5">
                        <h3 className="font-semibold mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {[
                                { action: 'Published', item: 'My Portfolio', time: '2 hours ago' },
                                { action: 'AI Generated', item: 'Hero Section', time: '5 hours ago' },
                                { action: 'Edited', item: 'Coffee Shop', time: 'Yesterday' },
                                { action: 'Created', item: 'Tech Startup', time: '3 days ago' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span>
                                        <span className="font-medium">{activity.action}</span>{' '}
                                        <span className="text-muted-foreground">{activity.item}</span>
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-auto">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade CTA */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-5 w-5" />
                            <span className="font-semibold">Upgrade to Business</span>
                        </div>
                        <p className="text-sm text-white/80 mb-4">
                            Get more AI credits, advanced features, and priority support.
                        </p>
                        <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                Unlimited AI generations
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                Custom domains
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                Advanced analytics
                            </li>
                        </ul>
                        <Link href="/pricing">
                            <Button variant="secondary" size="sm" className="w-full">
                                View Plans
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface WebsiteCardProps {
    website: typeof MOCK_WEBSITES[0];
}

function WebsiteCard({ website }: WebsiteCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="group bg-card border rounded-xl overflow-hidden hover:border-primary transition-colors">
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={website.thumbnail}
                    alt={website.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        website.status === 'published'
                            ? 'bg-green-500 text-white'
                            : 'bg-amber-500 text-white'
                    )}>
                        {website.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                    </Button>
                </div>

                {/* Menu button */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {showMenu && (
                        <div className="absolute top-10 right-0 w-40 bg-white rounded-lg shadow-lg border py-1 z-10">
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2">
                                <Copy className="h-4 w-4" />
                                Duplicate
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Open Site
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </button>
                            <hr className="my-1" />
                            <button className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold mb-1">{website.name}</h3>
                {website.domain ? (
                    <p className="text-sm text-muted-foreground mb-3 truncate">
                        {website.domain}
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground mb-3">
                        Not published yet
                    </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {website.lastEdited}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {website.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {website.pages} pages
                    </span>
                </div>
            </div>
        </div>
    );
}
