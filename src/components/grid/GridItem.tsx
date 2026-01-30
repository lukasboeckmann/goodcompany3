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
    isZoomedOut: boolean;
    // Wir machen diese Props optional, damit es nicht crasht
    onClickCapture?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    className?: string; // Hinzugefügt für Flexibilität
}

export default function GridItem({
    x,
    y,
    row,
    col,
    width,
    height,
    children,
    isZoomedOut,
    onClickCapture,
    onDoubleClick,
    className
}: GridItemProps) {

    // KORRIGIERTE MATHEMATIK:
    // Diese Formel ist robuster gegen "Zittern" an den Rändern.
    // Wir nutzen width * 3 (Totalgröße) für den Modulo.

    const xPos = useTransform(x, (latestX) => {
        if (!width) return 0;
        const totalW = width * 3;
        // Berechnung: Startposition + Bewegung
        const rawPos = (col * width) + latestX;
        // Modulo, der auch negative Zahlen sauber "wrapped"
        const wrappedPos = ((rawPos % totalW) + totalW) % totalW;
        // Zentrieren: Wir schieben alles um 1 Breite zurück, damit Index 1 in der Mitte ist
        return wrappedPos - width;
    });

    const yPos = useTransform(y, (latestY) => {
        if (!height) return 0;
        const totalH = height * 3;
        const rawPos = (row * height) + latestY;
        const wrappedPos = ((rawPos % totalH) + totalH) % totalH;
        return wrappedPos - height;
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
                // WICHTIG: Hardware-Beschleunigung erzwingen gegen Grafik-Glitches
                willChange: 'transform',
                pointerEvents: 'auto',
                zIndex: 0,
            }}
            onClickCapture={onClickCapture}
            onDoubleClick={onDoubleClick}
        >
            {children}
        </motion.div>
    );
}