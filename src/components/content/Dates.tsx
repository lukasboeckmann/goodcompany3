import React from 'react';
import { motion } from 'framer-motion';

export default function Dates() {
    return (
        <div className="w-full max-w-[1200px] px-[10%] pointer-events-auto">
            <div
                className="border-b border-[#333] grid grid-cols-3 font-mono text-[10px] text-[#808080]"
                style={{ paddingBottom: '4px', marginBottom: '8px' }}
            >
                <span className="text-left">DATE</span>
                <span className="text-center">CITY</span>
                <span className="text-right">VENUE</span>
            </div>
            {[
                { d: '22.03.26', c: 'BERLIN', v: 'KANTINE AM BERGHAIN', l: 'https://www.berghain.berlin/de/event/80471/' }
            ].map((date, i) => (
                <motion.a
                    key={i}
                    href={date.l}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid grid-cols-3 font-mono text-[14px] text-[#ececec] border-b border-white/5 cursor-pointer no-underline block"
                    style={{
                        paddingBottom: '16px',
                        marginBottom: '8px',
                        // OPTIMIZATION: Prevents text jitter/blur during scale
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }}
                    whileHover={{ scale: 0.99, opacity: 0.7 }} // Scale nur minimal (0.99), weniger ist oft mehr
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <span className="text-left">{date.d}</span>
                    <span className="text-center">{date.c}</span>
                    <span className="text-right text-[#888]">{date.v}</span>
                </motion.a>
            ))}
        </div>
    );
}
