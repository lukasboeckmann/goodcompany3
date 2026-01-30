'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
import BackgroundText from '@/components/layout/BackgroundText';
import { GalleryCell } from '@/components/grid/GalleryCell';
import { VaultCell } from '@/components/grid/VaultCell';

// Authentic Components Imports
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

  // --- KONFIGURATION UNENDLICHE TAPETE ---
  // Range 3 = Wir rendern von -3 bis +3 (7x7 Grid = 49 Kacheln)
  // Das reicht aus, um bei Zoom 0.25 den ganzen Screen zu füllen.
  const RANGE = 3;
  const renderIndices = Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE); // z.B. [-3, -2, -1, 0, 1, 2, 3]
  const TOTAL_COLS = renderIndices.length;
  const TOTAL_ROWS = renderIndices.length;

  // Global Motion Values - Start bei 0 (Mitte)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Interaction State
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);

  // --- PHYSIK LOGIK ---
  const onPan = (e: any, info: any) => {
    // Im Overview-Modus (Zoom) bewegen wir uns schneller (Faktor 2.5),
    // damit es sich nicht zäh anfühlt.
    const factor = isOverview ? 2.5 : 1;
    x.set(x.get() + info.delta.x * factor);
    y.set(y.get() + info.delta.y * factor);
  };

  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      // Flugmodus: Weiches Ausgleiten mit Faktor-Korrektur
      const factor = 2.5;
      animate(x, x.get() + (vX * factor) * 0.5, { type: 'decay', velocity: vX * factor, power: 0.8 });
      animate(y, y.get() + (vY * factor) * 0.5, { type: 'decay', velocity: vY * factor, power: 0.8 });
    } else {
      // Detailmodus: Einrasten (Snapping) auf die Kachel
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    // Navigation Logik (z.B. für Socials Link)
    if (direction === 'down') {
      animate(y, y.get() - height, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  // Safety Check: Keine Breite -> Ladescreen (verhindert Glitches)
  if (!width) return <div className="fixed inset-0 bg-[#0c0c0c]" />;

  return (
    <main
      className="fixed inset-0 bg-[#0c0c0c] text-[#ececec] overflow-hidden font-mono"
      // Inline Styles, um Browser-Verhalten sicher zu killen
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
    >

      {/* Global Container with Pan Handler */}
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        style={{ transformOrigin: 'center center' }}
        onPanStart={() => { x.stop(); y.stop(); }} // Stoppt Zittern beim Greifen
        onPan={onPan}
        onPanEnd={onPanEnd}
        animate={{ scale: isOverview ? 0.25 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <BackgroundText />

        {/* --- INFINITE GRID RENDERER --- */}
        {renderIndices.map(row =>
          renderIndices.map(col => {
            const instanceId = `${row}-${col}`;

            // WARP MATHEMATIK:
            // Wir wandeln die unendlichen Koordinaten (z.B. -3, 7, 99) 
            // immer sauber in 0, 1, 2 um, damit sich der Inhalt wiederholt.
            const contentRow = ((row % 3) + 3) % 3;
            const contentCol = ((col % 3) + 3) % 3;

            return (
              <GridItem
                key={`${row}-${col}`}
                row={row}
                col={col}
                x={x}
                y={y}
                width={width}
                height={height}
                // Übergabe der Welt-Größe an das Item
                totalGridCols={TOTAL_COLS}
                totalGridRows={TOTAL_ROWS}
                isZoomedOut={isOverview}
                onDoubleClick={() => setIsOverview(!isOverview)}
              >
                <div className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c0c0c] border border-white/5 ${isOverview ? 'pointer-events-none' : 'pointer-events-auto'}`}>

                  {/* COMPONENT MAPPING (Original Logic) */}
                  {(() => {
                    // (0,0) HEADLINE
                    if (contentCol === 0 && contentRow === 0) return <Headline />;

                    // (1,0) ROSTER
                    if (contentCol === 1 && contentRow === 0) return <Roster setActiveArtist={setActiveArtist} />;

                    // (2,0) VAULT
                    if (contentCol === 2 && contentRow === 0) return <VaultCell />;

                    // (0,1) GALLERY
                    if (contentCol === 0 && contentRow === 1) return <GalleryCell x={x} y={y} size={{ w: width, h: height }} isZoomedOut={isOverview} />;

                    // (1,1) SOCIALS (Center)
                    if (contentCol === 1 && contentRow === 1) return <Socials onNavigate={handleNavigate} />;

                    // (2,1) STUDIO
                    if (contentCol === 2 && contentRow === 1) return <Studio activeStudioInstance={activeStudioInstance} setActiveStudioInstance={setActiveStudioInstance} instanceId={instanceId} isZoomedOut={isOverview} />;

                    // (0,2) DATES
                    if (contentCol === 0 && contentRow === 2) return <Dates />;

                    // (1,2) SIGNAL
                    if (contentCol === 1 && contentRow === 2) return <Signal />;

                    // (2,2) IMPRINT
                    if (contentCol === 2 && contentRow === 2) return <Imprint />;

                    return null;
                  })()}

                </div>
              </GridItem>
            )
          })
        )}

      </motion.div>

      {/* Overview Toggle Button */}
      <div className="fixed bottom-10 right-10 z-[10000]" style={{ pointerEvents: 'auto' }}>
        <button
          className="px-6 py-3 bg-neutral-900 border border-neutral-700 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-[#ececec] hover:bg-white hover:text-black transition-all shadow-2xl cursor-pointer"
          onClick={(e) => { e.stopPropagation(); setIsOverview(!isOverview); }}
          onPointerDown={(e) => e.stopPropagation()} // Verhindert Drag-Start beim Klicken
        >
          {isOverview ? 'CLOSE VIEW' : 'OVERVIEW'}
        </button>
      </div>

      {/* Artist Overlay (Original Code restored) */}
      {activeArtist && (
        <div className="fixed inset-0 z-[200] bg-black/95 text-[#ececec] overflow-y-auto p-10 flex flex-col items-center">
          <button
            className="fixed top-10 right-10 text-[14px] font-mono tracking-widest hover:text-white text-neutral-500 cursor-pointer"
            onClick={() => setActiveArtist(null)}
          >
            [ CLOSE ]
          </button>
          <h2 className="text-[10vw] font-black uppercase leading-none mt-20 mb-10">{activeArtist.name}</h2>
          <div className="w-full max-w-[600px] aspect-[4/5] bg-neutral-900 mb-10">
            <img src={activeArtist.image} className="w-full h-full object-cover" alt={activeArtist.name} />
          </div>
          <div className="w-full max-w-[600px] font-mono text-sm text-neutral-400 border-l border-neutral-800 pl-6 mb-20">
            <p className="mb-4 text-xs text-neutral-600 uppercase tracking-widest">/ BIOGRAPHY</p>
            {activeArtist.bio}
          </div>
        </div>
      )}

    </main>
  );
}