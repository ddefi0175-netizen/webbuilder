'use client';

import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';
import {
    ChevronRight,
    ChevronDown,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Trash2,
    Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Component } from '@/types';
import { useState } from 'react';

interface LayerItemProps {
    component: Component;
    depth: number;
}

function LayerItem({ component, depth }: LayerItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const {
        selection,
        selectComponent,
        hoverComponent,
        getChildren,
        updateComponent,
        deleteComponent,
        duplicateComponent,
    } = useEditorStore();

    const children = getChildren(component.id);
    const isSelected = selection.selectedIds.includes(component.id);
    const isHovered = selection.hoveredId === component.id;
    const hasChildren = children.length > 0;
    const isRoot = component.id === 'root';

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id, e.shiftKey);
    };

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateComponent(component.id, { isHidden: !component.isHidden });
    };

    const handleToggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateComponent(component.id, { isLocked: !component.isLocked });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteComponent(component.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateComponent(component.id);
    };

    return (
        <div>
            <div
                className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer group transition-colors',
                    isSelected && 'bg-primary/20 text-primary',
                    isHovered && !isSelected && 'bg-muted',
                    component.isHidden && 'opacity-50'
                )}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={handleClick}
                onMouseEnter={() => hoverComponent(component.id)}
                onMouseLeave={() => hoverComponent(null)}
            >
                {/* Expand/Collapse */}
                <button
                    onClick={handleToggleExpand}
                    className={cn(
                        'h-4 w-4 flex items-center justify-center',
                        !hasChildren && 'invisible'
                    )}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )}
                </button>

                {/* Component Name */}
                <span className="flex-1 text-sm truncate">{component.name}</span>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isRoot && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleToggleVisibility}
                            >
                                {component.isHidden ? (
                                    <EyeOff className="h-3 w-3" />
                                ) : (
                                    <Eye className="h-3 w-3" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleToggleLock}
                            >
                                {component.isLocked ? (
                                    <Lock className="h-3 w-3" />
                                ) : (
                                    <Unlock className="h-3 w-3" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleDuplicate}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {children.map((child) => (
                        <LayerItem
                            key={child.id}
                            component={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function LayersPanel() {
    const { components, rootId } = useEditorStore();
    const rootComponent = components.get(rootId);

    if (!rootComponent) return null;

    return (
        <div className="p-2">
            <LayerItem component={rootComponent} depth={0} />
        </div>
    );
}
