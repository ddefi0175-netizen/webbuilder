'use client';

import { useState } from 'react';
import {
    Cloud,
    FolderOpen,
    FileText,
    Image,
    Video,
    Music,
    Upload,
    Download,
    Trash2,
    Search,
    MoreHorizontal,
    HardDrive,
    Clock,
    Star,
    Grid,
    List,
    Plus,
    RefreshCw,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface StorageFile {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'video' | 'audio' | 'document' | 'other';
    size?: string;
    modified: string;
    starred?: boolean;
}

const fileIcons: Record<StorageFile['type'], typeof FileText> = {
    folder: FolderOpen,
    image: Image,
    video: Video,
    audio: Music,
    document: FileText,
    other: FileText
};

const fileColors: Record<StorageFile['type'], string> = {
    folder: 'text-blue-500',
    image: 'text-green-500',
    video: 'text-purple-500',
    audio: 'text-pink-500',
    document: 'text-orange-500',
    other: 'text-gray-500'
};

export function CloudStoragePanel() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPath, setCurrentPath] = useState<string[]>(['My Projects']);

    const [files] = useState<StorageFile[]>([
        { id: '1', name: 'Landing Page v1', type: 'folder', modified: '2 hours ago' },
        { id: '2', name: 'E-commerce Site', type: 'folder', modified: '1 day ago', starred: true },
        { id: '3', name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', modified: '3 hours ago' },
        { id: '4', name: 'logo.png', type: 'image', size: '156 KB', modified: '5 hours ago', starred: true },
        { id: '5', name: 'intro-video.mp4', type: 'video', size: '45 MB', modified: '2 days ago' },
        { id: '6', name: 'background-music.mp3', type: 'audio', size: '3.2 MB', modified: '1 week ago' },
        { id: '7', name: 'content-draft.docx', type: 'document', size: '89 KB', modified: '3 days ago' },
    ]);

    const storageUsed = 2.4; // GB
    const storageTotal = 10; // GB
    const storagePercentage = (storageUsed / storageTotal) * 100;

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Cloud Storage</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Manage your project files and assets
                </p>
            </div>

            {/* Storage Usage */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span>{storageUsed} GB of {storageTotal} GB used</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7">
                        Upgrade
                    </Button>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            storagePercentage > 90 ? 'bg-red-500' :
                                storagePercentage > 70 ? 'bg-yellow-500' : 'bg-primary'
                        )}
                        style={{ width: `${storagePercentage}%` }}
                    />
                </div>
            </div>

            {/* Search and View Toggle */}
            <div className="p-3 border-b flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search files..."
                        className="pl-8 h-8 text-sm"
                    />
                </div>
                <div className="flex border rounded-md">
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 py-2 flex items-center gap-1 text-sm">
                {currentPath.map((path, index) => (
                    <div key={path} className="flex items-center">
                        {index > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                        <button
                            className={cn(
                                'hover:text-primary',
                                index === currentPath.length - 1 ? 'font-medium' : 'text-muted-foreground'
                            )}
                        >
                            {path}
                        </button>
                    </div>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-4">
                        <Button size="sm" className="h-8">
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            Upload
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            New Folder
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 ml-auto">
                            <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    {/* Starred Files */}
                    {files.some(f => f.starred) && (
                        <div className="mb-4">
                            <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Starred
                            </Label>
                            <div className="space-y-1">
                                {filteredFiles.filter(f => f.starred).map((file) => {
                                    const FileIcon = fileIcons[file.type];
                                    return (
                                        <div
                                            key={file.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                                        >
                                            <FileIcon className={cn('h-5 w-5', fileColors[file.type])} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                            </div>
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* All Files */}
                    <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">All Files</Label>
                        {viewMode === 'list' ? (
                            <div className="space-y-1">
                                {filteredFiles.filter(f => !f.starred).map((file) => {
                                    const FileIcon = fileIcons[file.type];
                                    return (
                                        <div
                                            key={file.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer group"
                                        >
                                            <FileIcon className={cn('h-5 w-5', fileColors[file.type])} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {file.size && `${file.size} • `}{file.modified}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                    <Share2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {filteredFiles.filter(f => !f.starred).map((file) => {
                                    const FileIcon = fileIcons[file.type];
                                    return (
                                        <div
                                            key={file.id}
                                            className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                                        >
                                            <FileIcon className={cn('h-8 w-8', fileColors[file.type])} />
                                            <p className="text-xs font-medium text-center truncate w-full">{file.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="pt-4 border-t">
                        <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Recent Activity
                        </Label>
                        <div className="space-y-2">
                            {[
                                { action: 'Uploaded', file: 'hero-banner.jpg', time: '3 hours ago' },
                                { action: 'Modified', file: 'Landing Page v1', time: '5 hours ago' },
                                { action: 'Shared', file: 'E-commerce Site', time: '1 day ago' },
                            ].map((activity, index) => (
                                <div key={index} className="text-xs text-muted-foreground">
                                    <span className="text-foreground">{activity.action}</span> {activity.file} • {activity.time}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Backup Status */}
                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Cloud className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-green-700">Auto-backup enabled</p>
                                    <p className="text-xs text-green-600">Last backup: 10 minutes ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-green-700">
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
