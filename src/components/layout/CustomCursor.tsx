'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // DIRECT TRACKING: 1:1 movement, NO lag
    // We use MotionValues directly to update the DOM without React renders.

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // -6px, damit er exakt mittig sitzt (bei 12px Breite)
            cursorX.set(e.clientX - 6);
            cursorY.set(e.clientY - 6);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
            setIsMobile(true);
        }
    }, []);

    if (isMobile) return null;

    return (
        <motion.div
            // pointer-events-none ist EXTREM wichtig, sonst klickt man auf den Cursor statt auf den Button drunter!
            className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white pointer-events-none z-[10000] mix-blend-difference"
            style={{ x: cursorX, y: cursorY }}
        />
    );
}