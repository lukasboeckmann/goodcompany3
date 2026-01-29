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
    const xPos = useTransform(x, (v) => {
        if (width === 0) return 0;
        const totalWidth = width * 3;
        const baseOffset = col * width;
        const current = baseOffset + v;
        const wrapped = ((current % totalWidth) + totalWidth) % totalWidth;
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
            className={`absolute overflow-hidden ${className}`}
            style={{
                width: width,
                height: height,
                top: 0,
                left: 0,
                x: xPos,
                y: yPos,
                willChange: 'transform',
                pointerEvents: isZoomedOut ? 'auto' : 'none',
                zIndex: 0,
                ...style
            }}
            onClickCapture={onClickCapture}
            onDoubleClick={onDoubleClick}
        >
            {/* 
        Full Surface Container 
        Ensure children fill this space.
      */}
            <div className="w-full h-full relative">
                {children}
            </div>
        </motion.div>
    );
}
