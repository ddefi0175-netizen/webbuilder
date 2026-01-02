'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';
import type { Component, ComponentStyles } from '@/types';

interface ComponentRendererProps {
    component: Component;
    isRoot?: boolean;
}

export function ComponentRenderer({ component, isRoot = false }: ComponentRendererProps) {
    const {
        components,
        selection,
        selectComponent,
        hoverComponent,
        getChildren,
    } = useEditorStore();

    const isSelected = selection.selectedIds.includes(component.id);
    const isHovered = selection.hoveredId === component.id;

    const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
        id: component.id,
        disabled: isRoot,
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: component.id,
    });

    const children = getChildren(component.id);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id, e.shiftKey);
    };

    const handleMouseEnter = () => {
        if (!isDragging) {
            hoverComponent(component.id);
        }
    };

    const handleMouseLeave = () => {
        hoverComponent(null);
    };

    // Convert component styles to CSS
    const getStyleObject = (styles: ComponentStyles): React.CSSProperties => {
        const cssProperties: React.CSSProperties = {};

        Object.entries(styles).forEach(([key, value]) => {
            if (value) {
                // Convert camelCase to proper CSS property names
                (cssProperties as any)[key] = value;
            }
        });

        return cssProperties;
    };

    // Render based on component type
    const renderContent = () => {
        switch (component.type) {
            case 'heading':
                const HeadingTag = (component.props.level || 'h2') as keyof JSX.IntrinsicElements;
                return (
                    <HeadingTag style={getStyleObject(component.styles)}>
                        {component.props.text || 'Heading'}
                    </HeadingTag>
                );

            case 'paragraph':
                return (
                    <p style={getStyleObject(component.styles)}>
                        {component.props.text || 'Paragraph text goes here...'}
                    </p>
                );

            case 'text':
                return (
                    <span style={getStyleObject(component.styles)}>
                        {component.props.text || 'Text'}
                    </span>
                );

            case 'button':
                return (
                    <button
                        style={getStyleObject(component.styles)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                    >
                        {component.props.text || 'Button'}
                    </button>
                );

            case 'link':
                return (
                    <a
                        href={component.props.href || '#'}
                        style={getStyleObject(component.styles)}
                        className="text-primary underline"
                    >
                        {component.props.text || 'Link'}
                    </a>
                );

            case 'image':
                return (
                    <img
                        src={component.props.src || 'https://via.placeholder.com/400x300'}
                        alt={component.props.alt || 'Image'}
                        style={getStyleObject(component.styles)}
                        className="max-w-full h-auto"
                    />
                );

            case 'divider':
                return (
                    <hr
                        style={{
                            ...getStyleObject(component.styles),
                            border: 'none',
                            borderTop: '1px solid currentColor',
                            opacity: 0.2,
                        }}
                    />
                );

            case 'spacer':
                return (
                    <div
                        style={{
                            ...getStyleObject(component.styles),
                            height: component.props.height || '32px',
                        }}
                    />
                );

            case 'section':
            case 'container':
            case 'flex':
            case 'grid':
                return (
                    <div style={getStyleObject(component.styles)}>
                        {children.length > 0 ? (
                            children.map((child) => (
                                <ComponentRenderer key={child.id} component={child} />
                            ))
                        ) : (
                            <div className="min-h-[100px] flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
                                Drop components here
                            </div>
                        )}
                    </div>
                );

            case 'card':
                return (
                    <div
                        style={getStyleObject(component.styles)}
                        className="bg-card rounded-lg shadow-md overflow-hidden"
                    >
                        {children.length > 0 ? (
                            children.map((child) => (
                                <ComponentRenderer key={child.id} component={child} />
                            ))
                        ) : (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-2">Card Title</h3>
                                <p className="text-muted-foreground">Card content goes here...</p>
                            </div>
                        )}
                    </div>
                );

            case 'hero':
                return (
                    <div
                        style={{
                            ...getStyleObject(component.styles),
                            minHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '48px',
                        }}
                    >
                        {children.length > 0 ? (
                            children.map((child) => (
                                <ComponentRenderer key={child.id} component={child} />
                            ))
                        ) : (
                            <>
                                <h1 className="text-4xl font-bold mb-4">Hero Title</h1>
                                <p className="text-xl text-muted-foreground mb-8">Subtitle text goes here</p>
                                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                );

            case 'input':
                return (
                    <input
                        type={component.props.type || 'text'}
                        placeholder={component.props.placeholder || 'Enter text...'}
                        style={getStyleObject(component.styles)}
                        className="w-full px-3 py-2 border border-input rounded-md"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        placeholder={component.props.placeholder || 'Enter text...'}
                        rows={component.props.rows || 4}
                        style={getStyleObject(component.styles)}
                        className="w-full px-3 py-2 border border-input rounded-md"
                    />
                );

            default:
                return (
                    <div style={getStyleObject(component.styles)}>
                        {children.map((child) => (
                            <ComponentRenderer key={child.id} component={child} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div
            ref={(node) => {
                setDragRef(node);
                setDropRef(node);
            }}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'relative transition-all',
                !isRoot && 'cursor-pointer',
                isDragging && 'dragging',
                isSelected && 'component-outline',
                isHovered && !isSelected && 'component-hover',
                isOver && 'drop-zone-active'
            )}
        >
            {renderContent()}

            {/* Component Label */}
            {(isSelected || isHovered) && !isRoot && (
                <div className="absolute -top-6 left-0 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-t-md">
                    {component.name}
                </div>
            )}
        </div>
    );
}
