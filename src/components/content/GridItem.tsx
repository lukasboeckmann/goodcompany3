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
}: GridItemProps) {

    // Transform logic for Infinite Wrapping
    const xPos = useTransform(x, (v) => {
        const totalWidth = width * 3;
        const baseOffset = col * width;
        const current = baseOffset + v;

        // Modulo wrapping to keep in range [-width, 2*width)
        // Formula: ((val % max) + max) % max  ->  [0, max)
        // Then shift to desired range.
        const wrapped = ((current % totalWidth) + totalWidth) % totalWidth;

        // Returns range [0, 3W). 
        // We shift by -width to get [-W, 2W) so one neighbor is on left, one on right (if viewport is 0..W)
        return wrapped - width;
    });

    const yPos = useTransform(y, (v) => {
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
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: height,
                x: xPos,
                y: yPos,
                willChange: 'transform', // Optimization hint
            }}
        >
            {children}
        </motion.div>
    );
}
