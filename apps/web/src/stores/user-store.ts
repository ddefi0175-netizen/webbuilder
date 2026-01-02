'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Subscription,
    PlanTier,
    FeatureFlags,
    UsageRecord,
    UsageType
} from '@/types/subscription';
import { getPlanByTier, PRICING_PLANS } from '@/config/pricing';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
}

interface UserState {
    user: User | null;
    subscription: Subscription | null;
    usage: Record<UsageType, number>;
    featureFlags: FeatureFlags;
    isLoading: boolean;

    // Auth actions
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;

    // Subscription actions
    setSubscription: (subscription: Subscription) => void;
    cancelSubscription: () => void;

    // Usage tracking
    trackUsage: (type: UsageType, amount?: number) => void;
    resetMonthlyUsage: () => void;
    getRemainingCredits: (type: UsageType) => number;

    // Feature checks
    canUseFeature: (feature: keyof FeatureFlags) => boolean;
    checkLimit: (type: UsageType) => boolean;
}

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
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

function getFeatureFlagsForTier(tier: PlanTier): FeatureFlags {
    const plan = getPlanByTier(tier);
    if (!plan) return DEFAULT_FEATURE_FLAGS;

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

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            subscription: null,
            usage: {
                ai_chat_message: 0,
                ai_component_generation: 0,
                ai_image_generation: 0,
                ai_code_explanation: 0,
                ai_auto_build: 0,
                project_created: 0,
                page_created: 0,
                storage_used: 0,
                bandwidth_used: 0,
                export: 0,
                api_call: 0,
            },
            featureFlags: DEFAULT_FEATURE_FLAGS,
            isLoading: false,

            login: (user) => {
                set({ user });
            },

            logout: () => {
                set({
                    user: null,
                    subscription: null,
                    featureFlags: DEFAULT_FEATURE_FLAGS
                });
            },

            updateUser: (updates) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...updates } });
                }
            },

            setSubscription: (subscription) => {
                const featureFlags = getFeatureFlagsForTier(subscription.tier);
                set({ subscription, featureFlags });
            },

            cancelSubscription: () => {
                const { subscription } = get();
                if (subscription) {
                    set({
                        subscription: {
                            ...subscription,
                            cancelAtPeriodEnd: true,
                        },
                    });
                }
            },

            trackUsage: (type, amount = 1) => {
                const { usage } = get();
                set({
                    usage: {
                        ...usage,
                        [type]: usage[type] + amount,
                    },
                });
            },

            resetMonthlyUsage: () => {
                set({
                    usage: {
                        ai_chat_message: 0,
                        ai_component_generation: 0,
                        ai_image_generation: 0,
                        ai_code_explanation: 0,
                        ai_auto_build: 0,
                        project_created: 0,
                        page_created: 0,
                        storage_used: 0,
                        bandwidth_used: 0,
                        export: 0,
                        api_call: 0,
                    },
                });
            },

            getRemainingCredits: (type) => {
                const { subscription, usage } = get();
                const tier = subscription?.tier || 'free';
                const plan = getPlanByTier(tier);

                if (!plan) return 0;

                const limitMap: Partial<Record<UsageType, keyof typeof plan.limits>> = {
                    ai_chat_message: 'aiChatMessages',
                    ai_component_generation: 'aiCreditsPerMonth',
                    ai_image_generation: 'aiCreditsPerMonth',
                };

                const limitKey = limitMap[type];
                if (!limitKey) return Infinity;

                const limit = plan.limits[limitKey];
                if (limit === 'unlimited') return Infinity;

                return Math.max(0, (limit as number) - usage[type]);
            },

            canUseFeature: (feature) => {
                return get().featureFlags[feature];
            },

            checkLimit: (type) => {
                return get().getRemainingCredits(type) > 0;
            },
        }),
        {
            name: 'user-store',
            partialize: (state) => ({
                user: state.user,
                subscription: state.subscription,
                usage: state.usage,
            }),
        }
    )
);
