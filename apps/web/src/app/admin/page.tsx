'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    Megaphone,
    GraduationCap,
    Store,
    DollarSign,
    TrendingUp,
    UserPlus,
    Activity,
    FileText,
    Globe,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Mock analytics data
const mockAnalytics = {
    totalUsers: 12847,
    activeUsers: 3241,
    newUsersToday: 127,
    totalRevenue: 284590,
    mrr: 47200,
    churnRate: 2.3,
    averageSessionTime: '18m 42s',
    totalProjects: 45823,

    revenueByPlan: [
        { plan: 'Starter', revenue: 12400, users: 1033 },
        { plan: 'Pro', revenue: 24560, users: 847 },
        { plan: 'Business', revenue: 8690, users: 110 },
        { plan: 'Enterprise', revenue: 1550, users: 3 },
    ],

    topFeatures: [
        { name: 'AI Chat', usage: 89234 },
        { name: 'Component Generation', usage: 45123 },
        { name: 'Auto-Builder', usage: 12847 },
        { name: 'Export', usage: 8934 },
    ],

    recentTransactions: [
        { id: '1', user: 'john@example.com', amount: 29, plan: 'Pro', date: '2 min ago' },
        { id: '2', user: 'sarah@startup.io', amount: 79, plan: 'Business', date: '15 min ago' },
        { id: '3', user: 'mike@agency.co', amount: 290, plan: 'Pro (Annual)', date: '1 hour ago' },
        { id: '4', user: 'lisa@design.com', amount: 12, plan: 'Starter', date: '2 hours ago' },
    ],

    affiliateStats: {
        totalAffiliates: 234,
        totalCommissions: 12450,
        pendingPayouts: 3200,
        topAffiliates: [
            { name: 'TechReviewer', referrals: 89, earnings: 2340 },
            { name: 'DesignDaily', referrals: 67, earnings: 1780 },
            { name: 'WebDevPro', referrals: 45, earnings: 1190 },
        ],
    },
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'affiliates', label: 'Affiliates', icon: DollarSign },
        { id: 'marketplace', label: 'Marketplace', icon: Store },
        { id: 'ads', label: 'Ads & Sponsors', icon: Megaphone },
        { id: 'courses', label: 'Courses', icon: GraduationCap },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r p-4">
                <div className="font-bold text-xl mb-8 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg" />
                    Admin Panel
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                activeTab === item.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {activeTab === 'overview' && <OverviewTab data={mockAnalytics} />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'subscriptions' && <SubscriptionsTab data={mockAnalytics} />}
                {activeTab === 'analytics' && <AnalyticsTab data={mockAnalytics} />}
                {activeTab === 'affiliates' && <AffiliatesTab data={mockAnalytics} />}
                {activeTab === 'marketplace' && <MarketplaceTab />}
                {activeTab === 'ads' && <AdsTab />}
                {activeTab === 'courses' && <CoursesTab />}
                {activeTab === 'settings' && <SettingsTab />}
            </main>
        </div>
    );
}

