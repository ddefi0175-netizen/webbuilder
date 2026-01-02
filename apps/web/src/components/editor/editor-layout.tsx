'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { EditorHeader } from './editor-header';
import { LeftPanel } from './panels/left-panel';
import { RightPanel } from './panels/right-panel';
import { Canvas } from './canvas/canvas';
import { AIPanel } from './ai/ai-panel';
import { ToolsSidebar } from './tools-sidebar';
import { cn } from '@/lib/utils';

export function EditorLayout() {
    const { leftPanelOpen, rightPanelOpen, aiPanelOpen, toolsSidebarOpen, toggleToolsSidebar } = useEditorStore();

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <EditorHeader />

            {/* Main Editor Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Components & Layers */}
                <div
                    className={cn(
                        'border-r border-border bg-card transition-all duration-300',
                        leftPanelOpen ? 'w-64' : 'w-0'
                    )}
                >
                    {leftPanelOpen && <LeftPanel />}
                </div>

                {/* Tools Sidebar */}
                <ToolsSidebar isOpen={toolsSidebarOpen} onToggle={toggleToolsSidebar} />

                {/* Canvas */}
                <div className="flex-1 relative overflow-hidden">
                    <Canvas />
                </div>

                {/* Right Panel - Properties */}
                <div
                    className={cn(
                        'border-l border-border bg-card transition-all duration-300',
                        rightPanelOpen ? 'w-72' : 'w-0'
                    )}
                >
                    {rightPanelOpen && <RightPanel />}
                </div>

                {/* AI Panel - Slide over */}
                <div
                    className={cn(
                        'absolute right-0 top-0 bottom-0 border-l border-border bg-card shadow-xl transition-all duration-300 z-50',
                        aiPanelOpen ? 'w-96' : 'w-0'
                    )}
                >
                    {aiPanelOpen && <AIPanel />}
                </div>
            </div>
        </div>
    );
}
