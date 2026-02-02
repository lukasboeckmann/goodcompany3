'use client';

import React from 'react';
import { motion, useTransform, useSpring, MotionValue } from 'framer-motion';
import { GALLERY_IMAGES } from '@/data/content';

interface GalleryCellProps {
    x: MotionValue<number>;
    y: MotionValue<number>;
    size: { w: number; h: number };
    isZoomedOut: boolean;
}

export const GalleryCell = ({ x, y, size, isZoomedOut }: GalleryCellProps) => {

    // PARALLAX ENGINE
    // 1. Modulo: Ensures values don't jump when the grid warps.
    // 2. Local Center: Normalized to -0.5 to 0.5 relative to the cell width.
    // 3. Spring: Smooths out any micro-jumps or frame variances.
    const pX = useTransform(x, (v: number) => {
        const w = size.w || 1;
        const norm = ((v % w) + w) % w; // 0 to w
        return (norm - w / 2); // -w/2 to w/2 (Local Center)
    });

    const pY = useTransform(y, (v: number) => {
        const h = size.h || 1;
        const norm = ((v % h) + h) % h;
        return (norm - h / 2);
    });

    const springConfig = { stiffness: 100, damping: 40, mass: 1 };
    const smoothX = useSpring(pX, springConfig);
    const smoothY = useSpring(pY, springConfig);

    // Zoom Scale Factor: Reduce parallax distance when zoomed out so it looks proportional
    const scale = isZoomedOut ? 0.25 : 1;

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>

            {/* VERTICAL TYPOGRAPHY */}
            <div style={{
                position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center',
                fontFamily: 'serif', fontStyle: 'italic', fontSize: '3vh', color: '#ececec', whiteSpace: 'nowrap', zIndex: 5, pointerEvents: 'none', mixBlendMode: 'difference'
            }}>
                COLLECTION_01 <span style={{ fontFamily: 'monospace', fontStyle: 'normal', fontSize: '10px', marginLeft: '20px', letterSpacing: '0.2em' }}>SUPERFLY</span>
            </div>

            {/* IMAGE 1 (Dominant Left) */}
            <motion.div
                style={{
                    position: 'absolute', top: '10%', left: '15%', width: '55%', height: '70%',
                    zIndex: 1,
                    // Moves opposite to drag (classic parallax)
                    x: useTransform(smoothX, (v: any) => v * -0.05 * scale),
                    y: useTransform(smoothY, (v: any) => v * -0.05 * scale)
                }}
            >
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <img src={GALLERY_IMAGES[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }}></div>
                </div>
            </motion.div>

            {/* IMAGE 2 (Overlap Top Right) */}
            <motion.div
                style={{
                    position: 'absolute', top: '15%', right: '2%', width: '38%', height: '40%',
                    zIndex: 2,
                    // Moves faster (closer layer)
                    x: useTransform(smoothX, (v: any) => v * -0.12 * scale),
                    y: useTransform(smoothY, (v: any) => v * -0.12 * scale)
                }}
            >
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <img src={GALLERY_IMAGES[1].src} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }} />
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)' }}></div>
                </div>
            </motion.div>

            {/* IMAGE 3 (Overlap Bottom Right - Zoomed Detail) */}
            <motion.div
                style={{
                    position: 'absolute', bottom: '15%', right: '8%', width: '30%', height: '35%',
                    zIndex: 3,
                    // Moves fastest (closest layer)
                    x: useTransform(smoothX, (v: any) => v * -0.2 * scale),
                    y: useTransform(smoothY, (v: any) => v * -0.2 * scale)
                }}
            >
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
                    <img src={GALLERY_IMAGES[0].src} style={{ width: '150%', height: '150%', objectFit: 'cover', objectPosition: 'center', filter: 'grayscale(100%) contrast(1.2)' }} />
                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                </div>
            </motion.div>

        </div>
    );
};
