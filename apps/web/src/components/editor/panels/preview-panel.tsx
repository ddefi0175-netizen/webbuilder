'use client';

import { useState } from 'react';
import {
    Eye,
    Smartphone,
    Tablet,
    Monitor,
    ExternalLink,
    Maximize2,
    RotateCcw,
    Sun,
    Moon,
    Share2,
    Copy,
    Check,
    QrCode,
    RefreshCw,
    Wifi,
    WifiOff,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type ThemeMode = 'light' | 'dark' | 'system';

interface DevicePreset {
    name: string;
    width: number;
    height: number;
    type: DeviceType;
}

const devicePresets: DevicePreset[] = [
    { name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
    { name: 'iPhone 14 Pro', width: 393, height: 852, type: 'mobile' },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, type: 'mobile' },
    { name: 'Samsung Galaxy S21', width: 360, height: 800, type: 'mobile' },
    { name: 'iPad Mini', width: 768, height: 1024, type: 'tablet' },
    { name: 'iPad Pro 11"', width: 834, height: 1194, type: 'tablet' },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, type: 'tablet' },
    { name: 'MacBook Air', width: 1280, height: 800, type: 'desktop' },
    { name: 'Desktop HD', width: 1920, height: 1080, type: 'desktop' },
    { name: 'Desktop 4K', width: 2560, height: 1440, type: 'desktop' },
];

export function PreviewPanel() {
    const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(devicePresets[0]);
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');
    const [isRotated, setIsRotated] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [previewUrl] = useState('https://preview.webbuilder.io/abc123');

    const handleCopyLink = () => {
        navigator.clipboard.writeText(previewUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const getDeviceIcon = (type: DeviceType) => {
        switch (type) {
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            case 'desktop': return Monitor;
        }
    };

    const groupedDevices = devicePresets.reduce((acc, device) => {
        if (!acc[device.type]) acc[device.type] = [];
        acc[device.type].push(device);
        return acc;
    }, {} as Record<DeviceType, DevicePreset[]>);

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Preview</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Test your website across devices
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Quick Device Toggle */}
                    <div className="flex border rounded-lg p-1">
                        {(['mobile', 'tablet', 'desktop'] as DeviceType[]).map((type) => {
                            const Icon = getDeviceIcon(type);
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedDevice(groupedDevices[type][0])}
                                    className={cn(
                                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors',
                                        selectedDevice.type === type
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="capitalize">{type}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Device Presets */}
                    <div className="space-y-3">
                        <Label className="text-xs">Device Presets</Label>
                        {Object.entries(groupedDevices).map(([type, devices]) => (
                            <div key={type} className="space-y-1">
                                <p className="text-xs text-muted-foreground capitalize">{type}</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {devices.map((device) => (
                                        <button
                                            key={device.name}
                                            onClick={() => setSelectedDevice(device)}
                                            className={cn(
                                                'p-2 border rounded-lg text-left transition-colors',
                                                selectedDevice.name === device.name && 'border-primary bg-primary/5'
                                            )}
                                        >
                                            <p className="text-xs font-medium truncate">{device.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {device.width} × {device.height}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Custom Size */}
                    <div className="space-y-2">
                        <Label className="text-xs">Custom Size</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="number"
                                placeholder="Width"
                                value={customWidth}
                                onChange={(e) => setCustomWidth(e.target.value)}
                                className="text-sm h-8"
                            />
                            <span className="text-muted-foreground">×</span>
                            <Input
                                type="number"
                                placeholder="Height"
                                value={customHeight}
                                onChange={(e) => setCustomHeight(e.target.value)}
                                className="text-sm h-8"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                    if (customWidth && customHeight) {
                                        setSelectedDevice({
                                            name: 'Custom',
                                            width: parseInt(customWidth),
                                            height: parseInt(customHeight),
                                            type: 'desktop'
                                        });
                                    }
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Preview Controls */}
                    <div className="space-y-3 pt-4 border-t">
                        <Label className="text-xs">Preview Controls</Label>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="justify-start"
                                onClick={() => setIsRotated(!isRotated)}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Rotate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="justify-start"
                            >
                                <Maximize2 className="h-4 w-4 mr-2" />
                                Fullscreen
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="justify-start"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="justify-start"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                New Tab
                            </Button>
                        </div>
                    </div>

                    {/* Theme Mode */}
                    <div className="space-y-2">
                        <Label className="text-xs">Theme Mode</Label>
                        <div className="flex border rounded-lg p-1">
                            {([
                                { mode: 'light', icon: Sun, label: 'Light' },
                                { mode: 'dark', icon: Moon, label: 'Dark' },
                                { mode: 'system', icon: Monitor, label: 'System' },
                            ] as const).map(({ mode, icon: Icon, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => setThemeMode(mode)}
                                    className={cn(
                                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors',
                                        themeMode === mode
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Network Simulation */}
                    <div className="space-y-2">
                        <Label className="text-xs">Network Simulation</Label>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {isOffline ? (
                                    <WifiOff className="h-4 w-4 text-red-500" />
                                ) : (
                                    <Wifi className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm">{isOffline ? 'Offline Mode' : 'Online'}</span>
                            </div>
                            <button
                                onClick={() => setIsOffline(!isOffline)}
                                className={cn(
                                    'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                                    isOffline ? 'bg-red-500' : 'bg-green-500'
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                                        isOffline ? 'translate-x-1' : 'translate-x-4'
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Share Preview */}
                    <div className="space-y-3 pt-4 border-t">
                        <Label className="text-xs">Share Preview</Label>

                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    value={previewUrl}
                                    readOnly
                                    className="text-xs h-8"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={handleCopyLink}
                                >
                                    {linkCopied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Anyone with this link can view the preview
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="justify-start">
                                <QrCode className="h-4 w-4 mr-2" />
                                QR Code
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Current Preview Info */}
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Device</span>
                            <span className="text-xs font-medium">{selectedDevice.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Size</span>
                            <span className="text-xs font-medium">
                                {isRotated
                                    ? `${selectedDevice.height} × ${selectedDevice.width}`
                                    : `${selectedDevice.width} × ${selectedDevice.height}`
                                }
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Theme</span>
                            <span className="text-xs font-medium capitalize">{themeMode}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Network</span>
                            <span className="text-xs font-medium">{isOffline ? 'Offline' : 'Online'}</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <Button className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Open Live Preview
                    </Button>
                </div>
            </ScrollArea>
        </div>
    );
}
