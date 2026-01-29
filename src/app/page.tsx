'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, useMotionValue, animate, useVelocity, useTransform } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
import { GalleryCell } from '@/components/grid/GalleryCell';
import { VaultCell } from '@/components/grid/VaultCell';
import BackgroundText from '@/components/layout/BackgroundText';
import { ARTISTS } from '@/data/content';

export default function Home() {
  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // Global Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // State for interactivity
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <BackgroundText />

        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => (
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
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center border border-white/5 bg-[#0c0c0c]/80 backdrop-blur-sm">
                {(() => {
                  // RE-MAPPING TO MATCH ORIGINAL
                  if (col === 0 && row === 0) return (
                    // HEADLINE
                    <div className="text-center select-none">
                      <h1 className="text-[12vw] font-[800] uppercase leading-[0.8] tracking-[-0.05em] text-[#ececec]">
                        Good<br />Company.
                      </h1>
                    </div>
                  );
                  if (col === 1 && row === 0) return (
                    // ROSTER
                    <div className="w-full pl-[15%] text-left select-none pointer-events-auto">
                      <p className="text-[#808080] text-xs tracking-[0.2em] mb-[4vh] uppercase font-mono">[ Roster_01.idx ]</p>
                      <ul className="p-0 list-none">
                        {ARTISTS.map(artist => (
                          <li key={artist.id} className="mb-[1vh]">
                            <button
                              className="bg-none border-none text-[#ececec] text-[3vw] font-normal font-mono cursor-pointer uppercase opacity-70 hover:opacity-100 transition-opacity tracking-[-0.03em]"
                              onClick={(e) => { e.stopPropagation(); setActiveArtist(artist); }}
                            >
                              {artist.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                  if (col === 2 && row === 0) return <VaultCell />;

                  if (col === 0 && row === 1) return <GalleryCell x={x} y={y} size={{ w: width, h: height }} isZoomedOut={isOverview} />;

                  if (col === 1 && row === 1) return (
                    // SOCIALS
                    <div className="w-full max-w-[350px] flex flex-col pointer-events-auto items-center justify-center">
                      <div className="text-[#808080] font-mono text-sm py-5 border-b border-[#1a1a1a] w-full text-center">INSTAGRAM</div>
                      <div className="text-[#808080] font-mono text-sm py-5 border-b border-[#1a1a1a] w-full text-center">SPOTIFY</div>
                    </div>
                  );

                  if (col === 2 && row === 1) return (
                    // STUDIO
                    <div className="w-full h-full flex flex-col items-center justify-center font-mono pointer-events-auto">
                      <div className="border border-[#333] p-4 text-xs tracking-widest">[ STUDIO SESSION PREVIEW ]</div>
                    </div>
                  );

                  if (col === 0 && row === 2) return (
                    // DATES
                    <div className="w-full px-[10%] font-mono text-[#ececec]">
                      <div className="border-b border-[#333] pb-2 mb-2 grid grid-cols-3 text-xs text-[#808080]"><span>DATE</span><span className="text-center">CITY</span><span className="text-right">VENUE</span></div>
                      <div className="grid grid-cols-3 text-sm py-2"><span>22.03.26</span><span className="text-center">BERLIN</span><span className="text-right text-[#888]">KANTINE</span></div>
                    </div>
                  );

                  if (col === 1 && row === 2) return (
                    // SIGNAL
                    <div className="w-full max-w-[400px] flex flex-col gap-8 font-mono text-[#ececec] pointer-events-auto p-10">
                      <div className="text-xs opacity-50 tracking-[0.2em]">SIGNAL STATUS: ACTIVE</div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs tracking-widest">SOURCE_ID:</label>
                        <div className="border-b border-[#ececec] py-1 text-sm opacity-50">YOUR MAIL</div>
                      </div>
                    </div>
                  );

                  if (col === 2 && row === 2) return <div className="font-mono text-xs tracking-widest opacity-50">IMPRINT // SONIC VOID</div>;

                  return null;
                })()}
              </div>
            </GridItem>
          ))
        )}

      </motion.div>

      {/* Overview Toggle */}
      <button
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition text-white"
        onClick={() => setIsOverview(!isOverview)}
      >
        {isOverview ? 'Close View' : 'Overview'}
      </button>

    </main>
  );
}