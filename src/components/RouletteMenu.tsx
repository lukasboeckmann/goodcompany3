'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useRouter } from 'next/navigation'; // For navigation
import styles from './RouletteMenu.module.css';

// Define items with routes
const ITEMS = [
    { label: 'Veli', path: '/veli' },
    { label: '*maliiIk', path: '/maliiik' },
    { label: 'jamal', path: '/jamal' },
    { label: 'cuffa', path: '/cuffa' },
    { label: 'Live', path: '/live' },
    { label: 'Musik', path: '/musik' },
    { label: 'Shop', path: '/shop' },
    { label: 'Kontakt', path: '/kontakt' }
];

export default function RouletteMenu() {
    const router = useRouter(); // Hook for navigation
    const radius = 80; // Reduced from 120 to 100
    const cx = 200;
    const cy = 200;
    const sliceAngle = 360 / ITEMS.length;

    const rotation = useMotionValue(-22.5);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const previousVector = React.useRef({ x: 0, y: 0 });
    const lastVelocity = useRef(0);
    const lastTime = useRef(0);
    const boundaryRef = useRef(0);

    // ... (Helper functions: getAngle, getVector unchanged) ...
    // Re-implementing helper to be safe since I'm replacing the whole file structure logic if needed, 
    // but I will stick to minimal diffs if possible. 
    // Wait, I need to preserve the exact physics tunings from previous steps. 
    // I'll copy them carefully.

    // Helper: Get vector from center
    const getVector = (clientX: number, clientY: number, centerRect: DOMRect) => {
        const centerX = centerRect.left + centerRect.width / 2;
        const centerY = centerRect.top + centerRect.height / 2;
        return { x: clientX - centerX, y: clientY - centerY };
    };

    const onPointerDown = (e: React.PointerEvent) => {
        if (!containerRef.current || !wheelRef.current) return;
        isDragging.current = true;
        (e.currentTarget as Element).setPointerCapture(e.pointerId); // Capture on Wrapper!
        rotation.stop();
        const rect = wheelRef.current.getBoundingClientRect();
        previousVector.current = getVector(e.clientX, e.clientY, rect);
        lastVelocity.current = 0;
        lastTime.current = performance.now();
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || !containerRef.current || !wheelRef.current) return;
        e.preventDefault();

        // Always measure center from the Wheel
        const rect = wheelRef.current.getBoundingClientRect();
        const currentVector = getVector(e.clientX, e.clientY, rect);
        const prev = previousVector.current;

        // Calculate angle change using Cross Product and Dot Product
        const cross = prev.x * currentVector.y - prev.y * currentVector.x;
        const dot = prev.x * currentVector.x + prev.y * currentVector.y;
        const deltaRad = Math.atan2(cross, dot);
        const deltaDeg = deltaRad * (180 / Math.PI);

        const currentRot = rotation.get();
        rotation.set(currentRot + deltaDeg);

        // Velocity calc
        const now = performance.now();
        const dt = now - lastTime.current;
        if (dt > 0) {
            lastVelocity.current = deltaDeg / dt;
        }
        lastTime.current = now;

        previousVector.current = currentVector;
    };

    const onPointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);

        // Mass Simulation: Ignore tiny slips
        const currentRot = rotation.get();
        let velocity = lastVelocity.current * 1000; // deg per sec

        // Threshold for "Mass": If slow, stop immediately (no fling)
        if (Math.abs(velocity) < 100) {
            velocity = 0;
        }

        // High Friction / "Mechanical" Feel
        const power = 0.2; // Very high friction
        const estimatedEndRotation = currentRot + velocity * power;

        // Snap to nearest 45deg
        const offset = 22.5;
        const grid = 45;
        const snappedRotation = Math.round((estimatedEndRotation + offset) / grid) * grid - offset;

        animate(rotation, snappedRotation, {
            type: "spring",
            stiffness: 40,
            damping: 40,
            mass: 3,
            restSpeed: 0.1
        });
    };

    // Sync Winning Prize based on rotation
    useEffect(() => {
        return rotation.on("change", (latest) => {
            const segmentAngle = 360 / ITEMS.length;
            const normalizedRotation = ((latest % 360) + 360) % 360;
            const index = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
            setSelectedIndex(index);

            const boundaryTrack = Math.floor((normalizedRotation + segmentAngle / 2) / segmentAngle);
            if (boundaryTrack !== boundaryRef.current) {
                boundaryRef.current = boundaryTrack;
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(2);
                }
            }
        });
    }, [rotation]);

    const handleGo = () => {
        const selectedItem = ITEMS[selectedIndex];
        if (selectedItem) {
            console.log("Navigating to:", selectedItem.path);
            router.push(selectedItem.path);
        }
    };

    return (
        <div ref={containerRef} className={styles.container}>
            {/* Removed selection frame arrow as requested */}

            <motion.div
                ref={wheelRef} // Added ref here
                className={styles.wheelWrapper}
                style={{ rotate: rotation, touchAction: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <svg viewBox="120 120 160 160" className={styles.wheel}>
                    {/* Outer Circle Ring */}
                    <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

                    {ITEMS.map((item, index) => {
                        const startAngle = index * sliceAngle;
                        const midAngle = startAngle + sliceAngle / 2;
                        // ... calc ...
                        // Re-calculating coords for display
                        const radStart = (startAngle - 90) * (Math.PI / 180);
                        const x1 = cx;
                        const y1 = cy;
                        const x2 = cx + radius * Math.cos(radStart);
                        const y2 = cy + radius * Math.sin(radStart);

                        const radMid = (midAngle - 90) * (Math.PI / 180);
                        const textRadius = radius * 0.7;
                        const tx = cx + textRadius * Math.cos(radMid);
                        const ty = cy + textRadius * Math.sin(radMid);

                        const isActive = index === selectedIndex;

                        return (
                            <g key={item.label}>
                                <line
                                    x1={x1} y1={y1}
                                    x2={x2} y2={y2}
                                    stroke="rgba(255,255,255,0.5)"
                                    strokeWidth="1"
                                />
                                <text
                                    x={tx} y={ty}
                                    fill={isActive ? "#fff" : "rgba(255,255,255,0.5)"}
                                    fontSize={isActive ? "10" : "8"}
                                    fontWeight={isActive ? "700" : "500"}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{
                                        fontFamily: 'var(--font-geist-mono)',
                                        whiteSpace: 'nowrap',
                                        transformBox: 'fill-box',
                                        transformOrigin: 'center',
                                        transform: `rotate(${midAngle}deg)`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {item.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </motion.div>

            {/* GO BUTTON */}
            <button
                onClick={handleGo}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '12px 32px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '999px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    zIndex: 30, // Ensure it's above everything
                    pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
                GO
            </button>

        </div>
    );
}
