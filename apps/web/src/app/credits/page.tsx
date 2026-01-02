'use client';

import { useState } from 'react';
import {
    Zap,
    Plus,
    Sparkles,
    Gift,
    TrendingUp,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CREDIT_PACKS } from '@/config/pricing';
import { useUserStore } from '@/stores/user-store';

export default function CreditsPage() {
    const { usage, subscription } = useUserStore();
    const [selectedPack, setSelectedPack] = useState<string | null>(null);

    // Calculate remaining credits (mock)
    const monthlyCredits = subscription?.tier === 'pro' ? 2000 :
        subscription?.tier === 'business' ? 'unlimited' :
            subscription?.tier === 'starter' ? 500 : 50;
    const usedCredits = usage.ai_chat_message + usage.ai_component_generation + usage.ai_image_generation;
    const remainingCredits = monthlyCredits === 'unlimited' ? '∞' : Math.max(0, (monthlyCredits as number) - usedCredits);
    const purchasedCredits = 0; // Would come from user data

    const handlePurchase = async () => {
        if (!selectedPack) return;

        // Redirect to checkout
        const response = await fetch('/api/payments/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                packId: selectedPack,
                userId: 'user-id', // Would come from auth
            }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Zap className="h-4 w-4" />
                        AI Credits
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Power Your Creativity</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        AI credits power all your generations. Buy more anytime or upgrade your plan for monthly credits.
                    </p>
                </div>

                {/* Current Balance */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-card rounded-2xl border p-8">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Monthly Credits</p>
                                <p className="text-4xl font-bold text-primary">
                                    {typeof remainingCredits === 'number' ? remainingCredits.toLocaleString() : remainingCredits}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    of {typeof monthlyCredits === 'number' ? monthlyCredits.toLocaleString() : monthlyCredits} remaining
                                </p>
                            </div>

                            <div className="text-center border-x">
                                <p className="text-sm text-muted-foreground mb-2">Purchased Credits</p>
                                <p className="text-4xl font-bold text-green-600">{purchasedCredits.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground mt-1">never expire</p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Credits Used Today</p>
                                <p className="text-4xl font-bold">{usedCredits}</p>
                                <p className="text-sm text-muted-foreground mt-1">resets monthly</p>
                            </div>
                        </div>

                        {/* Usage breakdown */}
                        <div className="mt-8 pt-8 border-t">
                            <h3 className="font-medium mb-4">Usage Breakdown</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'AI Chat', used: usage.ai_chat_message, cost: 1 },
                                    { label: 'Component Gen', used: usage.ai_component_generation, cost: 5 },
                                    { label: 'Image Gen', used: usage.ai_image_generation, cost: 10 },
                                    { label: 'Auto-Build', used: usage.ai_auto_build, cost: 50 },
                                ].map((item) => (
                                    <div key={item.label} className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">{item.label}</p>
                                        <p className="text-2xl font-semibold">{item.used}</p>
                                        <p className="text-xs text-muted-foreground">{item.cost} credit{item.cost > 1 ? 's' : ''}/use</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Packs */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Buy Credit Packs</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {CREDIT_PACKS.map((pack) => (
                            <button
                                key={pack.id}
                                onClick={() => setSelectedPack(pack.id)}
                                className={cn(
                                    'relative p-6 rounded-xl border text-left transition-all',
                                    selectedPack === pack.id
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'hover:border-muted-foreground/50',
                                    pack.popular && 'ring-2 ring-primary'
                                )}
                            >
                                {pack.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                        Popular
                                    </span>
                                )}

                                <Sparkles className={cn(
                                    'h-6 w-6 mb-3',
                                    selectedPack === pack.id ? 'text-primary' : 'text-muted-foreground'
                                )} />

                                <h3 className="font-semibold mb-1">{pack.name}</h3>
                                <p className="text-3xl font-bold mb-1">{pack.credits.toLocaleString()}</p>
                                {pack.bonusCredits && (
                                    <p className="text-sm text-green-600 mb-2">
                                        +{pack.bonusCredits} bonus!
                                    </p>
                                )}
                                <p className="text-lg font-medium">${pack.price}</p>
                                <p className="text-xs text-muted-foreground">
                                    ${(pack.price / (pack.credits + (pack.bonusCredits || 0)) * 100).toFixed(1)}¢ per credit
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            disabled={!selectedPack}
                            onClick={handlePurchase}
                            className="px-12"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Purchase Credits
                        </Button>
                    </div>

                    {/* Benefits */}
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Gift className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-2">Never Expire</h3>
                            <p className="text-sm text-muted-foreground">
                                Purchased credits are yours forever. Use them whenever you need.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-2">Better Value</h3>
                            <p className="text-sm text-muted-foreground">
                                Bigger packs = bigger savings. Up to 40% more credits per dollar.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Check className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-2">Instant Access</h3>
                            <p className="text-sm text-muted-foreground">
                                Credits are added to your account immediately after purchase.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
