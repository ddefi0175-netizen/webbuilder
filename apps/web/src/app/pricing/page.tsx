'use client';

import { useState } from 'react';
import { Check, X, Sparkles, Zap, Building2, Crown } from 'lucide-react';
import { PRICING_PLANS, calculateAnnualSavingsPercent } from '@/config/pricing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BillingCycle, PricingPlan } from '@/types/subscription';

export function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    const planIcons: Record<string, React.ReactNode> = {
        free: <Zap className="h-6 w-6" />,
        starter: <Sparkles className="h-6 w-6" />,
        pro: <Crown className="h-6 w-6" />,
        business: <Building2 className="h-6 w-6" />,
        enterprise: <Building2 className="h-6 w-6" />,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Choose the perfect plan for your needs. Start free and upgrade as you grow.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={cn(
                            'px-4 py-2 rounded-lg font-medium transition-colors',
                            billingCycle === 'monthly'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('annually')}
                        className={cn(
                            'px-4 py-2 rounded-lg font-medium transition-colors',
                            billingCycle === 'annually'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        Annually
                        <span className="ml-2 text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                            Save up to 25%
                        </span>
                    </button>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                    {PRICING_PLANS.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            billingCycle={billingCycle}
                            icon={planIcons[plan.tier]}
                        />
                    ))}
                </div>
            </div>

            {/* Feature Comparison */}
            <FeatureComparison />

            {/* FAQ */}
            <PricingFAQ />

            {/* CTA */}
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Build Your Dream Website?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of creators who use WebBuilder AI to create stunning websites in minutes.
                    </p>
                    <Button size="lg" className="px-8">
                        Start Building for Free
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface PricingCardProps {
    plan: PricingPlan;
    billingCycle: BillingCycle;
    icon: React.ReactNode;
}

function PricingCard({ plan, billingCycle, icon }: PricingCardProps) {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice / 12;
    const savingsPercent = calculateAnnualSavingsPercent(plan);
    const isEnterprise = plan.tier === 'enterprise';

    return (
        <div
            className={cn(
                'relative rounded-2xl p-6 bg-card border flex flex-col',
                plan.popular && 'border-primary shadow-lg shadow-primary/10 scale-105'
            )}
        >
            {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {plan.badge}
                </div>
            )}

            <div className="mb-4">
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-6">
                {isEnterprise ? (
                    <div className="text-3xl font-bold">Custom</div>
                ) : (
                    <>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold">${Math.round(price)}</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        {billingCycle === 'annually' && savingsPercent > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                                Save {savingsPercent}% with annual billing
                            </p>
                        )}
                    </>
                )}
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.slice(0, 8).map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                            <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                        )}
                        <span className={cn(!feature.included && 'text-muted-foreground/50')}>
                            {feature.name}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
            >
                {isEnterprise ? 'Contact Sales' : plan.tier === 'free' ? 'Get Started' : 'Subscribe'}
            </Button>
        </div>
    );
}

function FeatureComparison() {
    const features = [
        { name: 'Projects', key: 'maxProjects' },
        { name: 'Pages per Project', key: 'maxPagesPerProject' },
        { name: 'AI Chat Messages/mo', key: 'aiChatMessages' },
        { name: 'AI Component Generation', key: 'aiComponentGeneration' },
        { name: 'AI Image Generation', key: 'aiImageGeneration' },
        { name: 'AI Auto-Builder', key: 'aiAutoBuilder' },
        { name: 'Custom Domain', key: 'customDomain' },
        { name: 'Remove Watermark', key: 'removeWatermark' },
        { name: 'Team Members', key: 'teamMembers' },
        { name: 'Storage', key: 'maxStorageMB' },
        { name: 'E-Commerce', key: 'ecommerceEnabled' },
        { name: 'API Access', key: 'apiAccess' },
        { name: 'White Label', key: 'whiteLabelEnabled' },
        { name: 'Priority Support', key: 'prioritySupport' },
    ];

    const formatValue = (value: unknown): string => {
        if (value === true) return '✓';
        if (value === false) return '—';
        if (value === 'unlimited') return '∞';
        if (typeof value === 'number') {
            if (value >= 1024) return `${value / 1024}GB`;
            return value.toString();
        }
        return String(value);
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-8">Compare All Features</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-4 px-4 font-medium">Feature</th>
                            {PRICING_PLANS.map((plan) => (
                                <th key={plan.id} className="text-center py-4 px-4 font-medium">
                                    {plan.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature) => (
                            <tr key={feature.key} className="border-b">
                                <td className="py-4 px-4 text-sm">{feature.name}</td>
                                {PRICING_PLANS.map((plan) => (
                                    <td key={plan.id} className="text-center py-4 px-4 text-sm">
                                        {formatValue((plan.limits as any)[feature.key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PricingFAQ() {
    const faqs = [
        {
            q: 'Can I switch plans at any time?',
            a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the new rate applies at your next billing cycle.',
        },
        {
            q: 'What happens when I run out of AI credits?',
            a: 'You can purchase additional credit packs at any time, or upgrade to a higher plan for more monthly credits. Your existing work is never affected.',
        },
        {
            q: 'Do you offer refunds?',
            a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund.',
        },
        {
            q: 'Can I use my websites commercially?',
            a: 'Absolutely! All plans allow commercial use of websites you create. Paid plans remove our watermark for fully branded sites.',
        },
        {
            q: 'What payment methods do you accept?',
            a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Enterprise plans.',
        },
        {
            q: 'Is there a limit on website traffic?',
            a: 'Each plan includes a bandwidth allocation. If you exceed it, you can purchase additional bandwidth or upgrade. We\'ll always notify you before any overage charges.',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto grid gap-4">
                {faqs.map((faq, i) => (
                    <div key={i} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{faq.q}</h3>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PricingPage;
