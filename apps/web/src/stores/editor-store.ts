import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
    Component,
    ComponentStyles,
    CanvasState,
    SelectionState,
    Breakpoint,
    HistoryEntry,
} from '@/types';
import { generateId } from '@/lib/utils';

interface EditorState {
    // Component Tree
    components: Map<string, Component>;
    rootId: string;

    // Canvas
    canvas: CanvasState;

    // Selection
    selection: SelectionState;

    // History
    history: HistoryEntry[];
    historyIndex: number;

    // UI State
    leftPanelOpen: boolean;
    rightPanelOpen: boolean;
    aiPanelOpen: boolean;
    toolsSidebarOpen: boolean;

    // Actions - Components
    addComponent: (component: Omit<Component, 'id'>, parentId?: string, index?: number) => string;
    updateComponent: (id: string, updates: Partial<Component>) => void;
    updateComponentStyles: (id: string, styles: Partial<ComponentStyles>) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newParentId: string, index: number) => void;
    duplicateComponent: (id: string) => string | null;

    // Actions - Selection
    selectComponent: (id: string | null, multi?: boolean) => void;
    hoverComponent: (id: string | null) => void;
    clearSelection: () => void;

    // Actions - Canvas
    setZoom: (zoom: number) => void;
    setPan: (pan: { x: number; y: number }) => void;
    setBreakpoint: (breakpoint: Breakpoint) => void;
    toggleGrid: () => void;

    // Actions - History
    undo: () => void;
    redo: () => void;
    saveHistory: () => void;

    // Actions - UI
    toggleLeftPanel: () => void;
    toggleRightPanel: () => void;
    toggleAIPanel: () => void;
    toggleToolsSidebar: () => void;

    // Getters
    getComponent: (id: string) => Component | undefined;
    getChildren: (id: string) => Component[];
    getParent: (id: string) => Component | undefined;
    getSelectedComponents: () => Component[];

    // Reset
    resetEditor: () => void;
}

const createDefaultRoot = (): Component => ({
    id: 'root',
    type: 'section',
    name: 'Page',
    props: {},
    styles: {
        minHeight: '100vh',
        backgroundColor: '#ffffff',
    },
    children: [],
    parentId: null,
});

const initialState = {
    components: new Map([['root', createDefaultRoot()]]),
    rootId: 'root',
    canvas: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        showGrid: true,
        breakpoint: 'desktop' as Breakpoint,
    },
    selection: {
        selectedIds: [],
        hoveredId: null,
    },
    history: [],
    historyIndex: -1,
    leftPanelOpen: true,
    rightPanelOpen: true,
    aiPanelOpen: false,
    toolsSidebarOpen: false,
};

