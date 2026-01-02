'use client';

import { useEffect, useCallback } from 'react';
import { useEditorStore } from '@/stores/editor-store';

export function useKeyboardShortcuts() {
    const {
        selection,
        deleteComponent,
        duplicateComponent,
        undo,
        redo,
        selectComponent,
        toggleAIPanel,
        setZoom,
        canvas,
    } = useEditorStore();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            // Don't trigger shortcuts when typing in inputs
            if (isInput) return;

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modKey = isMac ? e.metaKey : e.ctrlKey;

            // Delete selected components
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selection.selectedIds.length > 0) {
                    e.preventDefault();
                    selection.selectedIds.forEach((id) => {
                        if (id !== 'root') {
                            deleteComponent(id);
                        }
                    });
                }
            }

            // Undo: Ctrl/Cmd + Z
            if (modKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
            if ((modKey && e.shiftKey && e.key === 'z') || (modKey && e.key === 'y')) {
                e.preventDefault();
                redo();
            }

            // Duplicate: Ctrl/Cmd + D
            if (modKey && e.key === 'd') {
                e.preventDefault();
                if (selection.selectedIds.length === 1) {
                    duplicateComponent(selection.selectedIds[0]);
                }
            }

            // Escape: Deselect
            if (e.key === 'Escape') {
                e.preventDefault();
                selectComponent(null);
            }

            // AI Panel: Ctrl/Cmd + K
            if (modKey && e.key === 'k') {
                e.preventDefault();
                toggleAIPanel();
            }

            // Zoom In: Ctrl/Cmd + =
            if (modKey && (e.key === '=' || e.key === '+')) {
                e.preventDefault();
                setZoom(canvas.zoom + 0.25);
            }

            // Zoom Out: Ctrl/Cmd + -
            if (modKey && e.key === '-') {
                e.preventDefault();
                setZoom(canvas.zoom - 0.25);
            }

            // Reset Zoom: Ctrl/Cmd + 0
            if (modKey && e.key === '0') {
                e.preventDefault();
                setZoom(1);
            }
        },
        [selection, deleteComponent, duplicateComponent, undo, redo, selectComponent, toggleAIPanel, setZoom, canvas.zoom]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
