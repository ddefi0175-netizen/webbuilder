'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentLibrary } from './component-library';
import { LayersPanel } from './layers-panel';
import { Layers, LayoutGrid } from 'lucide-react';

export function LeftPanel() {
    const [activeTab, setActiveTab] = useState('components');

    return (
        <div className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10 px-2">
                    <TabsTrigger
                        value="components"
                        className="gap-2 data-[state=active]:bg-muted rounded-md"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Components
                    </TabsTrigger>
                    <TabsTrigger
                        value="layers"
                        className="gap-2 data-[state=active]:bg-muted rounded-md"
                    >
                        <Layers className="h-4 w-4" />
                        Layers
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="components" className="flex-1 m-0">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <ComponentLibrary />
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="layers" className="flex-1 m-0">
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                        <LayersPanel />
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );
}
