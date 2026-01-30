'use client';
import React from 'react';

export default function Noise() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9000] opacity-[0.04] mix-blend-overlay overflow-hidden">
            {/* Wir nutzen Tailwind für das Bild. Falls das SVG nicht lädt, sieht man einfach kein Rauschen, aber es crasht nicht. */}
            <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] animate-noise bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
}