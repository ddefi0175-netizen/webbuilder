// Component Types
export type ComponentType =
    | 'section'
    | 'container'
    | 'grid'
    | 'flex'
    | 'heading'
    | 'paragraph'
    | 'text'
    | 'link'
    | 'button'
    | 'image'
    | 'video'
    | 'icon'
    | 'divider'
    | 'spacer'
    | 'card'
    | 'navbar'
    | 'footer'
    | 'hero'
    | 'form'
    | 'input'
    | 'textarea'
    | 'select'
    | 'checkbox';

export interface ComponentStyles {
    // Layout
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;

    // Sizing
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;

    // Spacing
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Typography
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    textDecoration?: string;
    textTransform?: string;
    color?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;

    // Border
    border?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;

    // Effects
    boxShadow?: string;
    opacity?: string;

    // Position
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;

    // Other
    overflow?: string;
    cursor?: string;
    transition?: string;
}

export interface ResponsiveStyles {
    desktop: ComponentStyles;
    tablet: ComponentStyles;
    mobile: ComponentStyles;
}

export interface Component {
    id: string;
    type: ComponentType;
    name: string;
    props: Record<string, any>;
    styles: ComponentStyles;
    responsiveStyles?: Partial<ResponsiveStyles>;
    children: string[];
    parentId: string | null;
    isLocked?: boolean;
    isHidden?: boolean;
    aiGenerated?: boolean;
    aiPrompt?: string;
}

export interface ComponentDefinition {
    type: ComponentType;
    name: string;
    icon: string;
    category: ComponentCategory;
    defaultProps: Record<string, any>;
    defaultStyles: ComponentStyles;
    acceptsChildren: boolean;
    childTypes?: ComponentType[];
}

export type ComponentCategory =
    | 'layout'
    | 'typography'
    | 'media'
    | 'forms'
    | 'navigation'
    | 'sections';

// Editor Types
export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export interface CanvasState {
    zoom: number;
    pan: { x: number; y: number };
    showGrid: boolean;
    breakpoint: Breakpoint;
}

export interface SelectionState {
    selectedIds: string[];
    hoveredId: string | null;
}

export interface HistoryEntry {
    components: Map<string, Component>;
    rootId: string;
    timestamp: number;
}

// AI Types
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface AIContext {
    selectedComponent: Component | null;
    components: Component[];
    recentActions: string[];
}

export interface AISuggestion {
    id: string;
    type: 'component' | 'style' | 'content' | 'fix';
    title: string;
    description: string;
    action: () => void;
}

// Export Types
export interface ExportOptions {
    format: 'html' | 'react' | 'vue';
    includeStyles: boolean;
    minify: boolean;
    includeAssets: boolean;
}

export interface ExportResult {
    files: { name: string; content: string }[];
    assets: { name: string; url: string }[];
}
