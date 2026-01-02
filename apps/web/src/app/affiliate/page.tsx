'use client';

import { useState } from 'react';
import {
    Gift,
    Users,
    DollarSign,
    Copy,
    Check,
    TrendingUp,
    Award,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AFFILIATE_TIERS } from '@/config/pricing';

// Mock affiliate data
const mockAffiliateData = {
    code: 'JOHN2024',
    tier: 'silver' as const,
    totalReferrals: 23,
    activeReferrals: 18,
    totalEarnings: 892.50,
    pendingEarnings: 145.00,
    paidEarnings: 747.50,
    conversionRate: 12.5,
    clicksThisMonth: 184,
    referralsThisMonth: 5,
    recentReferrals: [
        { id: '1', email: 'j***@gmail.com', plan: 'Pro', earnings: 29, date: '2 days ago', status: 'active' },
        { id: '2', email: 's***@startup.io', plan: 'Starter', earnings: 12, date: '5 days ago', status: 'active' },
        { id: '3', email: 'm***@agency.co', plan: 'Business', earnings: 79, date: '1 week ago', status: 'active' },
        { id: '4', email: 'l***@design.com', plan: 'Pro', earnings: 29, date: '2 weeks ago', status: 'churned' },
    ],
};

export default function AffiliatePage() {
    const [copied, setCopied] = useState(false);
    const affiliate = mockAffiliateData;

    const referralLink = `https://webbuilder.ai/ref/${affiliate.code}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tierInfo = AFFILIATE_TIERS[affiliate.tier];
    const nextTier = affiliate.tier === 'bronze' ? 'silver' :
        affiliate.tier === 'silver' ? 'gold' :
            affiliate.tier === 'gold' ? 'platinum' : null;
    const nextTierInfo = nextTier ? AFFILIATE_TIERS[nextTier] : null;
    const referralsToNext = nextTierInfo ? nextTierInfo.minReferrals - affiliate.totalReferrals : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Gift className="h-4 w-4" />
                        Affiliate Program
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Earn by Sharing WebBuilder</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get up to 35% commission for every user you refer. Build passive income while helping others create amazing websites.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={DollarSign}
                        label="Total Earnings"
                        value={`$${affiliate.totalEarnings.toFixed(2)}`}
                        subtext={`$${affiliate.pendingEarnings.toFixed(2)} pending`}
                    />
                    <StatCard
                        icon={Users}
                        label="Active Referrals"
                        value={affiliate.activeReferrals.toString()}
                        subtext={`${affiliate.totalReferrals} total`}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Conversion Rate"
                        value={`${affiliate.conversionRate}%`}
                        subtext={`${affiliate.clicksThisMonth} clicks this month`}
                    />
                    <StatCard
                        icon={Award}
                        label="Your Tier"
                        value={affiliate.tier.charAt(0).toUpperCase() + affiliate.tier.slice(1)}
                        subtext={`${tierInfo.commissionPercent}% commission`}
                    />
                </div>

                {/* Referral Link */}
                <div className="bg-card rounded-xl border p-6 mb-8">
                    <h2 className="font-semibold mb-4">Your Referral Link</h2>
                    <div className="flex gap-2">
                        <Input
                            value={referralLink}
                            readOnly
                            className="font-mono text-sm"
                        />
                        <Button onClick={() => copyToClipboard(referralLink)}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(affiliate.code)}>
                            Copy Code: {affiliate.code}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <a href={`https://twitter.com/intent/tweet?text=Build%20amazing%20websites%20with%20AI!%20Use%20my%20code%20${affiliate.code}%20for%20a%20discount&url=${encodeURIComponent(referralLink)}`} target="_blank">
                                Share on Twitter
                                <ExternalLink className="h-3 w-3 ml-2" />
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Tier Progress */}
                    <div className="bg-card rounded-xl border p-6">
                        <h2 className="font-semibold mb-4">Tier Progress</h2>
                        <div className="space-y-4">
                            {Object.entries(AFFILIATE_TIERS).map(([tier, info]) => {
                                const isCurrentTier = tier === affiliate.tier;
                                const isAchieved = affiliate.totalReferrals >= info.minReferrals;

                                return (
                                    <div
                                        key={tier}
                                        className={cn(
                                            'p-4 rounded-lg border-2 transition-all',
                                            isCurrentTier ? 'border-primary bg-primary/5' :
                                                isAchieved ? 'border-green-500/50 bg-green-500/5' :
                                                    'border-transparent bg-muted/50'
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium capitalize">{tier}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {info.minReferrals}+ referrals
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">{info.commissionPercent}%</p>
                                                {isCurrentTier && (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {nextTier && (
                            <p className="text-sm text-muted-foreground mt-4 text-center">
                                {referralsToNext} more referrals to reach {nextTier}!
                            </p>
                        )}
                    </div>

                    {/* Recent Referrals */}
                    <div className="col-span-2 bg-card rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Recent Referrals</h2>
                            <Button variant="ghost" size="sm">
                                View All
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {affiliate.recentReferrals.map((referral) => (
                                <div
                                    key={referral.id}
                                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{referral.email}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {referral.plan} • {referral.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">+${referral.earnings}</p>
                                        <span className={cn(
                                            'text-xs px-2 py-0.5 rounded-full',
                                            referral.status === 'active'
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-red-500/10 text-red-600'
                                        )}>
                                            {referral.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payout Section */}
                <div className="mt-8 bg-card rounded-xl border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold mb-1">Ready to Withdraw?</h2>
                            <p className="text-sm text-muted-foreground">
                                You have ${affiliate.pendingEarnings.toFixed(2)} available for payout
                            </p>
                        </div>
                        <Button disabled={affiliate.pendingEarnings < 50}>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Request Payout
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Minimum payout is $50. Payments are processed within 5 business days via PayPal or bank transfer.
                    </p>
                </div>

                {/* Marketing Resources */}
                <div className="mt-8 bg-card rounded-xl border p-6">
                    <h2 className="font-semibold mb-4">Marketing Resources</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Banner Ads', count: '12 sizes' },
                            { label: 'Email Templates', count: '5 templates' },
                            { label: 'Social Media Kit', count: '20+ assets' },
                            { label: 'Landing Pages', count: '3 variants' },
                        ].map((resource) => (
                            <Button key={resource.label} variant="outline" className="h-auto py-4 flex-col">
                                <span className="font-medium">{resource.label}</span>
                                <span className="text-xs text-muted-foreground">{resource.count}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    subtext
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext: string;
}) {
    return (
        <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{subtext}</p>
        </div>
    );
}
