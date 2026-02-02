'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
// WICHTIG: useVelocity und useSpring importiert für den Jelly-Effekt
import { motion, useMotionValue, animate, Transition, useTransform, useVelocity, useSpring } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';

// Helper Components
import Noise from '@/components/layout/Noise';
import CustomCursor from '@/components/layout/CustomCursor';

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

  // --- STATE MANAGEMENT ---
  const [isOverview, setIsOverview] = useState(true);
  const [isIntroSequence, setIsIntroSequence] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Interaction States
  const [activeArtist, setActiveArtist] = useState<any | null>(null);
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);
  const [activeVaultVideo, setActiveVaultVideo] = useState<string | null>(null);

  // --- INIT LOGIC & INTRO TIMER ---
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobile(true);
    }

    const introTimer = setTimeout(() => {
      setIsOverview(false); // Zoom rein!

      setTimeout(() => {
        setIsIntroSequence(false);
      }, 1800);

    }, 1000);

    return () => clearTimeout(introTimer);
  }, []);

  // --- GRID CONFIG ---
  // FIX: User requested 5x5, but 5 is not divisible by 3 (Content Cycle).
  // We use 6x6 (Indices -2 to 3) for Mobile, which matches the content cycle (6 % 3 == 0) and provides a larger buffer than 3x3.
  const renderIndices = useMemo(() => {
    if (isMobile) {
      return [-2, -1, 0, 1, 2, 3]; // Length 6
    }
    const range = 4; // Desktop: Range 4 -> 9 items (-4 to 4)
    return Array.from({ length: range * 2 + 1 }, (_, i) => i - range);
  }, [isMobile]);

  const TOTAL_COLS = renderIndices.length;
  const TOTAL_ROWS = renderIndices.length;

  // --- MOTION VALUES & PHYSICS ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // ⚡ 1. JELLY EFFECT (SKEW) ⚡
  // Wir messen die Geschwindigkeit und verwandeln sie in Neigung
  const xVelocity = useVelocity(x);
  const rawSkew = useTransform(xVelocity, [-1000, 1000], [2, -2]);
  const skewX = useSpring(rawSkew, { mass: 0.1, stiffness: 50, damping: 10 });

  // ⚡ 2. INFINITE PARALLAX LOGIC (3x3 GRID) ⚡
  const spacingX = width ? width * 1.6 : 1000;
  const spacingY = height ? height * 1.6 : 1000;

  const bgX = useTransform(x, (value) => (value * 0.15) % spacingX);
  const bgY = useTransform(y, (value) => (value * 0.15) % spacingY);

  const bgIndices = [-1, 0, 1];

  // --- PHYSICS LOGIC ---
  const directionLock = useRef<'x' | 'y' | null>(null);
  const isDragging = useRef(false);

  const onPanStart = () => {
    if (isIntroSequence) return;
    x.stop();
    y.stop();
    directionLock.current = null;
    isDragging.current = true;
  };

  const onPan = (e: any, info: any) => {
    if (isIntroSequence) return;
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
      x.set(x.get() + info.delta.x * factor);
      y.set(y.get() + info.delta.y * factor);
    }
  };

  const onPanEnd = (e: any, info: any) => {
    if (isIntroSequence) return;
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      const factor = 2.5;
      animate(x, x.get() + (vX * factor) * 0.5, { type: 'decay', velocity: vX * factor, power: 0.8 });
      animate(y, y.get() + (vY * factor) * 0.5, { type: 'decay', velocity: vY * factor, power: 0.8 });
    } else {
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleNavigate = (direction: 'up' | 'down') => {
    if (direction === 'down') {
      animate(y, y.get() - height, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  // --- TRANSITIONS ---
  const smoothTransition: Transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };
  const actionZoomTransition: Transition = { duration: 1.8, ease: [0.85, 0, 0.2, 1.2] };

  // SAFETY CHECK
  if (!width) return <div className="fixed inset-0 bg-[#0c0c0c]" />;

  return (
    <main
      className="fixed inset-0 bg-[#0c0c0c] text-[#ececec] overflow-hidden font-mono"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        pointerEvents: isIntroSequence ? 'none' : 'auto'
      }}
    >
      {/* VIBE LAYERS */}
      {!isMobile && <Noise />}
      <CustomCursor />

      {/* ⚡ INFINITE PARALLAX BACKGROUND (3x3 Grid) ⚡ */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {bgIndices.map((rowOffset) =>
          bgIndices.map((colOffset) => (
            <motion.div
              key={`bg-${rowOffset}-${colOffset}`}
              className="absolute flex items-center justify-center w-full h-full"
              style={{
                x: bgX,
                y: bgY,
                left: colOffset * spacingX,
                top: rowOffset * spacingY,
                width: width,
                height: height
              }}
            >
              <h1
                // FIX: 'text-white opacity-5' statt Hex-Code mit Slash
                className="text-[12vw] font-black text-white opacity-5 whitespace-nowrap tracking-tighter leading-none"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                }}
              >
                GOOD COMPANY
              </h1>
            </motion.div>
          ))
        )}
      </div>

      {/* THE GRID */}
      <motion.div
        className="relative w-full h-full cursor-grab active:cursor-grabbing z-10"
        style={{ transformOrigin: 'center center' }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}

        initial={{ scale: 0.25 }}
        animate={{ scale: isOverview ? 0.25 : 1 }}
        transition={isIntroSequence ? actionZoomTransition : smoothTransition}
      >
        {renderIndices.map(row =>
          renderIndices.map(col => {

            const contentRow = ((row % 3) + 3) % 3;
            const contentCol = ((col % 3) + 3) % 3;
            const instanceId = `${row}-${col}`;
            const isGallery = contentRow === 1 && contentCol === 0;

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
                zIndex={isGallery ? 20 : 10}

                onClickCapture={(e) => {
                  if (isIntroSequence || isDragging.current) {
                    e.stopPropagation();
                    return;
                  }

                  if (isOverview) {
                    e.stopPropagation();
                    setIsOverview(false); // Zoom in!

                    const targetX = -(col * width);
                    const targetY = -(row * height);
                    const totalW = width * TOTAL_COLS;
                    const totalH = height * TOTAL_ROWS;
                    const currentX = x.get();
                    const currentY = y.get();

                    const nearestX = targetX + Math.round((currentX - targetX) / totalW) * totalW;
                    const nearestY = targetY + Math.round((currentY - targetY) / totalH) * totalH;

                    animate(x, nearestX, { type: 'spring', stiffness: 200, damping: 30 });
                    animate(y, nearestY, { type: 'spring', stiffness: 200, damping: 30 });
                  }
                }}

                onDoubleClick={() => {
                  if (isIntroSequence || isDragging.current) return;
                  if (!isOverview) setIsOverview(true);
                }}
              >
                {/* ⚡ 3. FRAME WRAPPER (Schwarzer Hintergrund) ⚡ */}
                {/* Das verhindert, dass der Hintergrund durchscheint, wenn die Scale != 1 ist */}
                <div className="w-full h-full bg-[#0c0c0c]">

                  {/* ANIMIERTER CONTENT MIT JELLY & ZOOM */}
                  <motion.div
                    className={`w-full h-full relative ${isGallery ? 'overflow-visible' : 'overflow-hidden'} flex items-center justify-center bg-[#0c0c0c]/95 border border-white/5 ${isOverview ? 'cursor-pointer' : ''}`}

                    // JELLY EFFECT & GPU FIX
                    style={{
                      skewX: isMobile ? 0 : skewX,
                      // Anti-Flicker:
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      // HIER DIE ÄNDERUNG: Framer-Syntax statt CSS-String
                      z: 0,
                      willChange: 'transform'
                    }}
                    // HOVER ZOOM (1.05)
                    whileHover={isOverview ? { scale: 1.05, borderColor: "rgba(255,255,255,0.4)", zIndex: 10 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      if (contentRow === 0) {
                        if (contentCol === 0) return <Headline />;
                        if (contentCol === 1) return <Roster setActiveArtist={setActiveArtist} />;
                        if (contentCol === 2) return <VaultCell activeVideo={activeVaultVideo} setActiveVideo={setActiveVaultVideo} />;
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
                  </motion.div>
                </div>
              </GridItem>
            )
          })
        )}
      </motion.div>

      {/* OVERVIEW BUTTON */}
      {!isIntroSequence && !activeArtist && !activeVaultVideo && (
        <div className="fixed top-10 right-10 z-[10000] animate-in fade-in duration-1000" style={{ pointerEvents: 'auto' }}>
          <button
            className="text-[12px] font-mono font-bold tracking-[0.2em] text-neutral-500 hover:text-[#ececec] transition-colors cursor-pointer uppercase select-none"
            onClick={(e) => {
              e.stopPropagation();

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
      )}

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
            <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter mt-12 mb-12 text-center text-white">
              {activeArtist.name}
            </h2>

            <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
              <div className="w-full aspect-[3/4] bg-neutral-900 relative transition-all duration-700">
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

              <div className="flex flex-col w-full font-mono text-left">
                <div
                  className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase border-b border-white/10 pb-2"
                  style={{ marginBottom: '2rem' }}
                >
                  / Biography
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed text-neutral-300"
                  style={{ marginBottom: '2rem' }}
                >
                  {activeArtist.bio || "No biography available yet."}
                </p>

                {activeArtist.links && activeArtist.links.length > 0 && (
                  <>
                    <div
                      className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase border-b border-white/10 pb-2"
                      style={{ marginBottom: '2rem' }}
                    >
                      / Connect
                    </div>
                    <div
                      className="flex flex-row gap-6 flex-wrap justify-center"
                      style={{ paddingBottom: '3rem' }}
                    >
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