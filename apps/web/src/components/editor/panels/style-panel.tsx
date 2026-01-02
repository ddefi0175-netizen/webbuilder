'use client';

import { useEditorStore } from '@/stores/editor-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import type { Component, ComponentStyles } from '@/types';

interface StylePanelProps {
    component: Component;
}

export function StylePanel({ component }: StylePanelProps) {
    const { updateComponentStyles } = useEditorStore();

    const updateStyle = (property: keyof ComponentStyles, value: string) => {
        updateComponentStyles(component.id, { [property]: value });
    };

    return (
        <div className="p-4">
            <Accordion type="multiple" defaultValue={['layout', 'spacing', 'typography', 'background', 'border']} className="space-y-2">
                {/* Layout */}
                <AccordionItem value="layout" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Layout
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Width</Label>
                                <Input
                                    value={component.styles.width || ''}
                                    onChange={(e) => updateStyle('width', e.target.value)}
                                    placeholder="auto"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Height</Label>
                                <Input
                                    value={component.styles.height || ''}
                                    onChange={(e) => updateStyle('height', e.target.value)}
                                    placeholder="auto"
                                    className="h-8"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Display</Label>
                            <Select
                                value={component.styles.display || 'block'}
                                onValueChange={(value) => updateStyle('display', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="block">Block</SelectItem>
                                    <SelectItem value="flex">Flex</SelectItem>
                                    <SelectItem value="grid">Grid</SelectItem>
                                    <SelectItem value="inline">Inline</SelectItem>
                                    <SelectItem value="inline-block">Inline Block</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {component.styles.display === 'flex' && (
                            <>
                                <div className="space-y-1.5">
                                    <Label className="text-xs">Flex Direction</Label>
                                    <Select
                                        value={component.styles.flexDirection || 'row'}
                                        onValueChange={(value) => updateStyle('flexDirection', value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="row">Row</SelectItem>
                                            <SelectItem value="row-reverse">Row Reverse</SelectItem>
                                            <SelectItem value="column">Column</SelectItem>
                                            <SelectItem value="column-reverse">Column Reverse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Justify Content</Label>
                                    <Select
                                        value={component.styles.justifyContent || 'flex-start'}
                                        onValueChange={(value) => updateStyle('justifyContent', value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="flex-start">Start</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="flex-end">End</SelectItem>
                                            <SelectItem value="space-between">Space Between</SelectItem>
                                            <SelectItem value="space-around">Space Around</SelectItem>
                                            <SelectItem value="space-evenly">Space Evenly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Align Items</Label>
                                    <Select
                                        value={component.styles.alignItems || 'stretch'}
                                        onValueChange={(value) => updateStyle('alignItems', value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="stretch">Stretch</SelectItem>
                                            <SelectItem value="flex-start">Start</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="flex-end">End</SelectItem>
                                            <SelectItem value="baseline">Baseline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs">Gap</Label>
                                    <Input
                                        value={component.styles.gap || ''}
                                        onChange={(e) => updateStyle('gap', e.target.value)}
                                        placeholder="0px"
                                        className="h-8"
                                    />
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Spacing */}
                <AccordionItem value="spacing" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Spacing
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Padding</Label>
                            <Input
                                value={component.styles.padding || ''}
                                onChange={(e) => updateStyle('padding', e.target.value)}
                                placeholder="0px"
                                className="h-8"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Padding Top</Label>
                                <Input
                                    value={component.styles.paddingTop || ''}
                                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                                    placeholder="0px"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Padding Bottom</Label>
                                <Input
                                    value={component.styles.paddingBottom || ''}
                                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                                    placeholder="0px"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Padding Left</Label>
                                <Input
                                    value={component.styles.paddingLeft || ''}
                                    onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                                    placeholder="0px"
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Padding Right</Label>
                                <Input
                                    value={component.styles.paddingRight || ''}
                                    onChange={(e) => updateStyle('paddingRight', e.target.value)}
                                    placeholder="0px"
                                    className="h-8"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Margin</Label>
                            <Input
                                value={component.styles.margin || ''}
                                onChange={(e) => updateStyle('margin', e.target.value)}
                                placeholder="0px"
                                className="h-8"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Typography */}
                <AccordionItem value="typography" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Typography
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Font Size</Label>
                            <Input
                                value={component.styles.fontSize || ''}
                                onChange={(e) => updateStyle('fontSize', e.target.value)}
                                placeholder="16px"
                                className="h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Font Weight</Label>
                            <Select
                                value={component.styles.fontWeight || '400'}
                                onValueChange={(value) => updateStyle('fontWeight', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="300">Light (300)</SelectItem>
                                    <SelectItem value="400">Normal (400)</SelectItem>
                                    <SelectItem value="500">Medium (500)</SelectItem>
                                    <SelectItem value="600">Semibold (600)</SelectItem>
                                    <SelectItem value="700">Bold (700)</SelectItem>
                                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Line Height</Label>
                            <Input
                                value={component.styles.lineHeight || ''}
                                onChange={(e) => updateStyle('lineHeight', e.target.value)}
                                placeholder="1.5"
                                className="h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Text Align</Label>
                            <Select
                                value={component.styles.textAlign || 'left'}
                                onValueChange={(value) => updateStyle('textAlign', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                    <SelectItem value="justify">Justify</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Text Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={component.styles.color || '#000000'}
                                    onChange={(e) => updateStyle('color', e.target.value)}
                                    className="h-8 w-12 p-1"
                                />
                                <Input
                                    value={component.styles.color || ''}
                                    onChange={(e) => updateStyle('color', e.target.value)}
                                    placeholder="#000000"
                                    className="h-8 flex-1"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Background */}
                <AccordionItem value="background" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Background
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Background Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={component.styles.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                    className="h-8 w-12 p-1"
                                />
                                <Input
                                    value={component.styles.backgroundColor || ''}
                                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                    placeholder="transparent"
                                    className="h-8 flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Background Image</Label>
                            <Input
                                value={component.styles.backgroundImage || ''}
                                onChange={(e) => updateStyle('backgroundImage', e.target.value)}
                                placeholder="url(...) or gradient"
                                className="h-8"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Border */}
                <AccordionItem value="border" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Border
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Border Radius</Label>
                            <Input
                                value={component.styles.borderRadius || ''}
                                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                                placeholder="0px"
                                className="h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Border Width</Label>
                            <Input
                                value={component.styles.borderWidth || ''}
                                onChange={(e) => updateStyle('borderWidth', e.target.value)}
                                placeholder="0px"
                                className="h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Border Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={component.styles.borderColor || '#e5e7eb'}
                                    onChange={(e) => updateStyle('borderColor', e.target.value)}
                                    className="h-8 w-12 p-1"
                                />
                                <Input
                                    value={component.styles.borderColor || ''}
                                    onChange={(e) => updateStyle('borderColor', e.target.value)}
                                    placeholder="#e5e7eb"
                                    className="h-8 flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Border Style</Label>
                            <Select
                                value={component.styles.borderStyle || 'solid'}
                                onValueChange={(value) => updateStyle('borderStyle', value)}
                            >
                                <SelectTrigger className="h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="solid">Solid</SelectItem>
                                    <SelectItem value="dashed">Dashed</SelectItem>
                                    <SelectItem value="dotted">Dotted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Effects */}
                <AccordionItem value="effects" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:no-underline">
                        Effects
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Box Shadow</Label>
                            <Input
                                value={component.styles.boxShadow || ''}
                                onChange={(e) => updateStyle('boxShadow', e.target.value)}
                                placeholder="none"
                                className="h-8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Opacity</Label>
                            <Input
                                value={component.styles.opacity || ''}
                                onChange={(e) => updateStyle('opacity', e.target.value)}
                                placeholder="1"
                                className="h-8"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
