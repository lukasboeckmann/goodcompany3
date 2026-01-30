import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Imprint() {
    const [audioEnabled, setAudioEnabled] = useState(false);
    const waveScale = 1; // Simplification: Passed from parent usually, static for now or use local internal state if needed

    return (
        <div
            className="pointer-events-auto w-full h-full relative flex flex-col items-center justify-center cursor-default"
            onClick={() => setAudioEnabled(true)}
        >
            {/* SONIC ELEMENT */}
            <div className="w-full h-[200px] flex items-center justify-center opacity-80 pointer-events-none">
                <svg width="400px" height="150px" viewBox="0 0 400 150" className="overflow-visible">
                    <motion.path
                        d="M0 75 Q 100 65, 200 75 T 400 75 T 600 75"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        style={{ scaleY: waveScale, originY: '50%', opacity: 0.6 }}
                        stroke="#ececec" strokeWidth="1" fill="none"
                    />
                    <motion.path
                        d="M0 75 Q 75 85, 150 75 T 300 75 T 450 75"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
                        style={{ scaleY: waveScale, originY: '50%', opacity: 0.4 }}
                        stroke="#ececec" strokeWidth="1" fill="none"
                    />
                </svg>
            </div>

            {/* SPOTIFY PLAYER */}
            <div
                className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[300px] h-[80px] transition-opacity duration-1000"
                style={{
                    opacity: audioEnabled ? 1 : 0,
                    pointerEvents: audioEnabled ? 'auto' : 'none',
                    filter: 'grayscale(1) invert(1) contrast(1.2)'
                }}
            >
                <iframe
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/artist/6eCZz1kzSVLeQy2YRTEtO7?utm_source=generator&theme=0"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>

            {!audioEnabled && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.3em] text-[#ececec] cursor-pointer opacity-70">
                    [ CLICK TO SYNC AUDIO ]
                </div>
            )}

            <div className="absolute bottom-[40px] right-[40px] text-right font-mono text-[10px] text-[#ececec] opacity-10 transition-opacity duration-300 hover:opacity-100 cursor-default uppercase">
                <div className="mb-[10px]">
                    <span className="cursor-pointer mr-[15px]">LEGAL_REF // IMPRINT</span>
                    <span className="cursor-pointer">DATA_PROT // PRIVACY</span>
                </div>
                <div className="tracking-[0.1em]">
                    ©2026 GOOD COMPANY. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
}
