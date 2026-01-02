'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '@/stores/editor-store';

interface CanvasInteractions {
    isPanning: boolean;
    startPan: (e: React.MouseEvent) => void;
    onPan: (e: React.MouseEvent) => void;
    endPan: () => void;
    handleWheel: (e: React.WheelEvent) => void;
}

export function useCanvasInteractions(): CanvasInteractions {
    const [isPanning, setIsPanning] = useState(false);
    const lastPanPosition = useRef({ x: 0, y: 0 });

    const { canvas, setPan, setZoom } = useEditorStore();

    const startPan = useCallback((e: React.MouseEvent) => {
        // Only pan with middle mouse button or when holding space
        if (e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            lastPanPosition.current = { x: e.clientX, y: e.clientY };
        }
    }, []);

    const onPan = useCallback(
        (e: React.MouseEvent) => {
            if (!isPanning) return;

            const deltaX = e.clientX - lastPanPosition.current.x;
            const deltaY = e.clientY - lastPanPosition.current.y;

            setPan({
                x: canvas.pan.x + deltaX,
                y: canvas.pan.y + deltaY,
            });

            lastPanPosition.current = { x: e.clientX, y: e.clientY };
        },
        [isPanning, canvas.pan, setPan]
    );

    const endPan = useCallback(() => {
        setIsPanning(false);
    }, []);

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            // Zoom with Ctrl/Cmd + scroll
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom(canvas.zoom + delta);
            }
        },
        [canvas.zoom, setZoom]
    );

    // Handle space key for panning
    useEffect(() => {
        let isSpaceHeld = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isSpaceHeld) {
                isSpaceHeld = true;
                document.body.style.cursor = 'grab';
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                isSpaceHeld = false;
                document.body.style.cursor = '';
                setIsPanning(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return {
        isPanning,
        startPan,
        onPan,
        endPan,
        handleWheel,
    };
}
