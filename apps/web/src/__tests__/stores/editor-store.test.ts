import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editor-store';

describe('Editor Store', () => {
    beforeEach(() => {
        // Reset store before each test
        const { resetEditor } = useEditorStore.getState();
        resetEditor();
    });

    describe('Component Management', () => {
        it('should add a component', () => {
            const { addComponent, components, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'section',
                name: 'Test Section',
                props: {},
                styles: { padding: '20px' },
                children: [],
                parentId: rootId,
            }, rootId);

            const state = useEditorStore.getState();
            expect(state.components.get(newId)).toBeDefined();
        });

        it('should add a child component', () => {
            const { addComponent, rootId } = useEditorStore.getState();
            
            // Add parent
            const parentId = addComponent({
                type: 'container',
                name: 'Parent Container',
                props: {},
                styles: {},
                children: [],
                parentId: rootId,
            }, rootId);

            // Add child
            const childId = addComponent({
                type: 'heading',
                name: 'Child Heading',
                props: { text: 'Hello World' },
                styles: {},
                children: [],
                parentId: parentId,
            }, parentId);

            const state = useEditorStore.getState();
            const parent = state.components.get(parentId);
            expect(parent?.children).toContain(childId);
        });

        it('should delete a component', () => {
            const { addComponent, deleteComponent, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'section',
                name: 'Test Section',
                props: {},
                styles: {},
                children: [],
                parentId: rootId,
            }, rootId);

            deleteComponent(newId);

            const state = useEditorStore.getState();
            expect(state.components.get(newId)).toBeUndefined();
        });

        it('should update component props', () => {
            const { addComponent, updateComponent, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'heading',
                name: 'Test Heading',
                props: { text: 'Original' },
                styles: {},
                children: [],
                parentId: rootId,
            }, rootId);

            updateComponent(newId, { props: { text: 'Updated' } });

            const state = useEditorStore.getState();
            expect(state.components.get(newId)?.props.text).toBe('Updated');
        });

        it('should update component styles', () => {
            const { addComponent, updateComponentStyles, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'section',
                name: 'Test Section',
                props: {},
                styles: { backgroundColor: 'white' },
                children: [],
                parentId: rootId,
            }, rootId);

            updateComponentStyles(newId, { backgroundColor: 'blue' });

            const state = useEditorStore.getState();
            expect(state.components.get(newId)?.styles.backgroundColor).toBe('blue');
        });
    });

    describe('Selection', () => {
        it('should select a component', () => {
            const { addComponent, selectComponent, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'section',
                name: 'Test Section',
                props: {},
                styles: {},
                children: [],
                parentId: rootId,
            }, rootId);

            selectComponent(newId);

            const state = useEditorStore.getState();
            expect(state.selection.selectedIds).toContain(newId);
        });

        it('should clear selection', () => {
            const { addComponent, selectComponent, clearSelection, rootId } = useEditorStore.getState();
            
            const newId = addComponent({
                type: 'section',
                name: 'Test Section',
                props: {},
                styles: {},
                children: [],
                parentId: rootId,
            }, rootId);

            selectComponent(newId);
            clearSelection();

            const state = useEditorStore.getState();
            expect(state.selection.selectedIds.length).toBe(0);
        });

        it('should support multi-select', () => {
            const { addComponent, selectComponent, rootId } = useEditorStore.getState();
            
            const id1 = addComponent({ type: 'section', name: 'Section 1', props: {}, styles: {}, children: [], parentId: rootId }, rootId);
            const id2 = addComponent({ type: 'section', name: 'Section 2', props: {}, styles: {}, children: [], parentId: rootId }, rootId);

            selectComponent(id1);
            selectComponent(id2, true); // Multi-select

            const state = useEditorStore.getState();
            expect(state.selection.selectedIds.length).toBe(2);
        });
    });

    describe('Canvas', () => {
        it('should set breakpoint to tablet', () => {
            const { setBreakpoint } = useEditorStore.getState();
            
            setBreakpoint('tablet');

            const state = useEditorStore.getState();
            expect(state.canvas.breakpoint).toBe('tablet');
        });

        it('should set breakpoint to mobile', () => {
            const { setBreakpoint } = useEditorStore.getState();
            
            setBreakpoint('mobile');

            const state = useEditorStore.getState();
            expect(state.canvas.breakpoint).toBe('mobile');
        });
    });

    describe('Zoom', () => {
        it('should set zoom level', () => {
            const { setZoom } = useEditorStore.getState();
            
            setZoom(0.75);

            const state = useEditorStore.getState();
            expect(state.canvas.zoom).toBe(0.75);
        });
    });

    describe('Grid Toggle', () => {
        it('should toggle grid visibility', () => {
            const { toggleGrid } = useEditorStore.getState();
            const initialGrid = useEditorStore.getState().canvas.showGrid;
            
            toggleGrid();
            expect(useEditorStore.getState().canvas.showGrid).toBe(!initialGrid);
            
            toggleGrid();
            expect(useEditorStore.getState().canvas.showGrid).toBe(initialGrid);

            expect(useEditorStore.getState().toolsSidebarOpen).toBe(false);

            const { toggleToolsSidebar } = useEditorStore.getState();
            toggleToolsSidebar();
            expect(useEditorStore.getState().toolsSidebarOpen).toBe(true);
        });
    });
});
