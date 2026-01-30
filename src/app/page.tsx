'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
import BackgroundText from '@/components/layout/BackgroundText';

// Content Imports
import Headline from '@/components/content/Headline';
import Roster from '@/components/content/Roster';
import { GalleryCell } from '@/components/grid/GalleryCell';
import { VaultCell } from '@/components/grid/VaultCell';
import Socials from '@/components/content/Socials';
import Studio from '@/components/content/Studio';
import Dates from '@/components/content/Dates';
import Signal from '@/components/content/Signal';
import Imprint from '@/components/content/Imprint';

export default function Home() {
  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // --- DIE MAGISCHE 9 (Fix für doppelte Zeilen) ---
  // Range 4 bedeutet: Von -4 bis +4.
  // Das sind 9 Kacheln breit und hoch.
  // Da dein Content-Muster 3 Kacheln lang ist, passt es 3x perfekt hinein (3x3=9).
  // Ergebnis: Kein visueller Bruch an der Nahtstelle.
  const RANGE = 4;
  const renderIndices = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE); // [-4, ..., 4]
  const TOTAL_COLS = renderIndices.length; // 9
  const TOTAL_ROWS = renderIndices.length; // 9

  // Global Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Interaction State (Popups & Navigation)
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);

  // --- PHYSIK ---
  const onPan = (e: any, info: any) => {
    // Im Zoom schneller bewegen
    const factor = isOverview ? 2.5 : 1;
    x.set(x.get() + info.delta.x * factor);
    y.set(y.get() + info.delta.y * factor);
  };

  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      // Flugmodus (Decay)
      const factor = 2.5;
      animate(x, x.get() + (vX * factor) * 0.5, { type: 'decay', velocity: vX * factor, power: 0.8 });
      animate(y, y.get() + (vY * factor) * 0.5, { type: 'decay', velocity: vY * factor, power: 0.8 });
    } else {
      // Einrasten (Spring)
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    if (direction === 'down') {
      animate(y, y.get() - height, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  // Safety Loading
  if (!width) return <div className="fixed inset-0 bg-[#0c0c0c]" />;

  return (
    <main
      className="fixed inset-0 bg-[#0c0c0c] text-[#ececec] overflow-hidden font-mono"
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >

      {/* 1. DER ECHTE BACKGROUND TEXT (Wieder da!) */}
      {/* Wir legen ihn auf z-0 und machen ihn klicksicher */}
      {/* STATISCHER HINTERGRUND - UPDATED STYLE */}
      {/* STATISCHER HINTERGRUND MIT FADE-EFFEKT */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1
          className="text-[10vw] font-black text-[#1a1a1a] whitespace-nowrap tracking-tighter leading-none"
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            // DIE MAGIE: CSS Maske für den Fade-Out Effekt
            // Von 0% bis 15% wird es eingeblendet (transparent -> sichtbar)
            // Von 15% bis 85% ist es voll sichtbar
            // Von 85% bis 100% wird es ausgeblendet (sichtbar -> transparent)
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
          }}
        >
          GOOD COMPANY
        </h1>
      </div>

      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing z-10"
        style={{ transformOrigin: 'center center' }}
        onPanStart={() => { x.stop(); y.stop(); }}
        onPan={onPan}
        onPanEnd={onPanEnd}
        animate={{ scale: isOverview ? 0.25 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {renderIndices.map(row =>
          renderIndices.map(col => {

            const contentRow = ((row % 3) + 3) % 3;
            const contentCol = ((col % 3) + 3) % 3;
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
                totalGridCols={TOTAL_COLS}
                totalGridRows={TOTAL_ROWS}
                isZoomedOut={isOverview}
                onDoubleClick={() => setIsOverview(!isOverview)}
              >
                {/* 2. TRANSPARENZ FIX: 
                    Ändere bg-[#0c0c0c] zu bg-[#0c0c0c]/90 oder sogar bg-transparent,
                    damit man den BackgroundText sehen kann! 
                */}
                <div className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c0c0c]/50 border border-white/5 ${isOverview ? 'pointer-events-none' : 'pointer-events-auto'}`}>

                  {/* CONTENT MAPPING ... (bleibt gleich) */}
                  {(() => {
                    if (contentRow === 0) {
                      if (contentCol === 0) return <Headline />;
                      if (contentCol === 1) return <Roster setActiveArtist={setActiveArtist} />;
                      if (contentCol === 2) return <VaultCell />;
                    }
                    if (contentRow === 1) {
                      if (contentCol === 0) return <GalleryCell x={x} y={y} size={{ w: width, h: height }} isZoomedOut={isOverview} />;
                      if (contentCol === 1) return <Socials onNavigate={handleNavigate} />;
                      if (contentCol === 2) return <Studio activeStudioInstance={activeStudioInstance} setActiveStudioInstance={setActiveStudioInstance} instanceId={instanceId} isZoomedOut={isOverview} />;
                    }
                    if (contentRow === 2) {
                      if (contentCol === 0) return <Dates />;
                      if (contentCol === 1) return <Signal />;
                      if (contentCol === 2) return <Imprint />;
                    }
                    return null;
                  })()}

                </div>
              </GridItem>
            )
          })
        )}
      </motion.div>

      {/* Button & Overlay bleiben ... */}
      <div className="fixed bottom-10 right-10 z-[10000]" style={{ pointerEvents: 'auto' }}>
        <button
          className="px-6 py-3 bg-white text-black rounded-full text-[10px] font-bold tracking-widest cursor-pointer hover:bg-neutral-200 transition-colors shadow-2xl"
          onClick={(e) => { e.stopPropagation(); setIsOverview(!isOverview); }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isOverview ? 'CLOSE' : 'OVERVIEW'}
        </button>
      </div>

      {activeArtist && (
        // ... dein Artist Overlay Code ...
        <div className="fixed inset-0 z-[200] bg-black/95 text-[#ececec] overflow-y-auto p-10 flex flex-col items-center">
          {/* ... Inhalt ... */}
          <button
            className="fixed top-10 right-10 text-[14px] font-mono tracking-widest hover:text-white text-neutral-500 cursor-pointer"
            onClick={() => setActiveArtist(null)}
          >
            [ CLOSE ]
          </button>
          {/* Restliche Artist Infos rendern... */}
          <h2 className="text-[10vw] font-black uppercase leading-none mt-20 mb-10">{activeArtist.name}</h2>
          {/* ... */}
        </div>
      )}

    </main>

  );
}