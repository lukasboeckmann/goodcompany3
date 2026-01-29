'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const ARTISTS = [
    { name: "VELI", img: "https://picsum.photos/800/1200?grayscale&blur=2" },
    { name: "*MALIIIK", img: "https://picsum.photos/801/1200?grayscale&blur=2" },
    { name: "CUFFA", img: "https://picsum.photos/802/1200?grayscale&blur=2" },
    { name: "JAMAL", img: "https://picsum.photos/803/1200?grayscale&blur=2" }
];

export default function Roster() {
    const [active, setActive] = useState<number | null>(null);

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#0d1311] overflow-hidden">

            {/* Background Layer - The Reveal */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode='wait'>
                    {active !== null && (
                        <motion.div
                            key={active}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }} // Low opacity as requested
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        >
                            {/* Next/Image handling remote domains? Need config. using img for cleanliness in prototype */}
                            <img
                                src={ARTISTS[active].img}
                                alt=""
                                className="w-full h-full object-cover grayscale brightness-125 contrast-125"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Layer - The List */}
            <div className="relative z-10 flex flex-col items-start justify-center gap-2 p-8 w-full max-w-md">
                {ARTISTS.map((artist, i) => (
                    <motion.div
                        key={artist.name}
                        className="cursor-pointer"
                        onHoverStart={() => setActive(i)}
                        onHoverEnd={() => setActive(null)}
                        onTap={() => setActive(i === active ? null : i)} // Toggle on mobile
                    >
                        <motion.h2
                            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-white stroke-white"
                            style={{
                                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                                color: active === i ? 'white' : 'transparent'
                            }}
                            animate={{
                                x: active === i ? 20 : 0,
                                opacity: active !== null && active !== i ? 0.3 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {artist.name}
                        </motion.h2>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
