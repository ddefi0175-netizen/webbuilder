'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { ComponentRenderer } from './component-renderer';
import { cn } from '@/lib/utils';

export function Canvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const {
        components,
        rootId,
        canvas,
        selection,
        selectComponent,
        hoverComponent,
        moveComponent,
        getComponent,
    } = useEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Get canvas dimensions based on breakpoint
    const getCanvasWidth = () => {
        switch (canvas.breakpoint) {
            case 'mobile':
                return 375;
            case 'tablet':
                return 768;
            case 'desktop':
            default:
                return 1280;
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeComponent = getComponent(active.id as string);
            const overComponent = getComponent(over.id as string);

            if (activeComponent && overComponent) {
                // Move component to new parent
                const newParentId = overComponent.children.length > 0 || overComponent.type === 'section' || overComponent.type === 'container'
                    ? over.id as string
                    : overComponent.parentId || rootId;

                moveComponent(active.id as string, newParentId, 0);
            }
        }

        setActiveId(null);
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Only clear selection if clicking on the canvas background
        if (e.target === e.currentTarget) {
            selectComponent(null);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                selectComponent(null);
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedIds = selection.selectedIds;
                if (selectedIds.length > 0) {
                    // Delete logic handled in store
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection.selectedIds, selectComponent]);

    const rootComponent = components.get(rootId);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div
                ref={canvasRef}
                className={cn(
                    'w-full h-full overflow-auto p-8',
                    canvas.showGrid && 'editor-canvas'
                )}
                onClick={handleCanvasClick}
            >
                <div
                    className="mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                        width: getCanvasWidth(),
                        transform: `scale(${canvas.zoom})`,
                        transformOrigin: 'top center',
                    }}
                >
                    {rootComponent && (
                        <ComponentRenderer
                            component={rootComponent}
                            isRoot
                        />
                    )}
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    <div className="drag-overlay bg-card p-4 rounded-lg">
                        {getComponent(activeId)?.name}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
