'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, useMotionValue, animate, useVelocity, useTransform } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
import { GalleryCell } from '@/components/grid/GalleryCell';
import { VaultCell } from '@/components/grid/VaultCell';
import BackgroundText from '@/components/layout/BackgroundText';
import { ARTISTS, PROJECTS } from '@/data/content';

export default function Home() {
  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // Global Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // State for interactivity
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);
  const [activeArtist, setActiveArtist] = useState<any | null>(null);

  // Drag Physics
  const onPan = (e: any, info: any) => {
    // Direct link
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);
  };

  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      // Infinite Glide
      animate(x, x.get() + vX * 0.5, { type: 'decay', velocity: vX, power: 0.8 });
      animate(y, y.get() + vY * 0.5, { type: 'decay', velocity: vY, power: 0.8 });
    } else {
      // Snap Logic 
      const pX = x.get() + vX * 0.2; // Predicted resting point
      const pY = y.get() + vY * 0.2;

      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  if (!width) return <div className="bg-neutral-950 w-screen h-screen" />;

  return (
    <main className="fixed inset-0 bg-[#0c0c0c] text-[#ececec] overflow-hidden touch-none font-mono selection:bg-red-500 selection:text-white">

      {/* Global Container with Pan Handler */}
      <motion.div
        className="relative w-full h-full"
        onPan={onPan}
        onPanEnd={onPanEnd}
        animate={{ scale: isOverview ? 0.25 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Updated easing
      >
        <BackgroundText />

        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
            // Find project for this cell if it exists in data logic
            // Or map specific components

            return (
              <GridItem
                key={`${row}-${col}`}
                row={row}
                col={col}
                x={x}
                y={y}
                width={width}
                height={height}
                isZoomedOut={isOverview}
                onDoubleClick={() => setIsOverview(!isOverview)}
              >
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c0c0c] border border-white/5">
                  {/* FULL COVER BACKGROUND MEDIA (If Applicable) */}
                  {/* Logic: Check which cell it is and render appropriate rich media */}

                  {(() => {
                    // (0,0) Headline
                    if (col === 0 && row === 0) return (
                      <div className="text-center select-none z-10">
                        <h1 className="text-[12vw] font-[800] uppercase leading-[0.8] tracking-[-0.05em] text-[#ececec] mix-blend-difference">
                          Good<br />Company.
                        </h1>
                        {/* Abstract Video BG for this tile? */}
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10 pointer-events-none">
                          <source src="https://cdn.dribbble.com/users/32512/screenshots/16287950/media/f57e296865df3c3c7344933a39e248b9.mp4" type="video/mp4" />
                        </video>
                      </div>
                    );

                    // (1,0) Roster
                    if (col === 1 && row === 0) return (
                      <div className="w-full h-full relative">
                        {/* BG Image */}
                        <img src={PROJECTS[1].src} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

                        <div className="absolute inset-0 w-full pl-[15%] flex flex-col justify-center text-left select-none pointer-events-auto">
                          <p className="text-[#808080] text-xs tracking-[0.2em] mb-[4vh] uppercase font-mono">[ Roster_01.idx ]</p>
                          <ul className="p-0 list-none">
                            {ARTISTS.map(artist => (
                              <li key={artist.id} className="mb-[1vh]">
                                <button
                                  className="bg-none border-none text-[#ececec] text-[3vw] font-normal font-mono cursor-pointer uppercase opacity-70 hover:opacity-100 hover:text-white transition-all tracking-[-0.03em]"
                                  onClick={(e) => { e.stopPropagation(); setActiveArtist(artist); }}
                                >
                                  {artist.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );

                    // (2,0) Vault
                    if (col === 2 && row === 0) return <VaultCell />;

                    // (0,1) Gallery (Special Component)
                    if (col === 0 && row === 1) return <GalleryCell x={x} y={y} size={{ w: width, h: height }} isZoomedOut={isOverview} />;

                    // (1,1) Socials
                    if (col === 1 && row === 1) return (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <img src={PROJECTS[4].src} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
                        <div className="w-full max-w-[350px] flex flex-col pointer-events-auto relative z-10">
                          <div className="text-[#ececec] font-mono text-xl py-6 border-b border-white/20 w-full text-center hover:bg-white/5 transition-colors cursor-pointer">INSTAGRAM</div>
                          <div className="text-[#ececec] font-mono text-xl py-6 border-b border-white/20 w-full text-center hover:bg-white/5 transition-colors cursor-pointer">SPOTIFY</div>
                        </div>
                      </div>
                    );

                    // (2,1) Studio
                    if (col === 2 && row === 1) return (
                      <div className="w-full h-full flex flex-col items-center justify-center font-mono pointer-events-auto bg-black border-l border-white/10 relative group">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[url('/images/noise.png')] mix-blend-overlay pointer-events-none"></div>
                        <div className="border border-[#333] p-4 text-xs tracking-widest text-neutral-500 group-hover:text-white transition-colors uppercase">[ STUDIO SESSION PREVIEW ]</div>
                        <div className="w-full h-full absolute inset-0 -z-10 bg-neutral-900 flex items-center justify-center overflow-hidden">
                          <iframe
                            width="100%" height="100%"
                            src="https://www.youtube.com/embed/6zMS8ZRzQ1o?controls=0&rel=0&autoplay=1&mute=1&loop=1&playlist=6zMS8ZRzQ1o"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="opacity-40 scale-150 pointer-events-none"
                          ></iframe>
                        </div>
                      </div>
                    );

                    // (0,2) Dates
                    if (col === 0 && row === 2) return (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <img src={PROJECTS[6].src} className="absolute inset-0 w-full h-full object-cover opacity-30" />

                        <div className="w-full px-[10%] font-mono text-[#ececec] relative z-10">
                          <div className="border-b border-white/30 pb-4 mb-4 grid grid-cols-3 text-xs tracking-widest text-[#808080]"><span>DATE</span><span className="text-center">CITY</span><span className="text-right">VENUE</span></div>
                          <div className="grid grid-cols-3 text-lg py-4 border-b border-white/10"><span>22.03.26</span><span className="text-center font-bold">BERLIN</span><span className="text-right text-[#888]">KANTINE</span></div>
                          <div className="grid grid-cols-3 text-lg py-4 border-b border-white/10 opacity-50"><span>24.03.26</span><span className="text-center font-bold">WIEN</span><span className="text-right text-[#888]">ARENA</span></div>
                          <div className="grid grid-cols-3 text-lg py-4 border-b border-white/10 opacity-50"><span>26.03.26</span><span className="text-center font-bold">PARIS</span><span className="text-right text-[#888]">TBA</span></div>
                        </div>
                      </div>
                    );

                    // (1,2) Signal
                    if (col === 1 && row === 2) return (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none">
                          <source src={PROJECTS[7].src} type="video/mp4" />
                        </video>
                        <div className="w-full max-w-[400px] flex flex-col gap-8 font-mono text-[#ececec] pointer-events-auto p-10 bg-black/50 backdrop-blur-md border border-white/10">
                          <div className="text-xs opacity-50 tracking-[0.2em] uppercase">Signal Status: Active</div>
                          <div className="flex flex-col gap-2">
                            <label className="text-xs tracking-widest">SOURCE_ID:</label>
                            <input type="text" placeholder="YOUR MAIL" className="bg-transparent border-b border-[#ececec] py-2 text-sm outline-none placeholder:opacity-30" />
                          </div>
                          <button className="self-start border border-white px-6 py-2 text-xs hover:bg-white hover:text-black transition-colors uppercase tracking-widest">[ TRANSMIT ]</button>
                        </div>
                      </div>
                    );

                    // (2,2) Imprint
                    if (col === 2 && row === 2) return (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <img src={PROJECTS[8].src} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50" />
                        <div className="font-mono text-xs tracking-widest opacity-50 relative z-10 text-center">
                          IMPRINT // LEGAL<br />
                          <span className="opacity-50 text-[10px] mt-4 block">©2026 GOOD COMPANY</span>
                        </div>
                      </div>
                    );

                    return null;
                  })()}
                </div>
              </GridItem>
            )
          })
        )}

      </motion.div>

      {/* Overview Toggle - Restored Styling & Z-Index */}
      <button
        className="fixed bottom-10 right-10 px-6 py-3 bg-neutral-900 border border-neutral-700 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#ececec] hover:bg-white hover:text-black transition-all shadow-2xl z-[100] cursor-pointer"
        onClick={(e) => { e.stopPropagation(); setIsOverview(!isOverview); }}
        onPointerDown={(e) => e.stopPropagation()} // Stop drag propagation
      >
        {isOverview ? 'Close View' : 'Overview'}
      </button>

    </main>
  );
}