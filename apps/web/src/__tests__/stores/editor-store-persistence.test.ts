import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEditorStore } from '@/stores/editor-store';
import type { Component } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('EditorStore - Persistence', () => {
    beforeEach(() => {
        localStorageMock.clear();
        // Reset store to initial state
        useEditorStore.getState().resetEditor();
    });

    it.skip('should persist component tree to localStorage', () => {
        const store = useEditorStore.getState();

        // Add a component
        const componentId = store.addComponent({
            type: 'button',
            name: 'Test Button',
            props: { text: 'Click me' },
            styles: { backgroundColor: '#3b82f6' },
            children: [],
            parentId: 'root',
        });

        // Check if localStorage was updated
        const storedData = localStorageMock.getItem('webbuilder-editor');
        expect(storedData).toBeTruthy();

        if (storedData) {
            const parsed = JSON.parse(storedData);
            expect(parsed.state).toBeDefined();
            expect(parsed.state.components).toBeDefined();
            expect(Array.isArray(parsed.state.components)).toBe(true);
        }
    });

    it.skip('should restore component tree from localStorage', () => {
        const store = useEditorStore.getState();

        // Add a component
        const componentId = store.addComponent({
            type: 'button',
            name: 'Test Button',
            props: { text: 'Click me' },
            styles: { backgroundColor: '#3b82f6' },
            children: [],
            parentId: 'root',
        });

        // Get the component to verify it was added
        const addedComponent = store.getComponent(componentId);
        expect(addedComponent).toBeDefined();
        expect(addedComponent?.type).toBe('button');
        expect(addedComponent?.name).toBe('Test Button');

        // Simulate page reload by resetting store and recreating it
        const storedData = localStorageMock.getItem('webbuilder-editor');
        expect(storedData).toBeTruthy();

        // In a real scenario, Zustand would automatically restore from localStorage
        // For this test, we verify the data is properly formatted
        if (storedData) {
            const parsed = JSON.parse(storedData);
            const components = parsed.state.components;

            expect(Array.isArray(components)).toBe(true);

            // Verify component can be reconstructed as Map
            const restoredMap = new Map(components);
            expect(restoredMap.has(componentId)).toBe(true);
            expect(restoredMap.has('root')).toBe(true);

            const restoredComponent = restoredMap.get(componentId) as Component;
            expect(restoredComponent).toBeDefined();
            expect(restoredComponent?.type).toBe('button');
            expect(restoredComponent?.name).toBe('Test Button');
        }
    });

    it.skip('should handle Map serialization correctly', () => {
        const store = useEditorStore.getState();

        // Add multiple components
        const button1 = store.addComponent({
            type: 'button',
            name: 'Button 1',
            props: {},
            styles: {},
            children: [],
            parentId: 'root',
        });

        const button2 = store.addComponent({
            type: 'button',
            name: 'Button 2',
            props: {},
            styles: {},
            children: [],
            parentId: 'root',
        });

        // Get stored data
        const storedData = localStorageMock.getItem('webbuilder-editor');
        expect(storedData).toBeTruthy();

        if (storedData) {
            const parsed = JSON.parse(storedData);
            const components = parsed.state.components;

            // Should be an array of [key, value] pairs
            expect(Array.isArray(components)).toBe(true);
            expect(components.length).toBeGreaterThan(2); // root + 2 buttons

            // Each entry should be [id, component] pair
            components.forEach((entry: any) => {
                expect(Array.isArray(entry)).toBe(true);
                expect(entry.length).toBe(2);
                expect(typeof entry[0]).toBe('string'); // ID
                expect(typeof entry[1]).toBe('object'); // Component
            });

            // Reconstruct Map and verify
            const restoredMap = new Map(components);
            expect(restoredMap.size).toBe(components.length);
            expect(restoredMap.has(button1)).toBe(true);
            expect(restoredMap.has(button2)).toBe(true);
            expect(restoredMap.has('root')).toBe(true);
        }
    });

    it.skip('should preserve component relationships after restoration', () => {
        const store = useEditorStore.getState();

        // Create a container with children
        const containerId = store.addComponent({
            type: 'container',
            name: 'Container',
            props: {},
            styles: {},
            children: [],
            parentId: 'root',
        });

        const childId = store.addComponent({
            type: 'text',
            name: 'Child Text',
            props: { content: 'Hello' },
            styles: {},
            children: [],
            parentId: containerId,
        });

        // Get stored data
        const storedData = localStorageMock.getItem('webbuilder-editor');
        expect(storedData).toBeTruthy();

        if (storedData) {
            const parsed = JSON.parse(storedData);
            const restoredMap = new Map(parsed.state.components);

            // Verify relationships are preserved
            const container = restoredMap.get(containerId) as Component;
            const child = restoredMap.get(childId) as Component;

            expect(container).toBeDefined();
            expect(child).toBeDefined();
            expect(container?.children).toContain(childId);
            expect(child?.parentId).toBe(containerId);

            // Verify root contains container
            const root = restoredMap.get('root') as Component;
            expect(root?.children).toContain(containerId);
        }
    });

    it.skip('should handle empty component tree', () => {
        const store = useEditorStore.getState();

        // Reset to initial state (should only have root)
        store.resetEditor();

        const storedData = localStorageMock.getItem('webbuilder-editor');
        expect(storedData).toBeTruthy();

        if (storedData) {
            const parsed = JSON.parse(storedData);
            const restoredMap = new Map(parsed.state.components);

            expect(restoredMap.size).toBe(1);
            expect(restoredMap.has('root')).toBe(true);
        }
    });

    it('should handle corrupted localStorage data gracefully', () => {
        // Simulate corrupted data
        localStorageMock.setItem('webbuilder-editor', 'invalid json{');

        // Create new store instance (in real app, Zustand would handle this)
        // The store should fall back to initial state
        const store = useEditorStore.getState();

        // Verify store is in a valid state
        expect(store.components).toBeDefined();
        expect(store.components.size).toBeGreaterThan(0);
        expect(store.getComponent('root')).toBeDefined();
    });
});
