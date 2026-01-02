// Subscription and Monetization Types

export type PlanTier = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
export type BillingCycle = 'monthly' | 'annually';
export type PaymentStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';

export interface PricingPlan {
    id: string;
    tier: PlanTier;
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: PlanFeature[];
    limits: PlanLimits;
    popular?: boolean;
    badge?: string;
}

export interface PlanFeature {
    id: string;
    name: string;
    description: string;
    included: boolean;
    limit?: number | 'unlimited';
}

export interface PlanLimits {
    // Projects & Pages
    maxProjects: number | 'unlimited';
    maxPagesPerProject: number | 'unlimited';
    maxStorageMB: number | 'unlimited';
    maxBandwidthGB: number | 'unlimited';

    // AI Features
    aiCreditsPerMonth: number | 'unlimited';
    aiComponentGeneration: boolean;
    aiImageGeneration: boolean;
    aiCodeExplanation: boolean;
    aiChatMessages: number | 'unlimited';
    aiAutoBuilder: boolean;

    // Editor Features
    customDomain: boolean;
    removeWatermark: boolean;
    exportCode: boolean;
    exportFormats: ('html' | 'react' | 'vue' | 'nextjs')[];

    // Collaboration
    teamMembers: number;
    realTimeCollaboration: boolean;
    comments: boolean;
    versionHistory: number; // days

    // E-Commerce
    ecommerceEnabled: boolean;
    maxProducts: number;
    transactionFeePercent: number;

    // Advanced
    customCode: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    analytics: 'basic' | 'advanced' | 'enterprise';
    prioritySupport: boolean;
    dedicatedManager: boolean;
    sla: boolean;
    whiteLabelEnabled: boolean;
}

export interface Subscription {
    id: string;
    userId: string;
    planId: string;
    tier: PlanTier;
    billingCycle: BillingCycle;
    status: PaymentStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEnd?: Date;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
}

export interface UsageRecord {
    id: string;
    userId: string;
    type: UsageType;
    amount: number;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export type UsageType =
    | 'ai_chat_message'
    | 'ai_component_generation'
    | 'ai_image_generation'
    | 'ai_code_explanation'
    | 'ai_auto_build'
    | 'project_created'
    | 'page_created'
    | 'storage_used'
    | 'bandwidth_used'
    | 'export'
    | 'api_call';

export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price: number;
    bonusCredits?: number;
    popular?: boolean;
}

export interface AffiliateProgram {
    id: string;
    userId: string;
    code: string;
    commissionPercent: number;
    totalEarnings: number;
    pendingEarnings: number;
    referralCount: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface WhiteLabelConfig {
    id: string;
    userId: string;
    brandName: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    customDomain: string;
    customEmails: boolean;
    hideFooterBranding: boolean;
    customTerms?: string;
    customPrivacy?: string;
}

// Feature flags for gating
export interface FeatureFlags {
    canUseAIChat: boolean;
    canGenerateComponents: boolean;
    canGenerateImages: boolean;
    canAutoBuild: boolean;
    canExportCode: boolean;
    canUseCustomDomain: boolean;
    canRemoveWatermark: boolean;
    canCollaborate: boolean;
    canUseEcommerce: boolean;
    canAccessAPI: boolean;
    canWhiteLabel: boolean;
    canAccessAnalytics: boolean;
}
