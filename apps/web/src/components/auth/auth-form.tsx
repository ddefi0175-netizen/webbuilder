'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Github,
    Chrome,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface AuthFormProps {
    mode: 'login' | 'register' | 'forgot-password';
    onSubmit?: (data: AuthFormData) => void;
    isLoading?: boolean;
}

interface AuthFormData {
    email: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
}

export function AuthForm({ mode, onSubmit, isLoading }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<AuthFormData>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const newErrors: Partial<AuthFormData> = {};

        if (!formData.email || !formData.email.includes('@')) {
            newErrors.email = 'Please enter a valid email';
        }

        if (mode !== 'forgot-password') {
            if (!formData.password || formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }
        }

        if (mode === 'register') {
            if (!formData.name) {
                newErrors.name = 'Please enter your name';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && onSubmit) {
            onSubmit(formData);
        }
    };

    const titles = {
        login: 'Welcome back',
        register: 'Create your account',
        'forgot-password': 'Reset your password',
    };

    const subtitles = {
        login: 'Sign in to continue building amazing websites',
        register: 'Start creating stunning websites with AI',
        'forgot-password': 'We\'ll send you a link to reset your password',
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">{titles[mode]}</h1>
                <p className="text-muted-foreground mt-2">{subtitles[mode]}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className={cn('pl-10', errors.name && 'border-red-500')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className={cn('pl-10', errors.email && 'border-red-500')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                {mode !== 'forgot-password' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {mode === 'login' && (
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className={cn('pl-10 pr-10', errors.password && 'border-red-500')}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
                )}

                {mode === 'register' && (
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className={cn('pl-10', errors.confirmPassword && 'border-red-500')}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            {mode === 'login' ? 'Signing in...' : mode === 'register' ? 'Creating account...' : 'Sending...'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </form>

            {mode !== 'forgot-password' && (
                <>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        >
                            <Chrome className="h-4 w-4 mr-2" />
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                        </Button>
                    </div>
                </>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
                {mode === 'login' ? (
                    <>
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </>
                ) : mode === 'register' ? (
                    <>
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </>
                ) : (
                    <>
                        Remember your password?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </>
                )}
            </p>

            {mode === 'register' && (
                <p className="text-center text-xs text-muted-foreground mt-4">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
            )}
        </div>
    );
}
