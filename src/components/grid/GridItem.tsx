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
    totalGridCols: number;
    totalGridRows: number;
    children: React.ReactNode;
    isZoomedOut: boolean;
    onClickCapture?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    className?: string;
    zIndex?: number;
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
    onDoubleClick,
    zIndex = 10
}: GridItemProps) {

    // LOGIK: 
    // Wir berechnen die absolute Position.
    // KORREKTUR: Wir entfernen "- (width / 2)", da HTML Elemente von oben-links starten.

    const xPos = useTransform(x, (latestX) => {
        if (!width) return 0;
        const totalW = width * totalGridCols;

        // 1. Position berechnen
        const currentX = (col * width) + latestX;

        // 2. Offset für den Wrap (Hälfte der Weltgröße)
        // Das sorgt dafür, dass der Wrap sauber an den Rändern passiert
        const offset = totalW / 2;

        // 3. Wrap-Mathematik
        // ((Wert + Offset) % Max + Max) % Max - Offset
        const wrappedX = ((currentX + offset) % totalW + totalW) % totalW - offset;

        return wrappedX;
    });

    const yPos = useTransform(y, (latestY) => {
        if (!height) return 0;
        const totalH = height * totalGridRows;

        const currentY = (row * height) + latestY;
        const offset = totalH / 2;
        const wrappedY = ((currentY + offset) % totalH + totalH) % totalH - offset;

        return wrappedY;
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
                pointerEvents: 'auto',
                zIndex: zIndex,
            }}
            onClickCapture={onClickCapture}
            onDoubleClick={onDoubleClick}
        >
            {children}
        </motion.div>
    );
}