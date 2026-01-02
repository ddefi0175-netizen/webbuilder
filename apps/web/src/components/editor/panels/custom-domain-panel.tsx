'use client';

import { useState } from 'react';
import {
    Globe,
    Check,
    Copy,
    Loader2,
    Link,
    ExternalLink,
    AlertCircle,
    Settings,
    Shield,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DomainStatus {
    domain: string;
    status: 'pending' | 'verifying' | 'active' | 'error';
    ssl: boolean;
    lastChecked: Date;
    errorMessage?: string;
}

export function CustomDomainPanel() {
    const [customDomain, setCustomDomain] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [connectedDomains, setConnectedDomains] = useState<DomainStatus[]>([
        {
            domain: 'mysite.webbuilder.app',
            status: 'active',
            ssl: true,
            lastChecked: new Date()
        }
    ]);
    const [copied, setCopied] = useState<string | null>(null);

    const dnsRecords = [
        { type: 'A', name: '@', value: '76.76.21.21', ttl: '3600' },
        { type: 'CNAME', name: 'www', value: 'cname.webbuilder.app', ttl: '3600' },
    ];

    const handleCopy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleAddDomain = async () => {
        if (!customDomain.trim()) return;

        setIsAdding(true);

        // Simulate adding domain
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newDomain: DomainStatus = {
            domain: customDomain,
            status: 'pending',
            ssl: false,
            lastChecked: new Date()
        };

        setConnectedDomains(prev => [...prev, newDomain]);
        setCustomDomain('');
        setIsAdding(false);
    };

    const handleVerifyDomain = async (domain: string) => {
        setIsVerifying(true);

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 2000));

        setConnectedDomains(prev => prev.map(d =>
            d.domain === domain
                ? { ...d, status: 'active' as const, ssl: true, lastChecked: new Date() }
                : d
        ));

        setIsVerifying(false);
    };

    const handleRemoveDomain = (domain: string) => {
        setConnectedDomains(prev => prev.filter(d => d.domain !== domain));
    };

    const getStatusBadge = (status: DomainStatus['status']) => {
        switch (status) {
            case 'active':
                return (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                        <Check className="h-3 w-3" />
                        Active
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-xs text-yellow-500">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                    </span>
                );
            case 'verifying':
                return (
                    <span className="flex items-center gap-1 text-xs text-blue-500">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Verifying
                    </span>
                );
            case 'error':
                return (
                    <span className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        Error
                    </span>
                );
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Custom Domain</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Connect your own domain to your website
                </p>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Add New Domain */}
                <div className="space-y-3">
                    <Label className="text-xs">Add Custom Domain</Label>
                    <div className="flex gap-2">
                        <Input
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            placeholder="www.yourdomain.com"
                            className="text-sm"
                        />
                        <Button
                            onClick={handleAddDomain}
                            disabled={!customDomain.trim() || isAdding}
                        >
                            {isAdding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Add'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Connected Domains */}
                <div className="space-y-3">
                    <Label className="text-xs">Connected Domains</Label>
                    <div className="space-y-2">
                        {connectedDomains.map((domain) => (
                            <div
                                key={domain.domain}
                                className="p-3 border rounded-lg space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{domain.domain}</span>
                                    </div>
                                    {getStatusBadge(domain.status)}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Shield className={cn('h-3 w-3', domain.ssl ? 'text-green-500' : 'text-muted-foreground')} />
                                        {domain.ssl ? 'SSL Active' : 'SSL Pending'}
                                    </span>
                                </div>

                                {domain.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleVerifyDomain(domain.domain)}
                                            disabled={isVerifying}
                                        >
                                            {isVerifying ? (
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-3 w-3 mr-1" />
                                            )}
                                            Verify
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() => handleRemoveDomain(domain.domain)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}

                                {domain.status === 'active' && (
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                Visit
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            <Settings className="h-3 w-3 mr-1" />
                                            Settings
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* DNS Configuration */}
                <div className="space-y-3">
                    <Label className="text-xs">DNS Configuration</Label>
                    <p className="text-xs text-muted-foreground">
                        Add these DNS records to your domain registrar:
                    </p>

                    <div className="space-y-2">
                        {dnsRecords.map((record, index) => (
                            <div
                                key={index}
                                className="p-3 bg-muted rounded-lg space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded">
                                        {record.type}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6"
                                        onClick={() => handleCopy(record.value, `${record.type}-${index}`)}
                                    >
                                        {copied === `${record.type}-${index}` ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Name:</span>
                                        <div className="font-mono">{record.name}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">Value:</span>
                                        <div className="font-mono truncate">{record.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SSL Info */}
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Free SSL Certificate</span>
                    </div>
                    <p className="text-xs text-green-600">
                        We automatically provision and renew SSL certificates for all custom domains.
                    </p>
                </div>
            </div>
        </div>
    );
}
