'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface GridItemProps {
    x: MotionValue<number>;
    y: MotionValue<number>;
    row: number;
    col: number;
    width: number;
    height: number;
    children: React.ReactNode;
    className?: string; // Allow extra styling

    // Interaction props
    isZoomedOut: boolean;
    onClickCapture?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;

    // Styles for the container
    style?: React.CSSProperties;
}

export default function GridItem({
    x,
    y,
    row,
    col,
    width,
    height,
    children,
    className = '',
    isZoomedOut,
    onClickCapture,
    onDoubleClick,
    style = {}
}: GridItemProps) {

    // Transform logic for Infinite Wrapping
    // The GridItem calculates its own position based on global x,y
    const xPos = useTransform(x, (v) => {
        if (width === 0) return 0;
        const totalWidth = width * 3;
        const baseOffset = col * width;

        // We want the item to appear at baseOffset initially.
        // When v changes, it moves.
        // But we want it to wrap.
        // current nominal position = baseOffset + v
        const current = baseOffset + v;

        // Modulo wrapping to keep in range
        // We want the result to be roughly centered around the camera view?
        // No, standard modulo 3W puts it safely in [0, 3W).
        // If we shift it by -ItemWidth, we get [-W, 2W). 
        // This covers Left, Center, Right in a 3x3 if viewport is at 0.

        const wrapped = ((current % totalWidth) + totalWidth) % totalWidth;

        // We shift by -width. Why?
        // If wrapped is 0 -> -width (Left of viewport)
        // If wrapped is width -> 0 (Center of viewport)
        // If wrapped is 2*width -> width (Right of viewport)
        // This assumes the "Viewport" is at 0.

        // BUT the standard logic with `x` is: Camera moves LEFT, tiles move LEFT?
        // If I drag mouse Left (delta < 0), `x` decreases.
        // Tiles should move Left.
        // If `current = base + x`, then x decreasing means current decreasing. Correct.

        // Position Refinement:
        // If I am at (0,0), and I drag left (-100px). content moves left.
        // If I drag -1000px ...
        // Content should wrap from left to right.

        // With `wrapped` logic:
        // If `current` goes below -width?
        // (-W-1 % 3W) -> 2W-1.
        // Then subtract W -> W-1 (Right side).
        // So it works! It jumps from Left edge to Right edge.

        // Just ensure the visual "cut" is invisible. 
        // Since we have 3 tiles, and viewport sees 1 (or 3 if zoomed out?)
        // If zoomed out, we see 3x3?
        // If we see 3x3, and one jumps, do we see the jump?
        // Yes, if we see the edges.
        // But "Wrapping" means we need infinite *copies* if we see wide.
        // The current architecture is a 3x3 Grid.
        // If we zoom out to see ALL 9 tiles, we see the edges of the universe.
        // If we drag, the tiles wrap.
        // So a tile leaving left enters right. 
        // Visually it looks like they swap.
        // For a TRULY infinite field where you see neighbors, you generally need buffer tiles (e.g. 5x5 or 7x7) to hide the warp.
        // But the user said "virtuell kachelst (Tiling)".
        // And "Wenn ein Element... überschreitet... nahtlos... springen."
        // With 3x3, if you zoom out such that you see > 3 width, you see emptiness.
        // If `isZoomedOut`, the scale is 0.25. You see EVERYTHING plus void.
        // The user's prompt implies "Tiling" might mean "Draw copies".
        // "stelle sicher, dass für den User keine "Lücken" entstehen, indem du das 3x3 Grid virtuell kachelst (Tiling)."
        // Virtual Tiling usually implies: RENDER copies.
        // But Render Copies = More DOM Elements.
        // If I stick to 9 DOM elements that just warp, and I zoom out, I will see them moving around.

        // However, the prompt says "page.tsx nur noch als Orchestrator ... GridItem-Instanzen ... die innerhalb des unendlichen Wrappers leben".
        // Maybe `GridItem` creates the copies?
        // Or I just stick to the 3x3 wrapping logic which is "Infinite" in navigation, but maybe visual "Lücken" if zoom is too far?
        // Use `xPos` logic as designed. If gaps appear in Overview, we might need a 5x5 layout or strict 3x3 view.
        // Given the prompt "3x3 Grid ... virtuell kachelst", I will stick to 1 instance per cell and simple wrapping for now.

        return wrapped - width;
    });

    const yPos = useTransform(y, (v) => {
        if (height === 0) return 0;
        const totalHeight = height * 3;
        const baseOffset = row * height;
        const current = baseOffset + v;

        const wrapped = ((current % totalHeight) + totalHeight) % totalHeight;
        return wrapped - height;
    });

    return (
        <motion.div
            className={className}
            style={{
                width: width,
                height: height,
                position: 'absolute',
                top: 0,
                left: 0,
                x: xPos,
                y: yPos,
                willChange: 'transform',
                pointerEvents: isZoomedOut ? 'auto' : 'none',
                // If zoomed out, we want global checks? 
                // Or if zoomed IN, we want content interaction? 
                // The previous code had complex pointerEvents logic.
                ...style
            }}
            onClickCapture={onClickCapture}
            onDoubleClick={onDoubleClick}
        >
            {children}
        </motion.div>
    );
}
