'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
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
import Noise from '@/components/layout/Noise';
import CustomCursor from '@/components/layout/CustomCursor';

export default function Home() {

  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // --- OPTIMIERUNG: Mobile Erkennung ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Checkt beim Laden, ob der Screen schmal ist (Handy)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  // --- CONFIG: Dynamische Grid-Größe ---
  // Desktop: Range 4 (9x9 = 81 Kacheln)
  // Mobile:  Range 2 (5x5 = 25 Kacheln) -> Spart massiv Akku/CPU
  const RANGE = isMobile ? 2 : 4;

  // useMemo verhindert Ruckler, da das Array nicht bei jedem Klick neu gebaut wird
  const renderIndices = useMemo(() => {
    return Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE);
  }, [RANGE]);

  const TOTAL_COLS = renderIndices.length;
  const TOTAL_ROWS = renderIndices.length;

  // Global Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // --- ACHSENSPERRE & DRAG STATE ---
  const directionLock = useRef<'x' | 'y' | null>(null);
  const isDragging = useRef(false);

  // Interaction State (Popups & Navigation)
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);

  // --- PHYSIK & LOGIK ---

  // 1. Pan Start
  const onPanStart = () => {
    x.stop();
    y.stop();
    directionLock.current = null;
    isDragging.current = true;
  };

  // 2. Pan Move (mit Achsensperre)
  const onPan = (e: any, info: any) => {
    const factor = isOverview ? 2.5 : 1;

    if (!isOverview) {
      if (!directionLock.current) {
        if (Math.abs(info.delta.x) > 1 || Math.abs(info.delta.y) > 1) {
          if (Math.abs(info.delta.x) > Math.abs(info.delta.y)) {
            directionLock.current = 'x';
          } else {
            directionLock.current = 'y';
          }
        }
      }

      if (directionLock.current === 'x') {
        x.set(x.get() + info.delta.x * factor);
      } else if (directionLock.current === 'y') {
        y.set(y.get() + info.delta.y * factor);
      } else {
        x.set(x.get() + info.delta.x * factor);
        y.set(y.get() + info.delta.y * factor);
      }

    } else {
      // Flugmodus (Overview): Alles erlaubt
      x.set(x.get() + info.delta.x * factor);
      y.set(y.get() + info.delta.y * factor);
    }
  };

  // 3. Pan End
  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      // Flugmodus Decay
      const factor = 2.5;
      animate(x, x.get() + (vX * factor) * 0.5, { type: 'decay', velocity: vX * factor, power: 0.8 });
      animate(y, y.get() + (vY * factor) * 0.5, { type: 'decay', velocity: vY * factor, power: 0.8 });
    } else {
      // Snap Grid
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }

    // Klick-Sperre kurz halten
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
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
      {/* --- PHANTOM LEVEL UPGRADES --- */}
      <Noise />
      <CustomCursor />
      {/* ----------------------------- */}

      {/* STATISCHER HINTERGRUND */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1
          className="text-[12vw] font-black text-[#1a1a1a] whitespace-nowrap tracking-tighter leading-none"
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
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
        onPanStart={onPanStart}
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

                // --- SMART CLICK LOGIK ---
                onClickCapture={(e) => {
                  if (isDragging.current) {
                    e.stopPropagation();
                    return;
                  }

                  if (isOverview) {
                    e.stopPropagation();
                    setIsOverview(false);

                    // A) Smart Snap Calculation
                    const targetX = -(col * width);
                    const targetY = -(row * height);

                    const totalW = width * TOTAL_COLS;
                    const totalH = height * TOTAL_ROWS;

                    const currentX = x.get();
                    const currentY = y.get();

                    // Finde die nächstgelegene Instanz dieser Kachel (Loop Logic)
                    const nearestX = targetX + Math.round((currentX - targetX) / totalW) * totalW;
                    const nearestY = targetY + Math.round((currentY - targetY) / totalH) * totalH;

                    animate(x, nearestX, { type: 'spring', stiffness: 200, damping: 30 });
                    animate(y, nearestY, { type: 'spring', stiffness: 200, damping: 30 });
                  }
                }}

                onDoubleClick={() => {
                  if (isDragging.current) return;
                  if (!isOverview) setIsOverview(true);
                }}
              >
                <div className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-[#0c0c0c]/95 border border-white/5 ${isOverview ? 'pointer-events-none' : 'pointer-events-auto'}`}>
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

      {/* OVERVIEW BUTTON - TOP RIGHT */}
      <div className="fixed top-10 right-10 z-[10000]" style={{ pointerEvents: 'auto' }}>
        <button
          className="text-[12px] font-mono font-bold tracking-[0.2em] text-neutral-500 hover:text-[#ececec] transition-colors cursor-pointer uppercase select-none"
          onClick={(e) => {
            e.stopPropagation();

            // Wenn wir schließen, snappen wir zum nächstgelegenen Rasterpunkt
            if (isOverview) {
              const currentX = x.get();
              const currentY = y.get();
              const snapX = Math.round(currentX / width) * width;
              const snapY = Math.round(currentY / height) * height;

              animate(x, snapX, { type: 'spring', stiffness: 200, damping: 30 });
              animate(y, snapY, { type: 'spring', stiffness: 200, damping: 30 });
            }

            setIsOverview(!isOverview);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isOverview ? '[ CLOSE ]' : '[ OVERVIEW ]'}
        </button>
      </div>

      {/* ARTIST OVERLAY */}
      {activeArtist && (
        <div className="fixed inset-0 z-[200] bg-[#0c0c0c] text-[#ececec] overflow-y-auto flex flex-col items-center animate-in fade-in duration-300">
          <button
            className="fixed top-8 right-8 text-[12px] font-mono tracking-[0.2em] text-neutral-500 hover:text-white transition-colors cursor-pointer z-50 uppercase"
            onClick={() => setActiveArtist(null)}
          >
            [ Close ]
          </button>

          <div className="w-full max-w-[1000px] p-6 md:p-12 flex flex-col items-center">
            <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mt-12 mb-12 text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
              {activeArtist.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              <div className="w-full aspect-[3/4] bg-neutral-900 relative grayscale hover:grayscale-0 transition-all duration-700">
                {activeArtist.image ? (
                  <img
                    src={activeArtist.image}
                    className="w-full h-full object-cover"
                    alt={activeArtist.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-800 font-mono text-xs">
                    NO IMAGE DATA
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-end font-mono">
                <div className="text-[10px] text-neutral-500 tracking-[0.2em] mb-4 uppercase border-b border-white/10 pb-2">
                  / Biography
                </div>
                <p className="text-sm md:text-base leading-relaxed text-neutral-300 mb-12">
                  {activeArtist.bio || "No biography available yet."}
                </p>

                {activeArtist.links && activeArtist.links.length > 0 && (
                  <>
                    <div className="text-[10px] text-neutral-500 tracking-[0.2em] mb-4 uppercase border-b border-white/10 pb-2">
                      / Connect
                    </div>
                    <div className="flex flex-col gap-2">
                      {activeArtist.links.map((link: any, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg hover:text-white text-neutral-400 uppercase tracking-tight flex items-center gap-2 group transition-all"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">→</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}