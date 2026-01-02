'use client';

import { useEditorStore } from '@/stores/editor-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Component } from '@/types';

interface PropsPanelProps {
    component: Component;
}

export function PropsPanel({ component }: PropsPanelProps) {
    const { updateComponent } = useEditorStore();

    const updateProp = (key: string, value: any) => {
        updateComponent(component.id, {
            props: { ...component.props, [key]: value },
        });
    };

    const updateName = (name: string) => {
        updateComponent(component.id, { name });
    };

    // Render different inputs based on component type
    const renderTypeSpecificProps = () => {
        switch (component.type) {
            case 'heading':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Level</Label>
                            <Select
                                value={component.props.level || 'h2'}
                                onValueChange={(value) => updateProp('level', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="h1">H1</SelectItem>
                                    <SelectItem value="h2">H2</SelectItem>
                                    <SelectItem value="h3">H3</SelectItem>
                                    <SelectItem value="h4">H4</SelectItem>
                                    <SelectItem value="h5">H5</SelectItem>
                                    <SelectItem value="h6">H6</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Text</Label>
                            <Input
                                value={component.props.text || ''}
                                onChange={(e) => updateProp('text', e.target.value)}
                                placeholder="Enter heading text"
                                className="h-8"
                            />
                        </div>
                    </>
                );

            case 'paragraph':
            case 'text':
                return (
                    <div className="space-y-1.5">
                        <Label className="text-xs">Text</Label>
                        <Textarea
                            value={component.props.text || ''}
                            onChange={(e) => updateProp('text', e.target.value)}
                            placeholder="Enter text content"
                            rows={4}
                        />
                    </div>
                );

            case 'link':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Text</Label>
                            <Input
                                value={component.props.text || ''}
                                onChange={(e) => updateProp('text', e.target.value)}
                                placeholder="Link text"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">URL</Label>
                            <Input
                                value={component.props.href || ''}
                                onChange={(e) => updateProp('href', e.target.value)}
                                placeholder="https://"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Target</Label>
                            <Select
                                value={component.props.target || '_self'}
                                onValueChange={(value) => updateProp('target', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_self">Same Tab</SelectItem>
                                    <SelectItem value="_blank">New Tab</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );

            case 'button':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Text</Label>
                            <Input
                                value={component.props.text || ''}
                                onChange={(e) => updateProp('text', e.target.value)}
                                placeholder="Button text"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Variant</Label>
                            <Select
                                value={component.props.variant || 'primary'}
                                onValueChange={(value) => updateProp('variant', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="primary">Primary</SelectItem>
                                    <SelectItem value="secondary">Secondary</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="ghost">Ghost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );

            case 'image':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Source URL</Label>
                            <Input
                                value={component.props.src || ''}
                                onChange={(e) => updateProp('src', e.target.value)}
                                placeholder="https://"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Alt Text</Label>
                            <Input
                                value={component.props.alt || ''}
                                onChange={(e) => updateProp('alt', e.target.value)}
                                placeholder="Image description"
                                className="h-8"
                            />
                        </div>
                    </>
                );

            case 'video':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Source URL</Label>
                            <Input
                                value={component.props.src || ''}
                                onChange={(e) => updateProp('src', e.target.value)}
                                placeholder="https://"
                                className="h-8"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Poster Image</Label>
                            <Input
                                value={component.props.poster || ''}
                                onChange={(e) => updateProp('poster', e.target.value)}
                                placeholder="https://"
                                className="h-8"
                            />
                        </div>
                    </>
                );

            case 'input':
                return (
                    <>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Type</Label>
                            <Select
                                value={component.props.type || 'text'}
                                onValueChange={(value) => updateProp('type', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="password">Password</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="tel">Phone</SelectItem>
                                    <SelectItem value="url">URL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Placeholder</Label>
                            <Input
                                value={component.props.placeholder || ''}
                                onChange={(e) => updateProp('placeholder', e.target.value)}
                                placeholder="Enter placeholder"
                                className="h-8"
                            />
                        </div>
                    </>
                );

            case 'spacer':
                return (
                    <div className="space-y-1.5">
                        <Label className="text-xs">Height</Label>
                        <Input
                            value={component.props.height || '32px'}
                            onChange={(e) => updateProp('height', e.target.value)}
                            placeholder="32px"
                            className="h-8"
                        />
                    </div>
                );

            case 'grid':
                return (
                    <div className="space-y-1.5">
                        <Label className="text-xs">Columns</Label>
                        <Select
                            value={String(component.props.columns || 3)}
                            onValueChange={(value) => updateProp('columns', parseInt(value))}
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n} Column{n > 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Common Props */}
            <div className="space-y-1.5">
                <Label className="text-xs">Component Name</Label>
                <Input
                    value={component.name}
                    onChange={(e) => updateName(e.target.value)}
                    className="h-8"
                />
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs">ID</Label>
                <Input
                    value={component.id}
                    disabled
                    className="h-8 text-muted-foreground"
                />
            </div>

            {/* Type-Specific Props */}
            {renderTypeSpecificProps()}
        </div>
    );
}
