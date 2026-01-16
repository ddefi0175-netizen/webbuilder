'use client';

import { useState } from 'react';
import {
    Shield,
    Lock,
    Key,
    Eye,
    EyeOff,
    AlertTriangle,
    CheckCircle,
    FileText,
    Globe,
    Users,
    Settings,
    RefreshCw,
    Download,
    Trash2,
    History,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SecurityCheck {
    id: string;
    name: string;
    status: 'passed' | 'warning' | 'failed';
    description: string;
}

export function SecurityPanel() {
    const [activeTab, setActiveTab] = useState<'overview' | 'ssl' | 'gdpr' | 'access'>('overview');
    const [showPassword, setShowPassword] = useState(false);

    const securityChecks: SecurityCheck[] = [
        { id: '1', name: 'SSL Certificate', status: 'passed', description: 'SSL is active and valid until Dec 2025' },
        { id: '2', name: 'GDPR Compliance', status: 'passed', description: 'Cookie consent and privacy policy configured' },
        { id: '3', name: 'Two-Factor Auth', status: 'warning', description: 'Recommended for account security' },
        { id: '4', name: 'Password Strength', status: 'passed', description: 'Strong password policy enabled' },
        { id: '5', name: 'Data Encryption', status: 'passed', description: 'All data encrypted at rest and in transit' },
        { id: '6', name: 'Backup Status', status: 'passed', description: 'Daily automated backups enabled' },
    ];

    const securityScore = Math.round(
        (securityChecks.filter(c => c.status === 'passed').length / securityChecks.length) * 100
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Shield },
        { id: 'ssl', label: 'SSL', icon: Lock },
        { id: 'gdpr', label: 'GDPR', icon: FileText },
        { id: 'access', label: 'Access', icon: Key },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Security</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Protect your website and users
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'overview' && (
                        <>
                            {/* Security Score */}
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <Label className="text-sm font-medium">Security Score</Label>
                                    <span className={cn(
                                        'text-2xl font-bold',
                                        securityScore >= 80 ? 'text-green-600' :
                                            securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    )}>
                                        {securityScore}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            securityScore >= 80 ? 'bg-green-500' :
                                                securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        )}
                                        style={{ width: `${securityScore}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {securityScore >= 80 ? 'Your security is excellent!' :
                                        securityScore >= 60 ? 'Consider improving a few areas' :
                                            'Your site needs security improvements'}
                                </p>
                            </div>

                            {/* Security Checks */}
                            <div className="space-y-2">
                                <Label className="text-xs">Security Checks</Label>
                                {securityChecks.map((check) => (
                                    <div
                                        key={check.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg"
                                    >
                                        {check.status === 'passed' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        ) : check.status === 'warning' ? (
                                            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                                        ) : (
                                            <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{check.name}</p>
                                            <p className="text-xs text-muted-foreground">{check.description}</p>
                                        </div>
                                        {check.status !== 'passed' && (
                                            <Button variant="ghost" size="sm" className="text-xs h-7">
                                                Fix
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Run Security Scan
                            </Button>
                        </>
                    )}

                    {activeTab === 'ssl' && (
                        <>
                            {/* SSL Status */}
                            <div className="p-4 bg-green-500/10 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <ShieldCheck className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-700">SSL Certificate Active</p>
                                        <p className="text-xs text-green-600">Your site is secure with HTTPS</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Certificate Provider</p>
                                        <p className="text-xs text-muted-foreground">Let&apos;s Encrypt</p>
                                    </div>
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Valid Until</p>
                                        <p className="text-xs text-muted-foreground">December 15, 2025</p>
                                    </div>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Auto-Renewal</p>
                                        <p className="text-xs text-muted-foreground">Certificate will auto-renew</p>
                                    </div>
                                    <RefreshCw className="h-4 w-4 text-primary" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <Label className="text-xs">SSL Settings</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Force HTTPS redirect</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">HSTS (HTTP Strict Transport Security)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">Include subdomains in HSTS</span>
                                </label>
                            </div>
                        </>
                    )}

                    {activeTab === 'gdpr' && (
                        <>
                            {/* GDPR Compliance */}
                            <div className="p-4 bg-primary/10 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-medium">GDPR Compliant</p>
                                        <p className="text-xs text-muted-foreground">Your site meets EU data protection requirements</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs">Cookie Consent</Label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Show cookie consent banner</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Require explicit consent</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Allow granular cookie preferences</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs">Legal Pages</Label>
                                {[
                                    { name: 'Privacy Policy', status: 'configured' },
                                    { name: 'Terms of Service', status: 'configured' },
                                    { name: 'Cookie Policy', status: 'configured' },
                                    { name: 'GDPR Data Request Form', status: 'configured' },
                                ].map((page) => (
                                    <div key={page.name} className="flex items-center justify-between p-2 border rounded-lg">
                                        <span className="text-sm">{page.name}</span>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs">Data Handling</Label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Enable data export requests</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Enable data deletion requests</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Anonymize analytics data</span>
                                </label>
                            </div>

                            <Button variant="outline" className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Export User Data
                            </Button>
                        </>
                    )}

                    {activeTab === 'access' && (
                        <>
                            {/* Access Control */}
                            <div className="space-y-3">
                                <Label className="text-xs">Account Security</Label>

                                <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Two-Factor Authentication</p>
                                            <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                                        </div>
                                        <Button variant="outline" size="sm">Enable</Button>
                                    </div>
                                </div>

                                <div className="p-3 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Password</p>
                                            <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                                        </div>
                                        <Button variant="outline" size="sm">Change</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs">Session Management</Label>
                                {[
                                    { device: 'Chrome on MacOS', location: 'San Francisco, US', current: true },
                                    { device: 'Safari on iPhone', location: 'San Francisco, US', current: false },
                                    { device: 'Firefox on Windows', location: 'New York, US', current: false },
                                ].map((session, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm">{session.device}</p>
                                                {session.current && (
                                                    <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-xs rounded">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{session.location}</p>
                                        </div>
                                        {!session.current && (
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500">
                                                Revoke
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-xs">Login History</Label>
                                <Button variant="outline" className="w-full justify-start">
                                    <History className="h-4 w-4 mr-2" />
                                    View Login History
                                </Button>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    This action cannot be undone
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
