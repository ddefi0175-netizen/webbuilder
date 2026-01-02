'use client';

import { useDraggable } from '@dnd-kit/core';
import { useEditorStore } from '@/stores/editor-store';
import { cn } from '@/lib/utils';
import {
    LayoutTemplate,
    Square,
    Grid3X3,
    Rows,
    Type,
    AlignLeft,
    MousePointer2,
    Link,
    Image,
    Video,
    SeparatorHorizontal,
    Space,
    CreditCard,
    Navigation,
    PanelTop,
    FormInput,
    TextCursorInput,
    ListFilter,
    CheckSquare,
} from 'lucide-react';
import type { ComponentType, ComponentCategory, Component } from '@/types';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface ComponentItem {
    type: ComponentType;
    name: string;
    icon: React.ElementType;
    defaultProps: Record<string, any>;
    defaultStyles: Record<string, string>;
}

const componentCategories: Record<ComponentCategory, ComponentItem[]> = {
    layout: [
        {
            type: 'section',
            name: 'Section',
            icon: LayoutTemplate,
            defaultProps: {},
            defaultStyles: {
                padding: '48px',
                width: '100%',
            },
        },
        {
            type: 'container',
            name: 'Container',
            icon: Square,
            defaultProps: {},
            defaultStyles: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '24px',
            },
        },
        {
            type: 'grid',
            name: 'Grid',
            icon: Grid3X3,
            defaultProps: { columns: 3 },
            defaultStyles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
            },
        },
        {
            type: 'flex',
            name: 'Flex',
            icon: Rows,
            defaultProps: {},
            defaultStyles: {
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
            },
        },
    ],
    typography: [
        {
            type: 'heading',
            name: 'Heading',
            icon: Type,
            defaultProps: { text: 'Heading', level: 'h2' },
            defaultStyles: {
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '16px',
            },
        },
        {
            type: 'paragraph',
            name: 'Paragraph',
            icon: AlignLeft,
            defaultProps: { text: 'This is a paragraph of text. Click to edit.' },
            defaultStyles: {
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '16px',
            },
        },
        {
            type: 'text',
            name: 'Text',
            icon: Type,
            defaultProps: { text: 'Text' },
            defaultStyles: {
                fontSize: '16px',
            },
        },
        {
            type: 'link',
            name: 'Link',
            icon: Link,
            defaultProps: { text: 'Link', href: '#' },
            defaultStyles: {
                color: '#3b82f6',
                textDecoration: 'underline',
            },
        },
        {
            type: 'button',
            name: 'Button',
            icon: MousePointer2,
            defaultProps: { text: 'Button' },
            defaultStyles: {
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
            },
        },
    ],
    media: [
        {
            type: 'image',
            name: 'Image',
            icon: Image,
            defaultProps: {
                src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
                alt: 'Image',
            },
            defaultStyles: {
                width: '100%',
                borderRadius: '8px',
            },
        },
        {
            type: 'video',
            name: 'Video',
            icon: Video,
            defaultProps: {
                src: '',
                poster: '',
            },
            defaultStyles: {
                width: '100%',
                borderRadius: '8px',
            },
        },
        {
            type: 'divider',
            name: 'Divider',
            icon: SeparatorHorizontal,
            defaultProps: {},
            defaultStyles: {
                margin: '24px 0',
            },
        },
        {
            type: 'spacer',
            name: 'Spacer',
            icon: Space,
            defaultProps: { height: '32px' },
            defaultStyles: {},
        },
    ],
    sections: [
        {
            type: 'hero',
            name: 'Hero',
            icon: PanelTop,
            defaultProps: {},
            defaultStyles: {
                minHeight: '500px',
                padding: '64px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
            },
        },
        {
            type: 'card',
            name: 'Card',
            icon: CreditCard,
            defaultProps: {},
            defaultStyles: {
                padding: '24px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
        },
        {
            type: 'navbar',
            name: 'Navbar',
            icon: Navigation,
            defaultProps: {},
            defaultStyles: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 32px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
            },
        },
    ],
    navigation: [],
    forms: [
        {
            type: 'input',
            name: 'Input',
            icon: TextCursorInput,
            defaultProps: { type: 'text', placeholder: 'Enter text...' },
            defaultStyles: {
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
            },
        },
        {
            type: 'textarea',
            name: 'Textarea',
            icon: FormInput,
            defaultProps: { placeholder: 'Enter text...', rows: 4 },
            defaultStyles: {
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
            },
        },
        {
            type: 'select',
            name: 'Select',
            icon: ListFilter,
            defaultProps: { options: ['Option 1', 'Option 2', 'Option 3'] },
            defaultStyles: {
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
            },
        },
        {
            type: 'checkbox',
            name: 'Checkbox',
            icon: CheckSquare,
            defaultProps: { label: 'Checkbox label' },
            defaultStyles: {},
        },
    ],
};

function DraggableComponent({ item }: { item: ComponentItem }) {
    const { addComponent, selection } = useEditorStore();

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `library-${item.type}`,
        data: {
            type: 'library-item',
            componentType: item.type,
        },
    });

    const handleClick = () => {
        const parentId = selection.selectedIds[0] || 'root';

        const newComponent: Omit<Component, 'id'> = {
            type: item.type,
            name: item.name,
            props: item.defaultProps,
            styles: item.defaultStyles,
            children: [],
            parentId: null,
        };

        addComponent(newComponent, parentId);
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent cursor-pointer transition-all',
                isDragging && 'opacity-50'
            )}
        >
            <item.icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-medium">{item.name}</span>
        </div>
    );
}

export function ComponentLibrary() {
    const categoryNames: Record<ComponentCategory, string> = {
        layout: 'Layout',
        typography: 'Typography',
        media: 'Media',
        sections: 'Sections',
        navigation: 'Navigation',
        forms: 'Forms',
    };

    const activeCategories = Object.entries(componentCategories).filter(
        ([_, items]) => items.length > 0
    );

    return (
        <div className="p-3">
            <Accordion type="multiple" defaultValue={['layout', 'typography', 'sections']} className="space-y-2">
                {activeCategories.map(([category, items]) => (
                    <AccordionItem key={category} value={category} className="border rounded-lg">
                        <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                            {categoryNames[category as ComponentCategory]}
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="grid grid-cols-2 gap-2">
                                {items.map((item) => (
                                    <DraggableComponent key={item.type} item={item} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
