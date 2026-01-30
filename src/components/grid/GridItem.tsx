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
    // Neue Props für die unendliche "Tapete"
    totalGridCols: number;
    totalGridRows: number;
    children: React.ReactNode;
    isZoomedOut: boolean;
    onClickCapture?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    className?: string;
}

export default function GridItem({
    x,
    y,
    row,
    col,
    width,
    height,
    totalGridCols,
    totalGridRows,
    children,
    className,
    isZoomedOut,
    onClickCapture,
    onDoubleClick
}: GridItemProps) {

    // LOGIK: Positionierung im unendlichen Raum (Tapete)
    const xPos = useTransform(x, (latestX) => {
        if (!width) return 0;
        const totalW = width * totalGridCols;
        const rawPos = (col * width) + latestX;
        // Modulo für den Loop der gesamten Welt
        const wrappedPos = ((rawPos % totalW) + totalW) % totalW;
        // Zentrierung: Verschiebt das Grid so, dass Index 0 in der Mitte bleibt
        return wrappedPos - (width * Math.floor(totalGridCols / 2));
    });

    const yPos = useTransform(y, (latestY) => {
        if (!height) return 0;
        const totalH = height * totalGridRows;
        const rawPos = (row * height) + latestY;
        const wrappedPos = ((rawPos % totalH) + totalH) % totalH;
        return wrappedPos - (height * Math.floor(totalGridRows / 2));
    });

    return (
        <motion.div
            className={className}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                x: xPos,
                y: yPos,
                willChange: 'transform',
                pointerEvents: 'auto', // Wichtig für Interaktionen
                zIndex: 0,
            }}
            onClickCapture={onClickCapture}
            onDoubleClick={onDoubleClick}
        >
            {children}
        </motion.div>
    );
}