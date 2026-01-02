'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Menu,
    X,
    Sparkles,
    ChevronDown,
    User,
    Settings,
    LogOut,
    CreditCard,
    HelpCircle,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    {
        label: 'Features',
        href: '#features',
        children: [
            { label: 'AI Website Builder', href: '/ai-builder', description: 'Generate complete websites with AI' },
            { label: 'Templates', href: '/templates', description: 'Start with professional templates' },
            { label: 'Editor', href: '/editor', description: 'Drag-and-drop website editor' },
        ]
    },
    {
        label: 'Solutions',
        href: '#solutions',
        children: [
            { label: 'For Business', href: '#', description: 'Enterprise solutions' },
            { label: 'For Agencies', href: '/white-label', description: 'White-label platform' },
            { label: 'For Creators', href: '#', description: 'Portfolio & personal sites' },
        ]
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Learn', href: '/learn' },
];

interface NavigationProps {
    isLoggedIn?: boolean;
}

export function Navigation({ isLoggedIn = false }: NavigationProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">WebBuilder</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-1',
                                        activeDropdown === item.label && 'bg-muted'
                                    )}
                                >
                                    {item.label}
                                    {item.children && <ChevronDown className="h-4 w-4" />}
                                </Link>

                                {item.children && activeDropdown === item.label && (
                                    <div className="absolute top-full left-0 pt-2">
                                        <div className="bg-card border rounded-xl shadow-lg p-2 min-w-[240px]">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                                                >
                                                    <div className="font-medium text-sm">{child.label}</div>
                                                    <div className="text-xs text-muted-foreground">{child.description}</div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium"
                                    >
                                        JD
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-56 bg-card border rounded-xl shadow-lg py-1">
                                            <div className="px-4 py-3 border-b">
                                                <div className="font-medium">John Doe</div>
                                                <div className="text-sm text-muted-foreground">john@example.com</div>
                                                <div className="mt-1 text-xs text-primary">Pro Plan • 850 credits</div>
                                            </div>
                                            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                            <Link href="/credits" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                                                <CreditCard className="h-4 w-4" />
                                                Credits & Billing
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </Link>
                                            <Link href="/support" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                                                <HelpCircle className="h-4 w-4" />
                                                Help & Support
                                            </Link>
                                            <hr className="my-1" />
                                            <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-left text-red-500">
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm">Sign In</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button size="sm">Get Started Free</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    className="block py-2 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <div className="pl-4 space-y-2 mt-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block py-1 text-sm text-muted-foreground"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <hr />

                        {isLoggedIn ? (
                            <Link href="/dashboard">
                                <Button className="w-full">Go to Dashboard</Button>
                            </Link>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/auth/login">
                                    <Button variant="outline" className="w-full">Sign In</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="w-full">Get Started Free</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
