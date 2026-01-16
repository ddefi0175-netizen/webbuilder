'use client';

import Link from 'next/link';
import {
    Sparkles,
    Layout,
    Zap,
    Globe,
    Palette,
    Code2,
    ArrowRight,
    Check,
    Star,
    Play,
    Users,
    Building2,
    ShoppingBag,
    FileText,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';

const FEATURES = [
    {
        icon: Sparkles,
        title: 'AI-Powered Creation',
        description: 'Describe your vision and let AI build your website automatically. Generate content, images, and layouts in seconds.',
    },
    {
        icon: Layout,
        title: 'Drag & Drop Editor',
        description: 'Intuitive visual editor with real-time preview. No coding required to create stunning websites.',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Optimized performance out of the box. Your websites load fast on all devices.',
    },
    {
        icon: Globe,
        title: 'Custom Domains',
        description: 'Connect your own domain or use our free subdomain. SSL included automatically.',
    },
    {
        icon: Palette,
        title: 'Beautiful Templates',
        description: 'Start with professionally designed templates and customize them to match your brand.',
    },
    {
        icon: Code2,
        title: 'Developer Friendly',
        description: 'Export clean code, add custom CSS/JS, or integrate with your existing tools.',
    },
];

const USE_CASES = [
    { icon: Building2, label: 'Business Websites' },
    { icon: ShoppingBag, label: 'E-Commerce Stores' },
    { icon: Users, label: 'Portfolio Sites' },
    { icon: FileText, label: 'Blogs & Landing Pages' },
];

const TESTIMONIALS = [
    {
        quote: "WebBuilder's AI features saved me hours of work. I built my entire portfolio in under 30 minutes!",
        author: 'Sarah K.',
        role: 'Freelance Designer',
        rating: 5,
    },
    {
        quote: "The best website builder I've used. The AI understands exactly what I want and delivers every time.",
        author: 'Mike T.',
        role: 'Startup Founder',
        rating: 5,
    },
    {
        quote: "Finally a builder that doesn't require coding knowledge but still gives professional results.",
        author: 'Emma L.',
        role: 'Small Business Owner',
        rating: 5,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="container mx-auto px-4 py-20 md:py-32 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            AI-Powered Website Builder
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Build Websites with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                                AI Magic
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Create stunning websites in minutes, not hours. Just describe what you want, and our AI will build it for you. No coding required.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link href="/auth/register">
                                <Button size="lg" className="text-lg px-8 h-14">
                                    Start Building Free
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/templates">
                                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                                    <Play className="h-5 w-5 mr-2" />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                Free plan available
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                100+ templates
                            </span>
                        </div>
                    </div>

                    {/* Hero Image/Preview */}
                    <div className="mt-16 relative">
                        <div className="bg-gradient-to-t from-background via-transparent to-transparent absolute inset-x-0 bottom-0 h-32 z-10" />
                        <div className="bg-card border rounded-xl shadow-2xl overflow-hidden mx-auto max-w-5xl">
                            <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-grow text-center text-sm text-muted-foreground">
                                    webbuilder.app
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
                                alt="WebBuilder Preview"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        <span className="text-sm text-muted-foreground">Perfect for:</span>
                        {USE_CASES.map((useCase) => (
                            <div key={useCase.label} className="flex items-center gap-2 text-sm font-medium">
                                <useCase.icon className="h-5 w-5 text-primary" />
                                {useCase.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Everything You Need to Build Amazing Websites
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to help you create, launch, and grow your online presence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-2xl border bg-card hover:border-primary/50 transition-colors">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Feature Highlight */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                                <Sparkles className="h-4 w-4" />
                                AI Auto-Build
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Describe Your Website, Watch It Come to Life
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Our advanced AI understands natural language. Simply tell it what you want – &ldquo;a modern portfolio for a photographer with dark theme&rdquo; – and watch as it creates a complete, customizable website in seconds.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Generate entire websites from descriptions',
                                    'AI-powered content and image creation',
                                    'Smart component suggestions',
                                    'Automatic SEO optimization',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/ai-builder">
                                <Button size="lg">
                                    Try AI Builder
                                    <ChevronRight className="h-5 w-5 ml-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-card border rounded-xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span className="font-medium">AI Assistant</span>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-muted rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground mb-2">You said:</p>
                                    <p>&ldquo;Create a modern landing page for a fitness app with pricing section&rdquo;</p>
                                </div>
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                    <p className="text-sm text-primary mb-2">AI is building:</p>
                                    <ul className="text-sm space-y-1">
                                        <li>✓ Hero section with app preview</li>
                                        <li>✓ Features grid (6 items)</li>
                                        <li>✓ Testimonials carousel</li>
                                        <li>✓ Pricing table (3 plans)</li>
                                        <li>✓ Call-to-action footer</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Loved by Creators Worldwide
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Join thousands of happy users building amazing websites
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div key={index} className="bg-card border rounded-2xl p-6">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-lg mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div>
                                    <div className="font-semibold">{testimonial.author}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Build Your Dream Website?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Start for free, upgrade when you&apos;re ready. No credit card required.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/auth/register">
                            <Button size="lg" variant="secondary" className="text-lg px-8">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white/10">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted/30 py-12 border-t">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl">WebBuilder</span>
                            </Link>
                            <p className="text-muted-foreground mb-4 max-w-xs">
                                The AI-powered website builder that helps you create stunning websites in minutes.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/ai-builder" className="hover:text-foreground">AI Builder</Link></li>
                                <li><Link href="/templates" className="hover:text-foreground">Templates</Link></li>
                                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                                <li><Link href="/learn" className="hover:text-foreground">Learn</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                                <li><Link href="/affiliate" className="hover:text-foreground">Affiliate Program</Link></li>
                                <li><Link href="/white-label" className="hover:text-foreground">White Label</Link></li>
                                <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                                <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} WebBuilder. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
