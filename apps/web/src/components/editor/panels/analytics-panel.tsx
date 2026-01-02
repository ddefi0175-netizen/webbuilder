'use client';

import { useState } from 'react';
import {
    BarChart2,
    Users,
    Eye,
    Clock,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    TrendingUp,
    TrendingDown,
    MousePointer,
    ArrowUpRight,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AnalyticsData {
    visitors: number;
    pageViews: number;
    avgSessionDuration: string;
    bounceRate: number;
    topPages: { page: string; views: number }[];
    topCountries: { country: string; visitors: number }[];
    devices: { device: string; percentage: number }[];
    trafficSources: { source: string; visitors: number }[];
}

const mockAnalytics: AnalyticsData = {
    visitors: 12543,
    pageViews: 45678,
    avgSessionDuration: '2m 34s',
    bounceRate: 42.5,
    topPages: [
        { page: '/', views: 15234 },
        { page: '/about', views: 8567 },
        { page: '/pricing', views: 6234 },
        { page: '/contact', views: 4521 },
        { page: '/blog', views: 3456 },
    ],
    topCountries: [
        { country: 'United States', visitors: 4532 },
        { country: 'United Kingdom', visitors: 2341 },
        { country: 'Germany', visitors: 1876 },
        { country: 'Canada', visitors: 1234 },
        { country: 'Australia', visitors: 987 },
    ],
    devices: [
        { device: 'desktop', percentage: 58 },
        { device: 'mobile', percentage: 35 },
        { device: 'tablet', percentage: 7 },
    ],
    trafficSources: [
        { source: 'Organic Search', visitors: 5432 },
        { source: 'Direct', visitors: 3456 },
        { source: 'Social Media', visitors: 2345 },
        { source: 'Referral', visitors: 1234 },
    ],
};

export function AnalyticsPanel() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const analytics = mockAnalytics;

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'desktop': return Monitor;
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            default: return Monitor;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Analytics</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Track your website performance
                </p>
            </div>

            {/* Time Range Selector */}
            <div className="p-4 border-b">
                <div className="flex gap-2">
                    {[
                        { value: '7d', label: '7 Days' },
                        { value: '30d', label: '30 Days' },
                        { value: '90d', label: '90 Days' },
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value as any)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                                timeRange === range.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-card border rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users className="h-4 w-4" />
                            <span className="text-xs">Visitors</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{analytics.visitors.toLocaleString()}</span>
                            <span className="flex items-center text-xs text-green-500">
                                <TrendingUp className="h-3 w-3" />
                                +12%
                            </span>
                        </div>
                    </div>

                    <div className="p-3 bg-card border rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">Page Views</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</span>
                            <span className="flex items-center text-xs text-green-500">
                                <TrendingUp className="h-3 w-3" />
                                +8%
                            </span>
                        </div>
                    </div>

                    <div className="p-3 bg-card border rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Avg. Session</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{analytics.avgSessionDuration}</span>
                            <span className="flex items-center text-xs text-green-500">
                                <TrendingUp className="h-3 w-3" />
                                +5%
                            </span>
                        </div>
                    </div>

                    <div className="p-3 bg-card border rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MousePointer className="h-4 w-4" />
                            <span className="text-xs">Bounce Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{analytics.bounceRate}%</span>
                            <span className="flex items-center text-xs text-red-500">
                                <TrendingDown className="h-3 w-3" />
                                +2%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Visitors Chart Placeholder */}
                <div className="space-y-2">
                    <Label className="text-xs">Visitors Over Time</Label>
                    <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                        <div className="flex items-end gap-1 h-20">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                                <div
                                    key={i}
                                    className="w-4 bg-primary/60 rounded-t transition-all hover:bg-primary"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="space-y-2">
                    <Label className="text-xs">Device Breakdown</Label>
                    <div className="space-y-2">
                        {analytics.devices.map((device) => {
                            const Icon = getDeviceIcon(device.device);
                            return (
                                <div key={device.device} className="flex items-center gap-3">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="capitalize">{device.device}</span>
                                            <span>{device.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${device.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Pages */}
                <div className="space-y-2">
                    <Label className="text-xs">Top Pages</Label>
                    <div className="space-y-1">
                        {analytics.topPages.slice(0, 5).map((page, index) => (
                            <div
                                key={page.page}
                                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                                    <span className="truncate max-w-[120px]">{page.page}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {page.views.toLocaleString()} views
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="space-y-2">
                    <Label className="text-xs">Traffic Sources</Label>
                    <div className="space-y-1">
                        {analytics.trafficSources.map((source) => (
                            <div
                                key={source.source}
                                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                                    <span>{source.source}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {source.visitors.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="space-y-2">
                    <Label className="text-xs">Top Countries</Label>
                    <div className="space-y-1">
                        {analytics.topCountries.slice(0, 5).map((country) => (
                            <div
                                key={country.country}
                                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3 w-3 text-muted-foreground" />
                                    <span>{country.country}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {country.visitors.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View Full Analytics Button */}
                <Button variant="outline" className="w-full">
                    View Full Analytics Dashboard
                </Button>
            </div>
        </div>
    );
}
