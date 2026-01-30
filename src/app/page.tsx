'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import useWindowSize from '@/hooks/useWindowSize';
import GridItem from '@/components/grid/GridItem';
// import BackgroundText from '@/components/layout/BackgroundText'; // Erst mal auskommentiert lassen zur Sicherheit

// Deine echten Komponenten wieder aktivieren!
/* import Headline from '@/components/content/Headline';
import Roster from '@/components/content/Roster';
...
*/

export default function Home() {
  const { width, height } = useWindowSize();
  const [isOverview, setIsOverview] = useState(false);

  // Start bei 0, damit wir mittig starten (Dank der Mathe in GridItem)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 1. DRAG LOGIK (Original Code für das "Gefühl")
  const onPan = (e: any, info: any) => {
    x.set(x.get() + info.delta.x);
    y.set(y.get() + info.delta.y);
  };

  const onPanEnd = (e: any, info: any) => {
    const vX = info.velocity.x;
    const vY = info.velocity.y;

    if (isOverview) {
      // Im Overview Modus: Freies Gleiten (Decay)
      animate(x, x.get() + vX * 0.5, { type: 'decay', velocity: vX, power: 0.8 });
      animate(y, y.get() + vY * 0.5, { type: 'decay', velocity: vY, power: 0.8 });
    } else {
      // Im Normal Modus: SNAPPING (Einrasten auf das Grid)
      const pX = x.get() + vX * 0.2;
      const pY = y.get() + vY * 0.2;
      const snapX = Math.round(pX / width) * width;
      const snapY = Math.round(pY / height) * height;

      animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
      animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
    }
  };

  if (!width) return <div style={{ background: 'black', color: 'white' }}>Loading...</div>;

  return (
    <main style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0c0c0c',
      color: '#ececec',
      overflow: 'hidden',
      touchAction: 'none',
      width: '100vw',
      height: '100vh'
    }}>

      {/* Debug Info (Kannst du später löschen) */}
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, color: 'lime', pointerEvents: 'none' }}>
        Version: FINAL FIX<br />
        Zoom: {isOverview ? 'ON' : 'OFF'}
      </div>

      <motion.div
        // 1. CSS FIX: select-none verhindert das Markieren
        // cursor-grab zeigt die Hand
        className="relative w-full h-full select-none cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: 'center center',
          touchAction: 'none' // Verhindert Browser-Scrollen auf Mobile
        }}

        // 2. STOP FIX: Sofort alte Animationen killen, wenn man anfasst
        onPanStart={() => {
          x.stop();
          y.stop();
        }}

        // 3. DRAG FIX: Deine Pan-Funktion (mit dem Faktor-Fix von vorhin integriert)
        onPan={(e, info) => {
          // Im Overview (0.25) müssen wir die Mausbewegung verstärken, 
          // sonst fühlt es sich an wie auf Glatteis.
          const factor = isOverview ? 2.5 : 1;

          x.set(x.get() + (info.delta.x * factor));
          y.set(y.get() + (info.delta.y * factor));
        }}

        onPanEnd={(e, info) => {
          const vX = info.velocity.x;
          const vY = info.velocity.y;

          if (isOverview) {
            // Weiches Gleiten im Overview
            animate(x, x.get() + vX * 0.5, { type: 'decay', velocity: vX, power: 0.8 });
            animate(y, y.get() + vY * 0.5, { type: 'decay', velocity: vY, power: 0.8 });
          } else {
            // Hartes Einrasten im Detail-View
            const pX = x.get() + vX * 0.2;
            const pY = y.get() + vY * 0.2;
            const snapX = Math.round(pX / width) * width;
            const snapY = Math.round(pY / height) * height;

            animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
            animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
          }
        }}

        animate={{ scale: isOverview ? 0.25 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* <BackgroundText /> */}

        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
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
                // Doppelklick für Zoom
                onDoubleClick={() => setIsOverview(!isOverview)}
              >
                {/* HIER JETZT DEINE ECHTEN KOMPONENTEN WIEDER REIN!
                   Für den Test lasse ich die Boxen noch kurz drin, 
                   aber du kannst das if/else Mapping hier wieder einfügen.
                */}
                <div style={{
                  width: '100%', height: '100%',
                  border: '1px solid #333',
                  backgroundColor: `hsl(${(row * 3 + col) * 40}, 50%, 10%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '3rem', fontWeight: 900, color: '#333'
                }}>
                  {row}-{col}
                </div>
              </GridItem>
            )
          })
        )}
        <motion.div
          // CLASSNAME FIX: Wir nutzen Tailwind Klassen, aber verlassen uns nicht nur auf sie.
          className="relative w-full h-full cursor-grab active:cursor-grabbing"

          // STYLE FIX (DAS IST DER SCHLÜSSEL!):
          style={{
            transformOrigin: 'center center',
            // Dies hier verbietet dem Browser das Scrollen/Wackeln
            touchAction: 'none',
            // Verhindert das Markieren von Text beim Ziehen
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}

          // EVENT FIX:
          onPanEnd={(e, info) => {
            const vX = info.velocity.x;
            const vY = info.velocity.y;

            if (isOverview) {
              // FLUMMI FIX: Wir verstärken auch den Schwung (Velocity) mit dem Faktor!
              // Sonst bremst es beim Loslassen abrupt ab.
              const factor = 2.5;

              animate(x, x.get() + (vX * factor) * 0.5, {
                type: 'decay',
                velocity: vX * factor, // <--- HIER ist der Trick!
                power: 0.8
              });

              animate(y, y.get() + (vY * factor) * 0.5, {
                type: 'decay',
                velocity: vY * factor, // <--- Auch hier!
                power: 0.8
              });

            } else {
              // Normaler Modus (Snapping) bleibt wie er ist
              const pX = x.get() + vX * 0.2;
              const pY = y.get() + vY * 0.2;
              const snapX = Math.round(pX / width) * width;
              const snapY = Math.round(pY / height) * height;

              animate(x, snapX, { type: 'spring', stiffness: 200, damping: 25 });
              animate(y, snapY, { type: 'spring', stiffness: 200, damping: 25 });
            }
          }}
        ></motion.div>
      </motion.div>

      {/* OVERVIEW BUTTON FIX */}
      <button
        // stopPropagation verhindert, dass der Klick das Grid bewegt
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setIsOverview(!isOverview);
          console.log("Button Clicked");
        }}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          padding: '15px 30px',
          background: 'white',
          color: 'black',
          borderRadius: '50px',
          fontWeight: 'bold',
          zIndex: 10000,
          cursor: 'pointer',
          pointerEvents: 'auto', // WICHTIG!
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {isOverview ? 'CLOSE' : 'OVERVIEW'}
      </button>

    </main>
  );
}