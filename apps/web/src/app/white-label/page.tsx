'use client';

import { useState } from 'react';
import {
    Building2,
    Palette,
    Globe,
    Code,
    Settings,
    Check,
    Copy,
    Eye,
    Download,
    Upload,
    ChevronRight,
    Lock,
    Crown,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const WHITE_LABEL_PLANS = [
    {
        id: 'starter',
        name: 'White Label Starter',
        price: 199,
        features: [
            'Custom branding (logo, colors)',
            'Custom domain support',
            'Remove WebBuilder branding',
            'Up to 100 users',
            'Email support',
        ],
    },
    {
        id: 'business',
        name: 'White Label Business',
        price: 499,
        popular: true,
        features: [
            'Everything in Starter',
            'Custom login page',
            'Custom email templates',
            'Up to 500 users',
            'Priority support',
            'Custom onboarding',
        ],
    },
    {
        id: 'enterprise',
        name: 'White Label Enterprise',
        price: null,
        features: [
            'Everything in Business',
            'Unlimited users',
            'Custom features on request',
            'Dedicated account manager',
            'SLA guarantees',
            'Custom integrations',
            'On-premise deployment option',
        ],
    },
];

export default function WhiteLabelPage() {
    const [activeTab, setActiveTab] = useState('branding');
    const [brandName, setBrandName] = useState('MyWebBuilder');
    const [primaryColor, setPrimaryColor] = useState('#6366f1');
    const [customDomain, setCustomDomain] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        <Building2 className="h-4 w-4" />
                        Enterprise Feature
                    </div>
                    <h1 className="text-4xl font-bold mb-4">White Label Solution</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Resell our platform under your own brand. Customize everything from colors to domain.
                    </p>
                </div>

                {/* Pricing Plans */}
                <div className="grid grid-cols-3 gap-6 mb-16">
                    {WHITE_LABEL_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                'bg-card border rounded-2xl p-6 relative',
                                plan.popular && 'border-primary ring-2 ring-primary/20'
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                {plan.price !== null ? (
                                    <>
                                        <span className="text-4xl font-bold">${plan.price}</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold">Contact Sales</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={plan.popular ? 'default' : 'outline'}
                            >
                                {plan.price !== null ? 'Get Started' : 'Contact Sales'}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Configuration Demo */}
                <div className="bg-card border rounded-2xl overflow-hidden mb-16">
                    <div className="border-b p-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Configuration Preview</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            Available with White Label plan
                        </div>
                    </div>

                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-56 border-r p-4 space-y-1">
                            {[
                                { id: 'branding', label: 'Branding', icon: Palette },
                                { id: 'domain', label: 'Custom Domain', icon: Globe },
                                { id: 'login', label: 'Login Page', icon: Building2 },
                                { id: 'emails', label: 'Email Templates', icon: Settings },
                                { id: 'embed', label: 'Embed Code', icon: Code },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                                        activeTab === tab.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-grow p-6">
                            {activeTab === 'branding' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Brand Name</label>
                                        <Input
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            placeholder="Your Brand Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Logo</label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Drop your logo here or click to upload
                                            </p>
                                            <Button variant="outline" size="sm">Choose File</Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Primary Color</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-12 h-12 rounded-lg cursor-pointer"
                                            />
                                            <Input
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-32"
                                            />
                                            <div className="flex gap-2">
                                                {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setPrimaryColor(color)}
                                                        className="w-8 h-8 rounded-full border-2"
                                                        style={{ backgroundColor: color, borderColor: primaryColor === color ? 'black' : 'transparent' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Favicon</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                <Sparkles className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <Button variant="outline" size="sm">Upload Favicon</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'domain' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Custom Domain</label>
                                        <Input
                                            value={customDomain}
                                            onChange={(e) => setCustomDomain(e.target.value)}
                                            placeholder="builder.yourdomain.com"
                                        />
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Point your domain&apos;s CNAME to: <code className="bg-muted px-1.5 py-0.5 rounded">custom.webbuilder.app</code>
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-medium mb-3">DNS Configuration</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between p-2 bg-background rounded">
                                                <span className="font-mono">Type: CNAME</span>
                                                <span className="font-mono">Name: builder</span>
                                                <span className="font-mono">Value: custom.webbuilder.app</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">SSL Certificate</h4>
                                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="font-medium text-green-700">SSL Automatically Provisioned</div>
                                                <div className="text-sm text-green-600">We&apos;ll generate a free SSL certificate for your domain</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'login' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Login Page Preview</label>
                                        <div
                                            className="border rounded-xl p-8 text-center"
                                            style={{ borderColor: primaryColor + '40' }}
                                        >
                                            <div
                                                className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                {brandName.charAt(0)}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">Welcome to {brandName}</h3>
                                            <p className="text-muted-foreground mb-6">Sign in to your account</p>
                                            <div className="max-w-xs mx-auto space-y-3">
                                                <Input placeholder="Email address" />
                                                <Input type="password" placeholder="Password" />
                                                <Button
                                                    className="w-full"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    Sign In
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Custom Login Message</label>
                                        <Input placeholder="Enter a welcome message for your users" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'emails' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Templates</label>
                                        <div className="space-y-2">
                                            {['Welcome Email', 'Password Reset', 'Invoice', 'Subscription Confirmation'].map((template) => (
                                                <div key={template} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <span>{template}</span>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Preview
                                                        </Button>
                                                        <Button variant="outline" size="sm">Edit</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">From Email Address</label>
                                        <Input placeholder="noreply@yourdomain.com" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'embed' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Embed Code</label>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Add this code to your website to embed the builder
                                        </p>
                                        <div className="relative">
                                            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                                {`<script src="https://cdn.webbuilder.app/embed.js"></script>
<div id="webbuilder-embed" 
     data-brand="${brandName}"
     data-color="${primaryColor}"
     data-domain="${customDomain || 'your-domain.com'}">
</div>`}
                                            </pre>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                            >
                                                <Copy className="h-4 w-4 mr-1" />
                                                Copy
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">API Access</label>
                                        <div className="flex items-center gap-3">
                                            <Input value="wl_api_xxxxxxxxxxxx" readOnly className="font-mono" />
                                            <Button variant="outline">Regenerate</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8">White Label Features</h2>
                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { icon: Palette, title: 'Full Branding', desc: 'Custom logo, colors, and fonts' },
                            { icon: Globe, title: 'Custom Domain', desc: 'Your own URL with SSL' },
                            { icon: Building2, title: 'Custom Login', desc: 'Branded authentication pages' },
                            { icon: Code, title: 'API Access', desc: 'Full API for integration' },
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-white text-center">
                    <Crown className="h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Ready to Launch Your Own Platform?</h2>
                    <p className="text-white/80 mb-6 max-w-xl mx-auto">
                        Start reselling our website builder under your own brand today. No technical knowledge required.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button size="lg" variant="secondary">
                            Schedule Demo
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
