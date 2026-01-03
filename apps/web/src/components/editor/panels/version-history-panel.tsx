'use client';

import { useState } from 'react';
import {
    History,
    RotateCcw,
    Clock,
    Eye,
    Download,
    Trash2,
    GitCompare,
    Save,
    RefreshCw,
    Cloud,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Version {
    id: string;
    name: string;
    timestamp: string;
    author: string;
    type: 'auto' | 'manual' | 'published';
    changes: number;
    isCurrent?: boolean;
}

export function VersionHistoryPanel() {
    const [activeTab, setActiveTab] = useState<'versions' | 'backups'>('versions');
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [compareVersions, setCompareVersions] = useState<string[]>([]);

    const versions: Version[] = [
        { id: '1', name: 'Current Version', timestamp: 'Just now', author: 'You', type: 'auto', changes: 0, isCurrent: true },
        { id: '2', name: 'Auto-save', timestamp: '5 minutes ago', author: 'System', type: 'auto', changes: 3 },
        { id: '3', name: 'Updated hero section', timestamp: '1 hour ago', author: 'You', type: 'manual', changes: 12 },
        { id: '4', name: 'Auto-save', timestamp: '2 hours ago', author: 'System', type: 'auto', changes: 5 },
        { id: '5', name: 'Published v2.1', timestamp: 'Yesterday', author: 'John', type: 'published', changes: 45 },
        { id: '6', name: 'Added contact form', timestamp: '2 days ago', author: 'Sarah', type: 'manual', changes: 8 },
        { id: '7', name: 'Published v2.0', timestamp: '1 week ago', author: 'You', type: 'published', changes: 156 },
    ];

    const handleVersionSelect = (versionId: string) => {
        if (compareMode) {
            if (compareVersions.includes(versionId)) {
                setCompareVersions(compareVersions.filter(v => v !== versionId));
            } else if (compareVersions.length < 2) {
                setCompareVersions([...compareVersions, versionId]);
            }
        } else {
            setSelectedVersion(versionId);
        }
    };

    const tabs = [
        { id: 'versions', label: 'Versions', icon: History },
        { id: 'backups', label: 'Backups', icon: Cloud },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <History className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Version History</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Browse and restore previous versions
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
                    {activeTab === 'versions' && (
                        <>
                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant={compareMode ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setCompareMode(!compareMode);
                                        setCompareVersions([]);
                                    }}
                                >
                                    <GitCompare className="h-4 w-4 mr-1" />
                                    Compare
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Save className="h-4 w-4 mr-1" />
                                    Save Version
                                </Button>
                            </div>

                            {compareMode && (
                                <div className="p-2 bg-primary/10 rounded-lg text-xs text-center">
                                    Select 2 versions to compare ({compareVersions.length}/2 selected)
                                </div>
                            )}

                            {/* Version List */}
                            <div className="space-y-2">
                                {versions.map((version) => (
                                    <button
                                        key={version.id}
                                        onClick={() => handleVersionSelect(version.id)}
                                        className={cn(
                                            'w-full p-3 border rounded-lg text-left transition-colors',
                                            selectedVersion === version.id && !compareMode && 'border-primary bg-primary/5',
                                            compareMode && compareVersions.includes(version.id) && 'border-primary bg-primary/5',
                                            version.isCurrent && 'border-green-500/50'
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {version.type === 'published' && (
                                                    <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-xs rounded">
                                                        Published
                                                    </span>
                                                )}
                                                {version.type === 'auto' && (
                                                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded">
                                                        Auto
                                                    </span>
                                                )}
                                                <span className="font-medium text-sm">{version.name}</span>
                                            </div>
                                            {version.isCurrent && (
                                                <span className="text-xs text-green-600">Current</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {version.timestamp}
                                            </span>
                                            <span>{version.author}</span>
                                            {version.changes > 0 && (
                                                <span>{version.changes} changes</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Selected Version Actions */}
                            {selectedVersion && !compareMode && (
                                <div className="pt-4 border-t space-y-2">
                                    <Label className="text-xs">Selected Version</Label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Eye className="h-4 w-4 mr-1" />
                                            Preview
                                        </Button>
                                        <Button size="sm" className="flex-1">
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            Restore
                                        </Button>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download as ZIP
                                    </Button>
                                </div>
                            )}

                            {compareMode && compareVersions.length === 2 && (
                                <Button className="w-full">
                                    <GitCompare className="h-4 w-4 mr-2" />
                                    Compare Selected Versions
                                </Button>
                            )}
                        </>
                    )}

                    {activeTab === 'backups' && (
                        <>
                            {/* Backup Status */}
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Cloud className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Auto-backup enabled</span>
                                </div>
                                <p className="text-xs text-green-600">
                                    Your project is automatically backed up every 30 minutes
                                </p>
                            </div>

                            {/* Backup Settings */}
                            <div className="space-y-3">
                                <Label className="text-xs">Backup Settings</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Backup Frequency</Label>
                                    <select className="w-full h-9 px-3 border rounded-md text-sm">
                                        <option>Every 15 minutes</option>
                                        <option>Every 30 minutes</option>
                                        <option>Every hour</option>
                                        <option>Every 6 hours</option>
                                        <option>Daily</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Retention Period</Label>
                                    <select className="w-full h-9 px-3 border rounded-md text-sm">
                                        <option>7 days</option>
                                        <option>14 days</option>
                                        <option>30 days</option>
                                        <option>90 days</option>
                                        <option>Forever</option>
                                    </select>
                                </div>
                            </div>

                            {/* Backup List */}
                            <div className="space-y-2">
                                <Label className="text-xs">Recent Backups</Label>
                                {[
                                    { date: 'Today', time: '2:30 PM', size: '2.4 MB' },
                                    { date: 'Today', time: '2:00 PM', size: '2.4 MB' },
                                    { date: 'Today', time: '1:30 PM', size: '2.3 MB' },
                                    { date: 'Yesterday', time: '11:30 PM', size: '2.3 MB' },
                                    { date: 'Yesterday', time: '6:00 PM', size: '2.2 MB' },
                                ].map((backup, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{backup.date}, {backup.time}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground ml-6">{backup.size}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <Download className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <RotateCcw className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Manual Backup */}
                            <div className="pt-4 border-t space-y-2">
                                <Button variant="outline" className="w-full">
                                    <Cloud className="h-4 w-4 mr-2" />
                                    Create Backup Now
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sync with Cloud
                                </Button>
                            </div>

                            {/* Storage Info */}
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Backup Storage</span>
                                    <span className="text-xs text-muted-foreground">24.5 MB / 1 GB</span>
                                </div>
                                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                                    <div className="h-full w-[2.5%] bg-primary rounded-full" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
