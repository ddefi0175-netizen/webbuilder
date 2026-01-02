'use client';

import { useEditorStore } from '@/stores/editor-store';
import {
    Undo2,
    Redo2,
    Monitor,
    Tablet,
    Smartphone,
    ZoomIn,
    ZoomOut,
    Grid3X3,
    PanelLeft,
    PanelRight,
    Sparkles,
    Download,
    Save,
    Play,
    Settings,
    Moon,
    Sun,
    Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { Breakpoint } from '@/types';

export function EditorHeader() {
    const {
        canvas,
        setZoom,
        setBreakpoint,
        toggleGrid,
        toggleLeftPanel,
        toggleRightPanel,
        toggleAIPanel,
        toggleToolsSidebar,
        leftPanelOpen,
        rightPanelOpen,
        aiPanelOpen,
        toolsSidebarOpen,
        undo,
        redo,
        historyIndex,
        history,
    } = useEditorStore();

    const { theme, setTheme } = useTheme();

    const breakpoints: { value: Breakpoint; icon: typeof Monitor; label: string }[] = [
        { value: 'desktop', icon: Monitor, label: 'Desktop' },
        { value: 'tablet', icon: Tablet, label: 'Tablet' },
        { value: 'mobile', icon: Smartphone, label: 'Mobile' },
    ];

    const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <TooltipProvider delayDuration={300}>
            <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
                {/* Left Section - Logo & File Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg">WebBuilder</span>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={undo}
                                    disabled={historyIndex <= 0}
                                >
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={redo}
                                    disabled={historyIndex >= history.length - 1}
                                >
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Center Section - Breakpoints & Zoom */}
                <div className="flex items-center gap-4">
                    {/* Breakpoint Selector */}
                    <div className="flex items-center bg-muted rounded-lg p-1">
                        {breakpoints.map(({ value, icon: Icon, label }) => (
                            <Tooltip key={value}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={canvas.breakpoint === value ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => setBreakpoint(value)}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{label}</TooltipContent>
                            </Tooltip>
                        ))}
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setZoom(canvas.zoom - 0.25)}
                                    disabled={canvas.zoom <= 0.25}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Zoom Out</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="min-w-[60px]">
                                    {Math.round(canvas.zoom * 100)}%
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {zoomLevels.map((level) => (
                                    <DropdownMenuItem
                                        key={level}
                                        onClick={() => setZoom(level)}
                                        className={cn(canvas.zoom === level && 'bg-accent')}
                                    >
                                        {Math.round(level * 100)}%
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setZoom(canvas.zoom + 0.25)}
                                    disabled={canvas.zoom >= 2}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Zoom In</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={canvas.showGrid ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={toggleGrid}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Toggle Grid</TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Right Section - Actions & Panels */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={toolsSidebarOpen ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={toggleToolsSidebar}
                                className="gap-2"
                            >
                                <Wrench className="h-4 w-4" />
                                <span className="hidden sm:inline">Tools</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Tools &amp; Features</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={aiPanelOpen ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={toggleAIPanel}
                                className="gap-2"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span className="hidden sm:inline">AI</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>AI Assistant (Ctrl+K)</TooltipContent>
                    </Tooltip>

                    <div className="h-6 w-px bg-border" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Preview</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Save className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save (Ctrl+S)</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export HTML</DropdownMenuItem>
                            <DropdownMenuItem>Export React</DropdownMenuItem>
                            <DropdownMenuItem>Export Vue</DropdownMenuItem>
                            <DropdownMenuItem>Download ZIP</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-border" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={leftPanelOpen ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={toggleLeftPanel}
                            >
                                <PanelLeft className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Left Panel</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={rightPanelOpen ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={toggleRightPanel}
                            >
                                <PanelRight className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Right Panel</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Theme</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                </div>
            </header>
        </TooltipProvider>
    );
}
