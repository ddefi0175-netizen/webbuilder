'use client';

import { useEditorStore } from '@/stores/editor-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StylePanel } from './style-panel';
import { PropsPanel } from './props-panel';
import { Settings, Paintbrush } from 'lucide-react';

export function RightPanel() {
    const { selection, getComponent } = useEditorStore();
    const selectedId = selection.selectedIds[0];
    const selectedComponent = selectedId ? getComponent(selectedId) : null;

    if (!selectedComponent) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-center">
                <div className="text-muted-foreground">
                    <p className="text-sm">Select a component to edit its properties</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Component Info */}
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold">{selectedComponent.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{selectedComponent.type}</p>
            </div>

            <Tabs defaultValue="style" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10 px-2">
                    <TabsTrigger
                        value="style"
                        className="gap-2 data-[state=active]:bg-muted rounded-md"
                    >
                        <Paintbrush className="h-4 w-4" />
                        Style
                    </TabsTrigger>
                    <TabsTrigger
                        value="props"
                        className="gap-2 data-[state=active]:bg-muted rounded-md"
                    >
                        <Settings className="h-4 w-4" />
                        Props
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="flex-1 m-0">
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        <StylePanel component={selectedComponent} />
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="props" className="flex-1 m-0">
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        <PropsPanel component={selectedComponent} />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}