export const useEditorStore = create<EditorState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Component Actions
                addComponent: (componentData, parentId = 'root', index) => {
                    const id = generateId();
                    const component: Component = { ...componentData, id };

                    set((state) => {
                        const newComponents = new Map(state.components);
                        newComponents.set(id, component);

                        // Add to parent's children
                        const parent = newComponents.get(parentId);
                        if (parent) {
                            const children = [...parent.children];
                            if (index !== undefined) {
                                children.splice(index, 0, id);
                            } else {
                                children.push(id);
                            }
                            newComponents.set(parentId, { ...parent, children });
                            component.parentId = parentId;
                        }

                        return { components: newComponents };
                    });

                    get().saveHistory();
                    return id;
                },

                updateComponent: (id, updates) => {
                    set((state) => {
                        const component = state.components.get(id);
                        if (!component) return state;

                        const newComponents = new Map(state.components);
                        newComponents.set(id, { ...component, ...updates });

                        return { components: newComponents };
                    });

                    get().saveHistory();
                },

                updateComponentStyles: (id, styles) => {
                    set((state) => {
                        const component = state.components.get(id);
                        if (!component) return state;

                        const newComponents = new Map(state.components);
                        newComponents.set(id, {
                            ...component,
                            styles: { ...component.styles, ...styles },
                        });

                        return { components: newComponents };
                    });

                    get().saveHistory();
                },

                deleteComponent: (id) => {
                    if (id === 'root') return;

                    set((state) => {
                        const component = state.components.get(id);
                        if (!component) return state;

                        const newComponents = new Map(state.components);

                        // Remove from parent's children
                        if (component.parentId) {
                            const parent = newComponents.get(component.parentId);
                            if (parent) {
                                newComponents.set(component.parentId, {
                                    ...parent,
                                    children: parent.children.filter((childId) => childId !== id),
                                });
                            }
                        }

                        // Recursively delete children
                        const deleteChildren = (componentId: string) => {
                            const comp = newComponents.get(componentId);
                            if (comp) {
                                comp.children.forEach(deleteChildren);
                                newComponents.delete(componentId);
                            }
                        };

                        deleteChildren(id);

                        // Clear selection if deleted component was selected
                        const newSelectedIds = state.selection.selectedIds.filter(
                            (selectedId) => selectedId !== id
                        );

                        return {
                            components: newComponents,
                            selection: { ...state.selection, selectedIds: newSelectedIds },
                        };
                    });

                    get().saveHistory();
                },

                moveComponent: (id, newParentId, index) => {
                    set((state) => {
                        const component = state.components.get(id);
                        if (!component || id === 'root') return state;

                        const newComponents = new Map(state.components);

                        // Remove from old parent
                        if (component.parentId) {
                            const oldParent = newComponents.get(component.parentId);
                            if (oldParent) {
                                newComponents.set(component.parentId, {
                                    ...oldParent,
                                    children: oldParent.children.filter((childId) => childId !== id),
                                });
                            }
                        }

                        // Add to new parent
                        const newParent = newComponents.get(newParentId);
                        if (newParent) {
                            const children = [...newParent.children];
                            children.splice(index, 0, id);
                            newComponents.set(newParentId, { ...newParent, children });
                        }

                        // Update component's parent reference
                        newComponents.set(id, { ...component, parentId: newParentId });

                        return { components: newComponents };
                    });

                    get().saveHistory();
                },

                duplicateComponent: (id) => {
                    const state = get();
                    const component = state.components.get(id);
                    if (!component || id === 'root') return null;

                    const duplicateRecursively = (
                        comp: Component,
                        newParentId: string | null
                    ): string => {
                        const newId = generateId();
                        const newChildren: string[] = [];

                        // Duplicate children first
                        for (const childId of comp.children) {
                            const child = state.components.get(childId);
                            if (child) {
                                const newChildId = duplicateRecursively(child, newId);
                                newChildren.push(newChildId);
                            }
                        }

                        const newComponent: Component = {
                            ...comp,
                            id: newId,
                            name: `${comp.name} (copy)`,
                            parentId: newParentId,
                            children: newChildren,
                        };

                        set((s) => {
                            const newComponents = new Map(s.components);
                            newComponents.set(newId, newComponent);
                            return { components: newComponents };
                        });

                        return newId;
                    };

                    const newId = duplicateRecursively(component, component.parentId);

                    // Add to parent's children
                    if (component.parentId) {
                        set((s) => {
                            const parent = s.components.get(component.parentId!);
                            if (parent) {
                                const index = parent.children.indexOf(id);
                                const newChildren = [...parent.children];
                                newChildren.splice(index + 1, 0, newId);

                                const newComponents = new Map(s.components);
                                newComponents.set(component.parentId!, {
                                    ...parent,
                                    children: newChildren,
                                });

                                return { components: newComponents };
                            }
                            return s;
                        });
                    }

                    get().saveHistory();
                    return newId;
                },

                // Selection Actions
                selectComponent: (id, multi = false) => {
                    set((state) => {
                        if (id === null) {
                            return { selection: { ...state.selection, selectedIds: [] } };
                        }

                        if (multi) {
                            const isSelected = state.selection.selectedIds.includes(id);
                            const newSelectedIds = isSelected
                                ? state.selection.selectedIds.filter((i) => i !== id)
                                : [...state.selection.selectedIds, id];

                            return { selection: { ...state.selection, selectedIds: newSelectedIds } };
                        }

                        return { selection: { ...state.selection, selectedIds: [id] } };
                    });
                },

                hoverComponent: (id) => {
                    set((state) => ({
                        selection: { ...state.selection, hoveredId: id },
                    }));
                },

                clearSelection: () => {
                    set((state) => ({
                        selection: { ...state.selection, selectedIds: [] },
                    }));
                },

                // Canvas Actions
                setZoom: (zoom) => {
                    set((state) => ({
                        canvas: { ...state.canvas, zoom: Math.min(Math.max(zoom, 0.25), 2) },
                    }));
                },

                setPan: (pan) => {
                    set((state) => ({
                        canvas: { ...state.canvas, pan },
                    }));
                },

                setBreakpoint: (breakpoint) => {
                    set((state) => ({
                        canvas: { ...state.canvas, breakpoint },
                    }));
                },

                toggleGrid: () => {
                    set((state) => ({
                        canvas: { ...state.canvas, showGrid: !state.canvas.showGrid },
                    }));
                },

                // History Actions
                undo: () => {
                    set((state) => {
                        if (state.historyIndex <= 0) return state;

                        const newIndex = state.historyIndex - 1;
                        const entry = state.history[newIndex];

                        return {
                            components: new Map(entry.components),
                            rootId: entry.rootId,
                            historyIndex: newIndex,
                        };
                    });
                },

                redo: () => {
                    set((state) => {
                        if (state.historyIndex >= state.history.length - 1) return state;

                        const newIndex = state.historyIndex + 1;
                        const entry = state.history[newIndex];

                        return {
                            components: new Map(entry.components),
                            rootId: entry.rootId,
                            historyIndex: newIndex,
                        };
                    });
                },

                saveHistory: () => {
                    set((state) => {
                        const entry: HistoryEntry = {
                            components: new Map(state.components),
                            rootId: state.rootId,
                            timestamp: Date.now(),
                        };

                        // Remove future history if we're not at the end
                        const newHistory = state.history.slice(0, state.historyIndex + 1);
                        newHistory.push(entry);

                        // Limit history size
                        if (newHistory.length > 50) {
                            newHistory.shift();
                        }

                        return {
                            history: newHistory,
                            historyIndex: newHistory.length - 1,
                        };
                    });
                },

                // UI Actions
                toggleLeftPanel: () => {
                    set((state) => ({ leftPanelOpen: !state.leftPanelOpen }));
                },

                toggleRightPanel: () => {
                    set((state) => ({ rightPanelOpen: !state.rightPanelOpen }));
                },

                toggleAIPanel: () => {
                    set((state) => ({ aiPanelOpen: !state.aiPanelOpen }));
                },

                toggleToolsSidebar: () => {
                    set((state) => ({ toolsSidebarOpen: !state.toolsSidebarOpen }));
                },

                // Getters
                getComponent: (id) => {
                    return get().components.get(id);
                },

                getChildren: (id) => {
                    const component = get().components.get(id);
                    if (!component) return [];

                    return component.children
                        .map((childId) => get().components.get(childId))
                        .filter((c): c is Component => c !== undefined);
                },

                getParent: (id) => {
                    const component = get().components.get(id);
                    if (!component || !component.parentId) return undefined;

                    return get().components.get(component.parentId);
                },

                getSelectedComponents: () => {
                    return get()
                        .selection.selectedIds.map((id) => get().components.get(id))
                        .filter((c): c is Component => c !== undefined);
                },

                // Reset
                resetEditor: () => {
                    set({
                        ...initialState,
                        components: new Map([['root', createDefaultRoot()]]),
                    });
                },
            }),
            {
                name: 'webbuilder-editor',
                partialize: (state) => ({
                    components: Array.from(state.components.entries()),
                    rootId: state.rootId,
                }),
                merge: (persisted: any, current) => {
                    if (persisted && persisted.components) {
                        return {
                            ...current,
                            components: new Map(persisted.components),
                            rootId: persisted.rootId,
                        };
                    }
                    return current;
                },
            }
        )
    )
);
