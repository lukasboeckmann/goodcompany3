'use client';
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // FIX: SCHNELLER & DIREKTER
    // Stiffness: Je höher, desto schneller zieht er zur Maus (wie ein starkes Gummiband).
    // Damping: Bremst das Nachschwingen.
    // Mass: Je kleiner, desto weniger "träge" fühlt er sich an.
    const springConfig = { damping: 50, stiffness: 1200, mass: 0.5 };

    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

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
            style={{ x, y }}
        />
    );
}