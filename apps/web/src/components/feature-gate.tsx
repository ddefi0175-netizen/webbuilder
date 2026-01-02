'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUserStore } from '@/stores/user-store';
import { FeatureFlags, PlanTier } from '@/types/subscription';
import { getPlanByTier } from '@/config/pricing';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeatureGateContextValue {
    checkFeature: (feature: keyof FeatureFlags) => boolean;
    checkLimit: (type: string) => boolean;
    currentTier: PlanTier;
    requiredTierFor: (feature: keyof FeatureFlags) => PlanTier | null;
}

const FeatureGateContext = createContext<FeatureGateContextValue | null>(null);

export function FeatureGateProvider({ children }: { children: ReactNode }) {
    const { featureFlags, subscription, checkLimit } = useUserStore();
    const currentTier = subscription?.tier || 'free';

    const checkFeature = (feature: keyof FeatureFlags): boolean => {
        return featureFlags[feature];
    };

    const requiredTierFor = (feature: keyof FeatureFlags): PlanTier | null => {
        const tiers: PlanTier[] = ['free', 'starter', 'pro', 'business', 'enterprise'];

        for (const tier of tiers) {
            const plan = getPlanByTier(tier);
            if (!plan) continue;

            // Check if this tier enables the feature
            const flags = getFeatureFlagsForTier(tier);
            if (flags[feature]) {
                return tier;
            }
        }
        return null;
    };

    return (
        <FeatureGateContext.Provider
            value={{
                checkFeature,
                checkLimit: (type) => checkLimit(type as any),
                currentTier,
                requiredTierFor,
            }}
        >
            {children}
        </FeatureGateContext.Provider>
    );
}

function getFeatureFlagsForTier(tier: PlanTier): FeatureFlags {
    const plan = getPlanByTier(tier);
    if (!plan) {
        return {
            canUseAIChat: true,
            canGenerateComponents: false,
            canGenerateImages: false,
            canAutoBuild: false,
            canExportCode: false,
            canUseCustomDomain: false,
            canRemoveWatermark: false,
            canCollaborate: false,
            canUseEcommerce: false,
            canAccessAPI: false,
            canWhiteLabel: false,
            canAccessAnalytics: true,
        };
    }

    return {
        canUseAIChat: true,
        canGenerateComponents: plan.limits.aiComponentGeneration,
        canGenerateImages: plan.limits.aiImageGeneration,
        canAutoBuild: plan.limits.aiAutoBuilder,
        canExportCode: plan.limits.exportCode,
        canUseCustomDomain: plan.limits.customDomain,
        canRemoveWatermark: plan.limits.removeWatermark,
        canCollaborate: plan.limits.realTimeCollaboration,
        canUseEcommerce: plan.limits.ecommerceEnabled,
        canAccessAPI: plan.limits.apiAccess,
        canWhiteLabel: plan.limits.whiteLabelEnabled,
        canAccessAnalytics: true,
    };
}

export function useFeatureGate() {
    const context = useContext(FeatureGateContext);
    if (!context) {
        throw new Error('useFeatureGate must be used within FeatureGateProvider');
    }
    return context;
}

interface FeatureGateProps {
    feature: keyof FeatureFlags;
    children: ReactNode;
    fallback?: ReactNode;
    showUpgrade?: boolean;
}

export function FeatureGate({
    feature,
    children,
    fallback,
    showUpgrade = true
}: FeatureGateProps) {
    const { checkFeature, requiredTierFor } = useFeatureGate();

    if (checkFeature(feature)) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (showUpgrade) {
        const requiredTier = requiredTierFor(feature);
        return (
            <UpgradePrompt
                feature={feature}
                requiredTier={requiredTier || 'pro'}
            />
        );
    }

    return null;
}

interface UpgradePromptProps {
    feature: keyof FeatureFlags;
    requiredTier: PlanTier;
    variant?: 'inline' | 'card' | 'modal';
}

const featureNames: Record<keyof FeatureFlags, string> = {
    canUseAIChat: 'AI Chat',
    canGenerateComponents: 'AI Component Generation',
    canGenerateImages: 'AI Image Generation',
    canAutoBuild: 'AI Auto-Builder',
    canExportCode: 'Code Export',
    canUseCustomDomain: 'Custom Domains',
    canRemoveWatermark: 'Remove Watermark',
    canCollaborate: 'Team Collaboration',
    canUseEcommerce: 'E-Commerce',
    canAccessAPI: 'API Access',
    canWhiteLabel: 'White Label',
    canAccessAnalytics: 'Analytics',
};

export function UpgradePrompt({
    feature,
    requiredTier,
    variant = 'card'
}: UpgradePromptProps) {
    const plan = getPlanByTier(requiredTier);
    const featureName = featureNames[feature];

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Upgrade to {plan?.name} to unlock {featureName}</span>
                <Link href="/pricing">
                    <Button size="sm" variant="link" className="p-0 h-auto">
                        Upgrade
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-6 text-center bg-gradient-to-b from-muted/50 to-background">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Unlock {featureName}</h3>
            <p className="text-sm text-muted-foreground mb-4">
                This feature is available on the {plan?.name} plan and above.
            </p>
            <Link href="/pricing">
                <Button>
                    Upgrade to {plan?.name}
                    {plan && plan.monthlyPrice > 0 && (
                        <span className="ml-2 text-xs opacity-80">
                            from ${plan.monthlyPrice}/mo
                        </span>
                    )}
                </Button>
            </Link>
        </div>
    );
}

interface UsageLimitGateProps {
    type: 'ai_chat_message' | 'ai_component_generation' | 'ai_image_generation';
    children: ReactNode;
    onLimitReached?: () => void;
}

export function UsageLimitGate({ type, children, onLimitReached }: UsageLimitGateProps) {
    const { checkLimit, getRemainingCredits } = useUserStore();
    const remaining = getRemainingCredits(type);

    if (remaining <= 0) {
        return (
            <div className="border rounded-lg p-6 text-center">
                <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Usage Limit Reached</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    You&apos;ve used all your credits for this month.
                </p>
                <div className="flex gap-2 justify-center">
                    <Link href="/pricing">
                        <Button variant="outline">Upgrade Plan</Button>
                    </Link>
                    <Link href="/credits">
                        <Button>Buy Credits</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// Hook for checking features in components
export function useCanUseFeature(feature: keyof FeatureFlags): boolean {
    const { checkFeature } = useFeatureGate();
    return checkFeature(feature);
}
