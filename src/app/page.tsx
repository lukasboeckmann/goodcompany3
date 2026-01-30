'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
import BackgroundText from '@/components/layout/BackgroundText';
import { GalleryCell } from '@/components/grid/GalleryCell';
import { VaultCell } from '@/components/grid/VaultCell';

// Authentic Components (goodcompany2 Source)
import Headline from '@/components/content/Headline';
import Roster from '@/components/content/Roster';
import Socials from '@/components/content/Socials';
import Studio from '@/components/content/Studio';
import Dates from '@/components/content/Dates';
import Signal from '@/components/content/Signal';
import Imprint from '@/components/content/Imprint';

export default function Home() {
  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // Global Motion Values - Initialize to CENTER (Row 1, Col 1)
  // Logic: Viewport is at (0,0). To see (1,1), we must shift the WORLD by (-width, -height)
  // Wait for width/height to be available before setting logic, or use useEffect.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Center Initialization Effect
  React.useEffect(() => {
    if (width > 0 && height > 0) {
      x.set(-width);
      y.set(-height);
    }
  }, [width, height, x, y]);

  // Interaction State
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);

  // Drag Physics
  const onPan = (e: any, info: any) => {
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);
  };

  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      animate(x, x.get() + vX * 0.5, { type: 'decay', velocity: vX, power: 0.8 });
      animate(y, y.get() + vY * 0.5, { type: 'decay', velocity: vY, power: 0.8 });
    } else {
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    // Simple camera shift for navigation links (e.g. Signal)
    // Moving camera DOWN reveals content BELOW (so we add/subtract height effectively)
    // goodcompany2 logic: animate(y, y.get() - size.h)
    if (direction === 'down') {
      animate(y, y.get() - height, { type: 'spring', stiffness: 200, damping: 25 });
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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <BackgroundText />

        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
            const instanceId = `${row}-${col}`;

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
                <div className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c0c0c] border border-white/5 ${isOverview ? 'pointer-events-none' : 'pointer-events-auto'}`}>

                  {/* COMPONENT MAPPING (goodcompany2 Layout) */}
                  {(() => {
                    // (0,0) HEADLINE
                    if (col === 0 && row === 0) return <Headline />;

                    // (1,0) ROSTER
                    if (col === 1 && row === 0) return <Roster setActiveArtist={setActiveArtist} />;

                    // (2,0) VAULT
                    if (col === 2 && row === 0) return <VaultCell />;

                    // (0,1) GALLERY
                    if (col === 0 && row === 1) return <GalleryCell x={x} y={y} size={{ w: width, h: height }} isZoomedOut={isOverview} />;

                    // (1,1) SOCIALS & SHOP (Center)
                    if (col === 1 && row === 1) return <Socials onNavigate={handleNavigate} />;

                    // (2,1) STUDIO
                    if (col === 2 && row === 1) return <Studio activeStudioInstance={activeStudioInstance} setActiveStudioInstance={setActiveStudioInstance} instanceId={instanceId} isZoomedOut={isOverview} />;

                    // (0,2) DATES
                    if (col === 0 && row === 2) return <Dates />;

                    // (1,2) SIGNAL
                    if (col === 1 && row === 2) return <Signal />;

                    // (2,2) IMPRINT
                    if (col === 2 && row === 2) return <Imprint />;

                    return null;
                  })()}

                </div>
              </GridItem>
            )
          })
        )}

      </motion.div>

      {/* Overview Toggle */}
      <button
        className="fixed bottom-10 right-10 px-6 py-3 bg-neutral-900 border border-neutral-700 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#ececec] hover:bg-white hover:text-black transition-all shadow-2xl z-[100] cursor-pointer"
        onClick={(e) => { e.stopPropagation(); setIsOverview(!isOverview); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isOverview ? 'CLOSE VIEW' : 'OVERVIEW'}
      </button>

      {/* Artist Overlay (Simple Implementation) */}
      {activeArtist && (
        <div className="fixed inset-0 z-[200] bg-black/95 text-[#ececec] overflow-y-auto p-10 flex flex-col items-center">
          <button
            className="fixed top-10 right-10 text-[14px] font-mono tracking-widest hover:text-white text-neutral-500"
            onClick={() => setActiveArtist(null)}
          >
            [ CLOSE ]
          </button>
          <h2 className="text-[10vw] font-black uppercase leading-none mt-20 mb-10">{activeArtist.name}</h2>
          <div className="w-full max-w-[600px] aspect-[4/5] bg-neutral-900 mb-10">
            <img src={activeArtist.image} className="w-full h-full object-cover" />
          </div>
          <div className="w-full max-w-[600px] font-mono text-sm text-neutral-400 border-l border-neutral-800 pl-6">
            <p className="mb-4 text-xs text-neutral-600 uppercase tracking-widest">/ BIOGRAPHY</p>
            {activeArtist.bio}
          </div>
        </div>
      )}

    </main>
  );
}