function OverviewTab({ data }: { data: typeof mockAnalytics }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Users"
                    value={data.totalUsers.toLocaleString()}
                    icon={Users}
                    change="+12%"
                    positive
                />
                <StatCard
                    title="MRR"
                    value={`$${data.mrr.toLocaleString()}`}
                    icon={DollarSign}
                    change="+8%"
                    positive
                />
                <StatCard
                    title="Active Users"
                    value={data.activeUsers.toLocaleString()}
                    icon={Activity}
                    change="+5%"
                    positive
                />
                <StatCard
                    title="Churn Rate"
                    value={`${data.churnRate}%`}
                    icon={TrendingUp}
                    change="-0.3%"
                    positive
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-lg border p-6">
                    <h3 className="font-semibold mb-4">Revenue by Plan</h3>
                    <div className="space-y-4">
                        {data.revenueByPlan.map((item) => (
                            <div key={item.plan} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.plan}</p>
                                    <p className="text-sm text-muted-foreground">{item.users} users</p>
                                </div>
                                <p className="font-semibold">${item.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <h3 className="font-semibold mb-4">Top Features Used</h3>
                    <div className="space-y-4">
                        {data.topFeatures.map((feature) => (
                            <div key={feature.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{feature.name}</span>
                                    <span className="text-muted-foreground">{feature.usage.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(feature.usage / data.topFeatures[0].usage) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Recent Transactions</h3>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-muted-foreground border-b">
                            <th className="pb-3">User</th>
                            <th className="pb-3">Plan</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.recentTransactions.map((tx) => (
                            <tr key={tx.id} className="border-b last:border-0">
                                <td className="py-3">{tx.user}</td>
                                <td className="py-3">{tx.plan}</td>
                                <td className="py-3 font-medium">${tx.amount}</td>
                                <td className="py-3 text-muted-foreground">{tx.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    change,
    positive
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    change: string;
    positive: boolean;
}) {
    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className={cn('text-sm', positive ? 'text-green-600' : 'text-red-600')}>
                {change} from last month
            </div>
        </div>
    );
}

function UsersTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                </Button>
            </div>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">User management table would go here...</p>
            </div>
        </div>
    );
}

function SubscriptionsTab({ data }: { data: typeof mockAnalytics }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${data.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    change="+15%"
                    positive
                />
                <StatCard
                    title="Active Subscriptions"
                    value={(data.revenueByPlan.reduce((a, b) => a + b.users, 0)).toLocaleString()}
                    icon={CreditCard}
                    change="+8%"
                    positive
                />
                <StatCard
                    title="Avg Revenue/User"
                    value={`$${Math.round(data.mrr / data.activeUsers)}`}
                    icon={TrendingUp}
                    change="+3%"
                    positive
                />
            </div>

            <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Subscription Breakdown</h3>
                <div className="space-y-3">
                    {data.revenueByPlan.map((item) => (
                        <div key={item.plan} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{item.plan}</p>
                                <p className="text-sm text-muted-foreground">{item.users} active users</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">${item.revenue.toLocaleString()}/mo</p>
                                <p className="text-sm text-muted-foreground">
                                    ${Math.round(item.revenue / item.users)}/user avg
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AnalyticsTab({ data }: { data: typeof mockAnalytics }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Analytics</h1>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Projects" value={data.totalProjects.toLocaleString()} icon={FileText} change="+22%" positive />
                <StatCard title="Avg Session" value={data.averageSessionTime} icon={Clock} change="+5%" positive />
                <StatCard title="New Users Today" value={data.newUsersToday.toString()} icon={UserPlus} change="+18%" positive />
                <StatCard title="Active Users" value={data.activeUsers.toLocaleString()} icon={Activity} change="+10%" positive />
            </div>

            <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Feature Usage Analytics</h3>
                <p className="text-muted-foreground">Detailed analytics charts would go here...</p>
            </div>
        </div>
    );
}

function AffiliatesTab({ data }: { data: typeof mockAnalytics }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Affiliate Program</h1>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Total Affiliates"
                    value={data.affiliateStats.totalAffiliates.toString()}
                    icon={Users}
                    change="+15%"
                    positive
                />
                <StatCard
                    title="Total Commissions"
                    value={`$${data.affiliateStats.totalCommissions.toLocaleString()}`}
                    icon={DollarSign}
                    change="+22%"
                    positive
                />
                <StatCard
                    title="Pending Payouts"
                    value={`$${data.affiliateStats.pendingPayouts.toLocaleString()}`}
                    icon={CreditCard}
                    change="+8%"
                    positive
                />
            </div>

            <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Top Affiliates</h3>
                <div className="space-y-3">
                    {data.affiliateStats.topAffiliates.map((affiliate, i) => (
                        <div key={affiliate.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-medium">{affiliate.name}</p>
                                    <p className="text-sm text-muted-foreground">{affiliate.referrals} referrals</p>
                                </div>
                            </div>
                            <p className="font-semibold text-green-600">${affiliate.earnings.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MarketplaceTab() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Template Marketplace</h1>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Marketplace management would go here...</p>
            </div>
        </div>
    );
}

function AdsTab() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Ads & Sponsorships</h1>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Ad and sponsor management would go here...</p>
            </div>
        </div>
    );
}

function CoursesTab() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Courses & Tutorials</h1>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Course management would go here...</p>
            </div>
        </div>
    );
}

function SettingsTab() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Admin settings would go here...</p>
            </div>
        </div>
    );
}
