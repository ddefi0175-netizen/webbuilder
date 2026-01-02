import { ComponentType } from '@/types';

export interface ComponentDefinition {
    type: ComponentType;
    label: string;
    icon: string;
    category: 'layout' | 'basic' | 'form' | 'media' | 'navigation';
    defaultProps: Record<string, unknown>;
    defaultStyles: Record<string, string>;
    canHaveChildren: boolean;
    description: string;
}

export const componentDefinitions: ComponentDefinition[] = [
    // Layout Components
    {
        type: 'container',
        label: 'Container',
        icon: 'Square',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            minHeight: '100px',
        },
        canHaveChildren: true,
        description: 'A flexible container for grouping elements',
    },
    {
        type: 'section',
        label: 'Section',
        icon: 'LayoutTemplate',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            width: '100%',
        },
        canHaveChildren: true,
        description: 'A semantic section element',
    },
    {
        type: 'header',
        label: 'Header',
        icon: 'PanelTop',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            width: '100%',
        },
        canHaveChildren: true,
        description: 'A semantic header element',
    },
    {
        type: 'footer',
        label: 'Footer',
        icon: 'PanelBottom',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            width: '100%',
        },
        canHaveChildren: true,
        description: 'A semantic footer element',
    },
    {
        type: 'card',
        label: 'Card',
        icon: 'RectangleHorizontal',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        canHaveChildren: true,
        description: 'A card container with shadow',
    },
    {
        type: 'divider',
        label: 'Divider',
        icon: 'Minus',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            width: '100%',
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '16px 0',
        },
        canHaveChildren: false,
        description: 'A horizontal divider line',
    },
    {
        type: 'spacer',
        label: 'Spacer',
        icon: 'ArrowUpDown',
        category: 'layout',
        defaultProps: {},
        defaultStyles: {
            height: '32px',
        },
        canHaveChildren: false,
        description: 'Empty space between elements',
    },

    // Basic Components
    {
        type: 'heading',
        label: 'Heading',
        icon: 'Heading',
        category: 'basic',
        defaultProps: {
            content: 'Heading',
            level: 'h2',
        },
        defaultStyles: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
        },
        canHaveChildren: false,
        description: 'A heading element (h1-h6)',
    },
    {
        type: 'text',
        label: 'Text',
        icon: 'Type',
        category: 'basic',
        defaultProps: {
            content: 'Enter your text here...',
        },
        defaultStyles: {
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.5',
        },
        canHaveChildren: false,
        description: 'A paragraph of text',
    },
    {
        type: 'button',
        label: 'Button',
        icon: 'MousePointerClick',
        category: 'basic',
        defaultProps: {
            text: 'Click me',
        },
        defaultStyles: {
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
        },
        canHaveChildren: false,
        description: 'A clickable button',
    },
    {
        type: 'link',
        label: 'Link',
        icon: 'Link',
        category: 'basic',
        defaultProps: {
            text: 'Click here',
            href: '#',
        },
        defaultStyles: {
            color: '#3b82f6',
            textDecoration: 'underline',
            cursor: 'pointer',
        },
        canHaveChildren: false,
        description: 'A hyperlink',
    },
    {
        type: 'icon',
        label: 'Icon',
        icon: 'Smile',
        category: 'basic',
        defaultProps: {
            name: 'star',
        },
        defaultStyles: {
            width: '24px',
            height: '24px',
            color: '#374151',
        },
        canHaveChildren: false,
        description: 'An icon element',
    },
    {
        type: 'list',
        label: 'List',
        icon: 'List',
        category: 'basic',
        defaultProps: {
            ordered: false,
        },
        defaultStyles: {
            padding: '0 0 0 20px',
        },
        canHaveChildren: true,
        description: 'An ordered or unordered list',
    },
    {
        type: 'list-item',
        label: 'List Item',
        icon: 'ListOrdered',
        category: 'basic',
        defaultProps: {
            content: 'List item',
        },
        defaultStyles: {},
        canHaveChildren: false,
        description: 'A list item',
    },

    // Form Components
    {
        type: 'form',
        label: 'Form',
        icon: 'FormInput',
        category: 'form',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        canHaveChildren: true,
        description: 'A form container',
    },
    {
        type: 'input',
        label: 'Input',
        icon: 'TextCursor',
        category: 'form',
        defaultProps: {
            type: 'text',
            placeholder: 'Enter text...',
        },
        defaultStyles: {
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
        },
        canHaveChildren: false,
        description: 'A text input field',
    },
    {
        type: 'textarea',
        label: 'Textarea',
        icon: 'AlignLeft',
        category: 'form',
        defaultProps: {
            placeholder: 'Enter text...',
            rows: 4,
        },
        defaultStyles: {
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
        },
        canHaveChildren: false,
        description: 'A multi-line text input',
    },

    // Media Components
    {
        type: 'image',
        label: 'Image',
        icon: 'Image',
        category: 'media',
        defaultProps: {
            src: 'https://via.placeholder.com/400x300',
            alt: 'Image description',
        },
        defaultStyles: {
            maxWidth: '100%',
            height: 'auto',
        },
        canHaveChildren: false,
        description: 'An image element',
    },
    {
        type: 'video',
        label: 'Video',
        icon: 'Video',
        category: 'media',
        defaultProps: {
            src: '',
            controls: true,
        },
        defaultStyles: {
            maxWidth: '100%',
            height: 'auto',
        },
        canHaveChildren: false,
        description: 'A video player',
    },

    // Navigation Components
    {
        type: 'nav',
        label: 'Navigation',
        icon: 'Menu',
        category: 'navigation',
        defaultProps: {},
        defaultStyles: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        canHaveChildren: true,
        description: 'A navigation container',
    },
];

export function getComponentDefinition(type: ComponentType): ComponentDefinition | undefined {
    return componentDefinitions.find((def) => def.type === type);
}

export function getComponentsByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
    return componentDefinitions.filter((def) => def.category === category);
}

export const componentCategories = [
    { id: 'layout', label: 'Layout', icon: 'Layout' },
    { id: 'basic', label: 'Basic', icon: 'Box' },
    { id: 'form', label: 'Form', icon: 'FormInput' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'navigation', label: 'Navigation', icon: 'Navigation' },
] as const;
