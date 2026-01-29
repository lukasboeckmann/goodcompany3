'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, animate, PanInfo, AnimatePresence, useTransform, useVelocity, useSpring, MotionValue } from 'framer-motion';

// 1. SOULFUL PHYSICS (MAX SPEED - CRITICAL DAMPING)
const PHYSICS = { type: "spring" as const, stiffness: 700, damping: 60, mass: 1, restDelta: 0.5 };

// WRAPPED CELL COMPONENT
const WrappedCell = ({ x, y, cx, cy, size, children }: { x: MotionValue<number>, y: MotionValue<number>, cx: number, cy: number, size: { w: number, h: number }, children: React.ReactNode }) => {
  const periodW = size.w * 3;
  const periodH = size.h * 3;

  const xOffset = useTransform(x, (v) => {
    if (!periodW) return 0;
    const base = cx * size.w;
    const total = base + v;
    return (((total + 1.5 * size.w) % periodW + periodW) % periodW - 1.5 * size.w) - v;
  });

  const yOffset = useTransform(y, (v) => {
    if (!periodH) return 0;
    const base = cy * size.h;
    const total = base + v;
    return (((total + 1.5 * size.h) % periodH + periodH) % periodH - 1.5 * size.h) - v;
  });

  // INNER PARALLAX (Phantom.land)
  // Calculate the "visual position" on screen relative to center
  // screenX = x + xOffset. (This is 0 when centered)
  // We want the content to lag slightly behind the movement.
  // If the cell moves RIGHT (screenX increases), content should move LEFT (negative).
  const parallaxX = useTransform([x, xOffset], ([latestX, latestOffset]) => {
    return ((latestX as number) + (latestOffset as number)) * -0.05; // 5% lag
  });
  const parallaxY = useTransform([y, yOffset], ([latestY, latestOffset]) => {
    return ((latestY as number) + (latestOffset as number)) * -0.05;
  });


  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: size.w,
        height: size.h,
        x: xOffset,
        y: yOffset,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <motion.div style={{ width: '100%', height: '100%', pointerEvents: 'auto', x: parallaxX, y: parallaxY }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

const ARTISTS = [
  {
    id: 'veli',
    name: 'Veli',
    bio: 'The Visionary.',
    description: '',
    image: '/images/gallery_02.jpg', // Placeholder
    links: [
      { label: 'INSTAGRAM', url: 'https://www.instagram.com/theregularkid/' },
      { label: 'SPOTIFY', url: 'https://open.spotify.com/artist/0krepmcLvn5UqqtUuuu1ad' }
    ]
  },
  {
    id: 'maliiik',
    name: '*maliiik',
    bio: 'The Architect.',
    description: '',
    image: '/images/maliiik_profile.jpg', // Updated Profile
    links: [
      { label: 'INSTAGRAM', url: 'https://www.instagram.com/maliklangesi/' },
      { label: 'SPOTIFY', url: 'https://open.spotify.com/artist/63Oa7FWYtfPylgzUEWhZWd' }
    ]
  },
  {
    id: 'cuffa',
    name: 'cuffa',
    bio: 'The Sonic Force.',
    description: '',
    image: '/images/gallery_02.jpg', // Placeholder
    links: [
      { label: 'INSTAGRAM', url: 'https://www.instagram.com/cuffa._/' },
      { label: 'SPOTIFY', url: 'https://open.spotify.com/artist/7oy0mYkKqIvigHq4xeQYif' }
    ]
  },
  {
    id: 'jamal',
    name: 'jamal',
    bio: 'The Visual Poet.',
    description: '',
    image: 'https://berghain.berlin/media/images/Company_freestyle_Cover_Clean.width-1600.jpg', // Placeholder
    links: [
      { label: 'INSTAGRAM', url: 'https://www.instagram.com/jamalsrevengee/' },
      { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
    ]
  }
];

const GALLERY_IMAGES = [
  { id: '01', src: 'https://berghain.berlin/media/images/Company_freestyle_Cover_Clean.width-1600.jpg', caption: 'CLUB_NIGHT_001' },
  { id: '02', src: '/images/gallery_02.jpg', caption: 'THE_GANG' },
];

// --- ISOLATED COMPONENT: GALLERY CELL (0,1) ---
// --- ISOLATED COMPONENT: GALLERY CELL (0,1) ---
const GalleryCell = ({ x, y, size, isZoomedOut }: { x: any, y: any, size: { w: number, h: number }, isZoomedOut: boolean }) => {

  // PARALLAX ENGINE
  // 1. Modulo: Ensures values don't jump when the grid warps.
  // 2. Local Center: Normalized to -0.5 to 0.5 relative to the cell width.
  // 3. Spring: Smooths out any micro-jumps or frame variances.
  const pX = useTransform(x, (v: number) => {
    const w = size.w || 1;
    const norm = ((v % w) + w) % w; // 0 to w
    return (norm - w / 2); // -w/2 to w/2 (Local Center)
  });

  const pY = useTransform(y, (v: number) => {
    const h = size.h || 1;
    const norm = ((v % h) + h) % h;
    return (norm - h / 2);
  });

  const springConfig = { stiffness: 100, damping: 40, mass: 1 };
  const smoothX = useSpring(pX, springConfig);
  const smoothY = useSpring(pY, springConfig);

  // Zoom Scale Factor: Reduce parallax distance when zoomed out so it looks proportional
  const scale = isZoomedOut ? 0.25 : 1;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* VERTICAL TYPOGRAPHY */}
      <div style={{
        position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center',
        fontFamily: 'serif', fontStyle: 'italic', fontSize: '3vh', color: '#ececec', whiteSpace: 'nowrap', zIndex: 5, pointerEvents: 'none', mixBlendMode: 'difference'
      }}>
        COLLECTION_01 <span style={{ fontFamily: 'monospace', fontStyle: 'normal', fontSize: '10px', marginLeft: '20px', letterSpacing: '0.2em' }}>SUPERFLY</span>
      </div>

      {/* IMAGE 1 (Dominant Left) */}
      <motion.div
        style={{
          position: 'absolute', top: '10%', left: '15%', width: '55%', height: '70%',
          zIndex: 1,
          // Moves opposite to drag (classic parallax)
          x: useTransform(smoothX, (v: any) => v * -0.05 * scale),
          y: useTransform(smoothY, (v: any) => v * -0.05 * scale)
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <img src={GALLERY_IMAGES[0].src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }}></div>
        </div>
      </motion.div>

      {/* IMAGE 2 (Overlap Top Right) */}
      <motion.div
        style={{
          position: 'absolute', top: '15%', right: '5%', width: '38%', height: '40%',
          zIndex: 2,
          // Moves faster (closer layer)
          x: useTransform(smoothX, (v: any) => v * -0.12 * scale),
          y: useTransform(smoothY, (v: any) => v * -0.12 * scale)
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <img src={GALLERY_IMAGES[1].src} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }} />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)' }}></div>
        </div>
      </motion.div>

      {/* IMAGE 3 (Overlap Bottom Right - Zoomed Detail) */}
      <motion.div
        style={{
          position: 'absolute', bottom: '15%', right: '12%', width: '30%', height: '35%',
          zIndex: 3,
          // Moves fastest (closest layer)
          x: useTransform(smoothX, (v: any) => v * -0.2 * scale),
          y: useTransform(smoothY, (v: any) => v * -0.2 * scale)
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <img src={GALLERY_IMAGES[0].src} style={{ width: '150%', height: '150%', objectFit: 'cover', objectPosition: 'center', filter: 'grayscale(100%) contrast(1.2)' }} />
          <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
        </div>
      </motion.div>

    </div>
  );
};

// --- ISOLATED COMPONENT: VAULT CELL ---
const VAULT_FILES = [
  { type: 'VIDEO', name: 'STUDIO_SESSION_RAW.MP4', size: '42MB', url: '/videos/studio_session_raw.mp4' },
  { type: 'AUDIO', name: 'UNRELEASED_DEMO_V1.WAV', size: '12MB', url: '#' },
  { type: 'IMAGE', name: 'GOODCOMPANY_TOUR_POSTER.PDF', size: '05MB', url: '#' },
  { type: 'IMAGE', name: 'STAGE_DESIGN_SCHEMATICS.JPG', size: '08MB', url: '#' },
];

const VaultCell = () => {
  const [vaultInput, setVaultInput] = React.useState('');
  const [status, setStatus] = React.useState<'LOCKED' | 'DECRYPTING' | 'UNLOCKED'>('LOCKED');
  const [glitch, setGlitch] = React.useState(false);
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    if (vaultInput.toUpperCase().trim() === 'GOOD_VIBES') {
      setStatus('DECRYPTING');
      setTimeout(() => setStatus('UNLOCKED'), 1000);
    } else {
      setGlitch(true);
      setStatus('LOCKED'); // Ensure status reset
      setTimeout(() => {
        setGlitch(false);
        setVaultInput('');
      }, 500);
    }
  };

  // --- UNLOCKED: DIRECTORY VIEW ---
  // --- UNLOCKED: DIRECTORY VIEW (WHITE DESIGN) ---
  if (status === 'UNLOCKED') {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a', overflow: 'hidden', pointerEvents: 'auto' }}>

        {/* HEADER */}
        <div style={{ padding: '20px 20px 10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', flexShrink: 0 }}>
          <span style={{ fontFamily: 'monospace', color: '#ececec', fontSize: '12px', letterSpacing: '0.1em', opacity: 0.8 }}>VAULT_SESSION_LOG // STATUS: ENCRYPTED</span>
        </div>

        {/* SCROLLABLE FILE LIST */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px 0',
          WebkitOverflowScrolling: 'touch', // Smooth scroll iOS
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE
        }}>
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

          {VAULT_FILES.map((file, i) => (
            <div
              key={i}
              className="vault-item"
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid #1a1a1a',
                display: 'grid',
                gridTemplateColumns: '40px 1fr 50px',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onClick={(e) => { e.stopPropagation(); file.type === 'VIDEO' ? setActiveVideo(file.url) : null; }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* KOL 1: TYPE */}
              <span style={{ fontFamily: 'monospace', color: '#666', fontSize: '10px', textTransform: 'uppercase' }}>
                {file.type === 'VIDEO' ? 'MOV' : file.type === 'AUDIO' ? 'WAV' : file.type === 'TEXT' ? 'TXT' : 'PDF'}
              </span>

              {/* KOL 2: NAME */}
              <span style={{ fontFamily: 'monospace', color: '#ececec', fontSize: '13px', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.name}
              </span>

              {/* KOL 3: SIZE */}
              <span style={{ fontFamily: 'monospace', color: '#444', fontSize: '10px', textAlign: 'right' }}>
                {file.size}
              </span>
            </div>
          ))}

          <div style={{ padding: '40px 20px', fontFamily: 'monospace', color: '#333', fontSize: '10px', textAlign: 'center' }}>
            // END_OF_LOG
          </div>
        </div>

        {/* FOOTER: LOCK SYSTEM */}
        <div style={{ padding: '20px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'center', flexShrink: 0, background: '#0a0a0a', position: 'relative', zIndex: 30 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setStatus('LOCKED'); setVaultInput(''); setActiveVideo(null); }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ background: 'transparent', border: '1px solid #333', color: '#666', padding: '10px 20px', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.1em', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ececec'; e.currentTarget.style.color = '#ececec'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666'; }}
          >
            [ LOCK_SYSTEM ]
          </button>
        </div>

        {/* PREVIEW OVERLAY */}
        {activeVideo && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveVideo(null); }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ position: 'absolute', top: '20px', right: '20px', color: '#ececec', border: '1px solid #333', background: 'transparent', padding: '5px 10px', fontFamily: 'monospace', fontSize: '10px', cursor: 'pointer', zIndex: 60 }}
            >
              [ CLOSE_PREVIEW ]
            </button>

            {/* Minimalist Player */}
            {activeVideo === '#' ? (
              <div style={{ color: '#444', fontFamily: 'monospace', fontSize: '12px' }}>FILE_PREVIEW_NOT_AVAILABLE</div>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ border: '1px solid #333', padding: '20px', color: '#ececec', fontFamily: 'monospace', fontSize: '12px' }}>
                  [ PLAYING: {activeVideo.split('/').pop()} ]
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* ATMOSPHERE LAYER */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.1, fontFamily: 'monospace', fontSize: '10px' }}>unreleased_vinc_demo_v4.wav</div>
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', opacity: 0.1, fontFamily: 'monospace', fontSize: '10px' }}>studio_session_02_leak.mp4</div>
        <div style={{ position: 'absolute', top: '40%', right: '5%', opacity: 0.05, fontFamily: 'monospace', fontSize: '10px' }}>master_tapes_archive_001.zip</div>
      </div>

      {/* TERMINAL UI */}
      <div style={{ width: '300px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#888', letterSpacing: '0.1em' }}>
          {status === 'DECRYPTING' ? 'DECRYPTING_DATA_STREAM...' : 'ACCESS_RESTRICTED // ENTER_VAULT_KEY'}
        </span>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={vaultInput}
            disabled={status === 'DECRYPTING'}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onChange={(e) => setVaultInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') handleValidate();
            }}
            style={{
              width: '100%',
              background: 'transparent', border: 'none', borderBottom: '2px solid #ececec',
              color: glitch ? '#ff3333' : '#ececec', fontFamily: 'monospace', fontSize: '24px', outline: 'none',
              padding: '10px 0', letterSpacing: '0.2em',
              animation: glitch ? 'shake 0.3s ease-in-out' : 'none',
              opacity: status === 'DECRYPTING' ? 0.5 : 1
            }}
            spellCheck="false"
            autoComplete="off"
          />
          {/* ENTER BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); handleValidate(); }}
            style={{ position: 'absolute', right: 0, background: 'none', border: 'none', color: '#555', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', padding: '5px' }}
          >
            [ ENTER ]
          </button>
        </div>

        {/* DYNAMIC STATUS */}
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: glitch ? '#ff3333' : '#555', marginTop: '5px' }}>
          {glitch ? 'UNAUTHORIZED_ACCESS_DETECTED' : status === 'DECRYPTING' ? 'VERIFYING_HASH...' : 'CONNECTION_STABLE'}
        </span>

        {/* EXIT BUTTON (Mobile Focus Safety) */}
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.blur(); }}
          style={{ alignSelf: 'center', marginTop: '20px', background: 'transparent', border: 'none', color: '#333', fontFamily: 'monospace', fontSize: '10px', cursor: 'pointer' }}
        >
          [ EXIT_VAULT ]
        </button>
      </div>

    </div>
  );
};

// --- ISOLATED COMPONENT: BACKGROUND TEXT (FIXED SUBSTRATE) ---
// --- ISOLATED COMPONENT: BACKGROUND TEXT (FIXED SUBSTRATE) ---
// Infinite Pattern Trick: Use background-repeat with an SVG data URI
// --- ISOLATED COMPONENT: BACKGROUND TEXT (FIXED SUBSTRATE) ---
// Static Global Layer: Sits behind the grid, scaling with Zoom, but NOT warping with Drag.
// This creates the "Grid gliding over text" feel and eliminates jumping.
const BackgroundText = React.memo(() => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%', left: '14%', // Shifted to 14% as requested
        width: '100%', height: '100%', // Match container
        zIndex: -1,
        pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform'
      }}
    >
      <h1 style={{
        fontSize: '40vw', fontWeight: 900, color: '#ececec', opacity: 0.03,
        whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '-0.05em'
      }}>
        GOOD COMPANY
      </h1>
    </motion.div>
  );
});

export default function Home() {
  // ... rest of Home component
  const [size, setSize] = useState({ w: 0, h: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const [activeArtist, setActiveArtist] = useState<null | typeof ARTISTS[0]>(null);
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null); // Hover Spotlight
  const [activeStudioInstance, setActiveStudioInstance] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // 1A. ZOOM / BIRD'S EYE STATE
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Parallax Values (0.15 scale) & Blur
  const vx = useVelocity(x);
  const px = useTransform(x, v => v * 0.15);
  const vy = useVelocity(y);
  const py = useTransform(y, v => v * 0.15);
  const blur = useTransform(vx, [-1000, 0, 1000], [10, 0, 10]); // Dynamic Blur on Speed

  // 1b. AUDIO / REACTIVE STATE
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [galleryHover, setGalleryHover] = useState(false); // Gallery Speed Control
  const [activeImageId, setActiveImageId] = useState<string | null>(null); // Gallery Flash
  const velocitySum = useTransform(() => Math.abs(vx.get()) + Math.abs(vy.get()));
  const waveScale = useTransform(velocitySum, [0, 5000], [1, 6]); // 1x to 6x Amplitude (Subtler)

  // 1c. FILMSTRIP STATE
  const filmY = useMotionValue(0);
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);

  const currentPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isWarping = useRef(false);
  const isAnimating = useRef(false); // Delayed Warp Guard

  // TILT & SCALE (Global Grid Deformation)
  // Must be declared before early returns.
  const xVel = useVelocity(x);
  const yVel = useVelocity(y);

  const tiltX = useTransform(yVel, [-1000, 1000], [2, -2]);
  const tiltY = useTransform(xVel, [-1000, 1000], [-2, 2]);
  const scaleEffect = useTransform(useTransform(xVel, v => Math.abs(v)), [0, 2000], [1, 0.98]);

  useEffect(() => {
    const handleResize = () => {
      const s = { w: window.innerWidth * 0.9, h: window.innerHeight };
      setSize(s);
      sizeRef.current = s;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. DELAYED WARP MONITOR
  // (REMOVED: Infinite Wrapping is now handled by WrappedCell via useTransform)
  // We keep the Resize listener above, but remove the manual "Jump" logic.


  // 3. HANDLERS
  // 3. HANDLERS
  // 3. HANDLERS
  const handleDragEnd = (e: any, info: PanInfo) => {
    isDragging.current = false;
    const s = sizeRef.current;
    if (s.w === 0) return;

    // CONF_1: MOMENTUM CONTROL (Power)
    // Reduce power to stop "infinite rolling" (0.1 - 0.3 range)
    // Lower = stops faster.
    const POWER = 0.2;

    // CONF_2: PREDICT LANDING
    const predX = x.get() + info.velocity.x * POWER;
    const predY = y.get() + info.velocity.y * POWER;

    // CONF_3: SAMPLE GRID (Smart Snapping)
    // Snap to nearest cell size (s.w, s.h)
    const snapX = Math.round(predX / s.w) * s.w;
    const snapY = Math.round(predY / s.h) * s.h;

    // CONF_4: PHYSICS (Heavy & Premium - Phantom.land Style)
    // stiff 150 / damp 25 / mass 0.8 = Metallic, heavy, with subtle recoil.
    const SNAP_PHYSICS = { type: "spring", stiffness: 150, damping: 25, mass: 0.8, restDelta: 0.01 };

    isAnimating.current = true;

    Promise.all([
      animate(x, snapX, SNAP_PHYSICS as any),
      animate(y, snapY, SNAP_PHYSICS as any)
    ]).then(() => {
      // CONF_5: MODULO NORMALIZATION (The "Zeroing")
      // Reset coordinates to prevent "Astronomical Pixels" without visual jump.
      // Period is 3 * size.
      const periodW = s.w * 3;
      const periodH = s.h * 3;

      const currentX = x.get();
      const currentY = y.get();

      // Normalize to period range if we drifted too far
      if (Math.abs(currentX) > periodW) {
        const remainderX = currentX % periodW;
        x.jump(remainderX);
      }

      if (Math.abs(currentY) > periodH) {
        const remainderY = currentY % periodH;
        y.jump(remainderY);
      }

      isAnimating.current = false;
    });
  };

  const cells = React.useMemo(() => {
    if (size.w === 0) return [];

    const c = [];
    const cx = 0; // Fixed center for calculation logic if needed, but we loop 0..2
    const cy = 0;

    // Loop 0..2 for 3x3 Grid
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // CONTENT INDICES
        const contentX = i;
        const contentY = j;

        // Instance ID (Simplified for Wrapped Logic)
        const instanceId = `${i}-${j}`;

        c.push(
          <WrappedCell
            key={`${i}-${j}`}
            x={x} y={y}
            cx={i} cy={j}
            size={size}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: (contentX === 2 && contentY === 1 && size.w < 768) ? '0' : '40px',
                pointerEvents: isZoomedOut ? 'auto' : 'none',
                willChange: 'transform',
                border: isZoomedOut ? '1px solid rgba(255,255,255,0.15)' : 'none',
                borderRadius: isZoomedOut ? '10px' : '0px',
                transition: 'border 0.3s ease, border-radius 0.3s ease',
                cursor: isZoomedOut ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
              }}
              onDoubleClick={(e) => {
                if (isZoomedOut) {
                  // Quick fix: Double click to center THIS cell? 
                  // With continuous drag, "centering" means animating 'x' so this cell is at simple coords.
                  // For now, simpler to just enter zoom.
                  e.preventDefault();
                  e.stopPropagation();
                  setIsZoomedOut(false);
                }
              }}
              onClickCapture={(e) => {
                if (isZoomedOut) {
                  e.preventDefault(); e.stopPropagation();
                  setIsZoomedOut(false);
                  // Optional: Animate camera to center this cell
                }
              }}
            >
              {contentX === 0 && contentY === 0 ? (
                // 1. CENTER: HEADLINE
                <div style={{ textAlign: 'center', userSelect: 'none' }}>
                  <h1 style={{ fontSize: '12vw', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.8, letterSpacing: '-0.05em', color: '#ececec' }}>Good<br />Company.</h1>
                </div>
              ) : contentX === 1 && contentY === 0 ? (
                // 2. RIGHT: ROSTER (Asymmetric list)
                <div style={{ textAlign: 'left', userSelect: 'none', pointerEvents: 'auto', width: '100%', paddingLeft: '15%' }}>
                  <p style={{ color: '#808080', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.2em', marginBottom: '4vh', textTransform: 'uppercase' }}>[ Roster_01.idx ]</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {ARTISTS.map(artist => (
                      <li key={artist.id} style={{ marginBottom: '1vh' }}>
                        <button
                          onMouseEnter={() => setHoveredArtistId(artist.id)}
                          onMouseLeave={() => setHoveredArtistId(null)}
                          onClick={(e) => { e.stopPropagation(); setActiveArtist(artist); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ececec',
                            fontSize: '3vw',
                            fontWeight: 400,
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            opacity: hoveredArtistId ? (hoveredArtistId === artist.id ? 1 : 0.2) : 0.7,
                            transition: 'opacity 0.4s ease',
                            letterSpacing: '-0.03em'
                          }}
                        >
                          {artist.name}
                          {hoveredArtistId === artist.id && <span style={{ marginLeft: '10px', fontSize: '10px', verticalAlign: 'middle', opacity: 0.5 }}>←</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : contentX === 2 && contentY === 0 ? (
                // (2,0) THE VAULT
                <VaultCell />
              ) : contentX === 0 && contentY === 1 ? (


                // (0,1) LIVING GALLERY (Asymmetric Living Layout)
                <GalleryCell x={x} y={y} size={size} isZoomedOut={isZoomedOut} />

              ) : contentX === 1 && contentY === 1 ? (
                // (1,1) SOCIALS & SHOP (Link List)
                <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column' }}>

                  {/* LINKS */}
                  {[
                    { id: '01', label: 'INSTAGRAM', url: 'https://www.instagram.com/goodcmpany/' },
                    { id: '02', label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/6eCZz1kzSVLeQy2YRTEtO7' },
                    { id: '03', label: 'SHOP (COMING SOON)', url: '#' }
                  ].map((link, i) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: '#808080',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '20px 0',
                        borderBottom: '1px solid #1a1a1a',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ececec';
                        const num = e.currentTarget.querySelector('.num');
                        if (num) num.textContent = '->';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#808080';
                        const num = e.currentTarget.querySelector('.num');
                        if (num) num.textContent = link.id;
                      }}
                    >
                      <span className="num" style={{ width: '40px', letterSpacing: '0.1em', transition: 'all 0.2s ease' }}>{link.id}</span>
                      <span style={{ letterSpacing: '0.2em' }}>// {link.label}</span>
                    </a>
                  ))}

                  {/* FOOTER NOTE */}
                  <div style={{ marginTop: '40px', fontSize: '10px', color: '#444', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                    FOR SERVICES & MANAGEMENT SEE <span
                      style={{ color: '#888', borderBottom: '1px solid #888', cursor: 'pointer' }}
                      onClick={() => {
                        // Flawless Navigation: Slide -> Commit -> Reset
                        if (size.w === 0 || isAnimating.current) return;
                        isAnimating.current = true;

                        // 1. Visual Slide (Move Camera Down)
                        animate(y, y.get() - size.h, { ...PHYSICS }).then(() => {
                          // 2. Logic Commit (Update Coordinate)
                          currentPos.current.y += 1;

                          // 3. Physical Reset (Teleport Camera Back to 0)
                          // The grid re-renders around the new currentPos, so 0 is now the new center.
                          y.jump(0);

                          // 4. Force Render
                          setTick(t => t + 1);
                          isAnimating.current = false;
                        });
                      }}
                    >[SIGNAL]</span>
                  </div>

                </div>
              ) : contentX === 2 && contentY === 1 ? (
                // (2,1) STUDIO (YouTube Embed)
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>

                  {/* VIDEO CONTAINER */}
                  <div
                    style={{
                      width: size.w < 768 ? '100%' : '95%',
                      maxWidth: size.w < 768 ? 'none' : '800px',
                      aspectRatio: '16/9',
                      position: 'relative',
                      border: '1px solid #1a1a1a',
                      background: '#000',
                      transition: 'border-color 0.3s ease',
                      overflow: 'hidden' // Ensure image doesn't bleed
                    }}
                    onMouseEnter={(e) => {
                      if (activeStudioInstance !== instanceId) e.currentTarget.style.borderColor = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#1a1a1a';
                    }}
                  >
                    {isZoomedOut ? (
                      // STATIC THUMBNAIL (For Infinite Drag Optimization)
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img
                          src="https://img.youtube.com/vi/6zMS8ZRzQ1o/maxresdefault.jpg"
                          alt="Studio Session"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #ececec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #ececec', marginLeft: '4px' }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // INTERACTIVE IFRAME
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <iframe
                          width="100%" height="100%"
                          src={`https://www.youtube.com/embed/6zMS8ZRzQ1o?controls=0&rel=0&modestbranding=1${activeStudioInstance === instanceId ? '&autoplay=1' : ''}`}
                          title="Studio Session"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            width: '100%', height: '100%',
                            filter: activeStudioInstance === instanceId ? 'none' : 'brightness(0.9)',
                            transition: 'filter 0.5s ease',
                            opacity: activeStudioInstance === instanceId ? 1 : 0.7,
                            pointerEvents: activeStudioInstance === instanceId ? 'auto' : 'none'
                          }}
                        ></iframe>

                        {/* OVERLAY (Click to Play) */}
                        {activeStudioInstance !== instanceId && (
                          <div
                            onClick={() => setActiveStudioInstance(instanceId)}
                            style={{
                              position: 'absolute', inset: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', zIndex: 10
                            }}
                          >
                            <span style={{
                              fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.1em',
                              color: '#ececec', background: 'rgba(0,0,0,0.6)', padding: '5px 10px',
                              border: '1px solid #333'
                            }}>
                              [ PLAY_STUDIO_SESSION ]
                            </span>
                          </div>
                        )}

                        {/* STOP BUTTON (Physically removes iframe) */}
                        {activeStudioInstance === instanceId && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveStudioInstance(null); }}
                            style={{
                              position: 'absolute', top: '20px', right: '20px',
                              background: 'rgba(0,0,0,0.8)', color: '#ececec', border: '1px solid #333',
                              fontFamily: 'monospace', fontSize: '10px', padding: '5px 10px',
                              cursor: 'pointer', zIndex: 20, letterSpacing: '0.1em'
                            }}
                          >
                            [ STOP_SESSION ]
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* METADATA FOOTER */}
                  <div style={{
                    marginTop: '20px',
                    width: size.w < 768 ? '100%' : '95%',
                    maxWidth: size.w < 768 ? 'none' : '800px',
                    padding: size.w < 768 ? '0 20px' : '0', // Add padding on mobile so text doesn't hit edge
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: 'monospace', fontSize: '10px', color: '#555',
                    opacity: activeStudioInstance === instanceId ? 0.3 : 1,
                    transition: 'opacity 0.5s ease'
                  }}>
                    <span>REC_DATE: 2024_SESSION_04</span>
                    <span style={{ display: 'block' }}>LOCATION: STUDIO_HIDDEN</span>
                    <span>FORMAT: 4K_RAW_GRAIN</span>
                  </div>

                </div>
              ) : contentX === 0 && contentY === 2 ? (
                // (0,2) DATES (Ticker/List)
                <div style={{ width: '100%', padding: '0 10%', pointerEvents: 'auto' }}>
                  <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: 'monospace', fontSize: '10px', color: '#808080' }}>
                    <span style={{ textAlign: 'left' }}>DATE</span><span style={{ textAlign: 'center' }}>CITY</span><span style={{ textAlign: 'right' }}>VENUE</span>
                  </div>
                  {[
                    { d: '22.03.26', c: 'BERLIN', v: 'KANTINE AM BERGHAIN' }
                  ].map((date, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: 'monospace', fontSize: '14px', color: '#ececec', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(50,50,50,0.5)' }}>
                      <span style={{ textAlign: 'left' }}>{date.d}</span>
                      <span style={{ textAlign: 'center' }}>{date.c}</span>
                      <span style={{ color: '#888', textAlign: 'right' }}>{date.v}</span>
                    </div>
                  ))}
                </div>
              ) : contentX === 1 && contentY === 2 ? (
                // (1,2) CONNECT / SIGNAL INTERFACE
                <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'monospace', color: '#ececec' }}>

                  {/* HEADER */}
                  <div style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.2em' }}>
                    SIGNAL STATUS: ACTIVE
                  </div>

                  {/* FORM CONTAINER */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* INPUT 01: SOURCE_ID */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '12px', letterSpacing: '0.1em' }}>SOURCE_ID:</label>
                      <input
                        type="email"
                        placeholder="[ YOUR MAIL ]"
                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ececec', color: '#ececec', padding: '5px 0', outline: 'none', fontFamily: 'monospace', fontSize: '14px' }}
                      />
                    </div>

                    {/* INPUT 02: ENCODE_MSG */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '12px', letterSpacing: '0.1em' }}>ENCODE_MSG:</label>
                      <input
                        type="text"
                        placeholder="[ YOUR MESSAGE ]"
                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ececec', color: '#888', padding: '5px 0', outline: 'none', fontFamily: 'monospace', fontSize: '14px' }}
                        onFocus={(e) => e.target.style.color = '#ececec'}
                        onBlur={(e) => e.target.style.color = '#888'}
                      />
                    </div>

                    {/* SUBMIT ACTION */}
                    <button
                      style={{ marginTop: '20px', background: 'transparent', border: '1px solid #ececec', padding: '15px', color: '#ececec', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#ececec'; e.currentTarget.style.color = '#0c0c0c'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ececec'; }}
                    >
                      [ SEND SIGNAL ]
                    </button>

                  </div>

                  {/* BACKUP LINK */}
                  <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.3 }}>
                    <a href="mailto:hello@goodcompany.com" style={{ color: '#ececec', textDecoration: 'none', fontSize: '10px' }}>hello@goodcompany.com</a>
                  </div>

                </div>
              ) : (
                // (2,2) IMPRINT & SONIC VOID
                <div
                  style={{ pointerEvents: 'auto', width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setAudioEnabled(true)}
                >

                  {/* SONIC ELEMENT (Reactive Pulse) */}
                  <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8, pointerEvents: 'none' }}>
                    <svg width="400px" height="150px" viewBox="0 0 400 150" style={{ overflow: 'visible' }}>
                      {/* Layer 1: Slow & Wide (Subtle) */}
                      <motion.path
                        d="M0 75 Q 100 65, 200 75 T 400 75 T 600 75"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        style={{ scaleY: waveScale, originY: '50%', opacity: 0.6 }}
                        stroke="#ececec" strokeWidth="1" fill="none"
                      />
                      {/* Layer 2: Medium (Interference) */}
                      <motion.path
                        d="M0 75 Q 75 85, 150 75 T 300 75 T 450 75"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
                        style={{ scaleY: waveScale, originY: '50%', opacity: 0.4 }}
                        stroke="#ececec" strokeWidth="1" fill="none"
                      />
                      {/* Layer 3: Fast & Tight (Detail) */}
                      <motion.path
                        d="M0 75 Q 50 70, 100 75 T 200 75 T 300 75 T 400 75"
                        animate={{ x: ["-50%", "0%"] }} // Counter-flow
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{ scaleY: waveScale, originY: '50%', opacity: 0.3 }}
                        stroke="#ececec" strokeWidth="1" fill="none"
                      />
                    </svg>
                  </div>

                  {/* SPOTIFY PLAYER */}
                  <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '80px',
                    opacity: audioEnabled ? 1 : 0,
                    pointerEvents: audioEnabled ? 'auto' : 'none',
                    transition: 'opacity 1s ease',
                    filter: 'grayscale(1) invert(1) contrast(1.2)'
                  }}>
                    <iframe
                      style={{ borderRadius: '12px' }}
                      src="https://open.spotify.com/embed/artist/6eCZz1kzSVLeQy2YRTEtO7?utm_source=generator&theme=0"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>

                  {/* SYNC TRIGGER OVERLAY */}
                  {!audioEnabled && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#ececec', cursor: 'pointer', opacity: 0.7 }}>
                      [ CLICK TO SYNC AUDIO ]
                    </div>
                  )}

                  {/* LEGAL FOOTER (Bottom Right) */}
                  <div
                    style={{ position: 'absolute', bottom: '40px', right: '40px', textAlign: 'right', fontFamily: 'monospace', fontSize: '10px', color: '#ececec', opacity: 0.1, transition: 'opacity 0.3s ease', cursor: 'default', textTransform: 'uppercase' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ cursor: 'pointer', marginRight: '15px' }}>LEGAL_REF // IMPRINT</span>
                      <span style={{ cursor: 'pointer' }}>DATA_PROT // PRIVACY</span>
                    </div>
                    <div style={{ letterSpacing: '0.1em' }}>
                      ©2026 GOOD COMPANY. ALL RIGHTS RESERVED.
                    </div>
                  </div>

                </div>
              )}
            </div>
          </WrappedCell>
        );
      }
    }
    return c;
  }, [size, activeArtist, hoveredArtistId, tick, audioEnabled, waveScale, isZoomedOut]);

  if (size.w === 0) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0c0c0c', overflow: 'hidden', position: 'fixed', touchAction: 'none' }}>

      {/* VIGNETTE (Enhanced) */}
      <div className="vignette" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, transparent 40%, #0c0c0c 100%)', // Harder darkening at edges
        zIndex: 10, opacity: 0.8
      }} />


      <motion.div
        animate={{
          scale: isZoomedOut ? 0.25 : 1,
          borderRadius: isZoomedOut ? 20 : 0,
        }}
        style={{
          width: '100%', height: '100%',
          transformOrigin: 'center center',
          position: 'relative',
          rotateX: isZoomedOut ? 0 : tiltX,
          rotateY: isZoomedOut ? 0 : tiltY,
          scale: scaleEffect,
          perspective: 1000
        }}
      >
        {/* GLOBAL BACKGROUND TEXT (Static in Scale Wrapper) */}
        <BackgroundText />

        <motion.div
          drag
          dragDirectionLock={!isZoomedOut}
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => {
            isDragging.current = true;
            isAnimating.current = false;
            x.stop();
            y.stop();
          }}
          onDragEnd={handleDragEnd}
          style={{
            x, y,
            width: '100%', height: '100%',
            touchAction: 'none',
            cursor: isZoomedOut ? 'grab' : 'auto'
          }}
          whileTap={{ cursor: isZoomedOut ? 'grabbing' : 'grabbing' }}
        >


          {cells}
        </motion.div>
      </motion.div>

      {/* OVERVIEW BUTTON */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
        <button
          onClick={() => setIsZoomedOut(!isZoomedOut)}
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #333',
            color: '#ececec',
            fontFamily: 'monospace',
            fontSize: '10px',
            padding: '10px 15px',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ececec'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; }}
        >
          <div style={{ width: '8px', height: '8px', border: '1px solid currentColor' }}></div>
          {isZoomedOut ? 'CLOSE_VIEW' : 'OVERVIEW'}
        </button>
      </div>

      <AnimatePresence>
        {activeArtist && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Slower, heavier glide
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              backgroundColor: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(40px)',
              display: 'flex', flexDirection: 'column',
              color: '#ececec'
            }}
          >
            {/* FIXED CLOSE BUTTON */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', pointerEvents: 'none', zIndex: 20 }}>
              <button
                onClick={() => setActiveArtist(null)}
                style={{
                  position: 'absolute', top: '30px', right: '30px',
                  background: 'none', border: 'none',
                  color: '#808080',
                  fontFamily: 'monospace', fontSize: '14px',
                  cursor: 'pointer', pointerEvents: 'auto',
                  letterSpacing: '0.1em'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ececec'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#808080'}
              >
                [ CLOSE ]
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div style={{
              width: '100%', height: '100%',
              overflowY: 'auto',
              paddingTop: '100px', paddingBottom: '100px',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>

              <div style={{ maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', gap: '60px' }}>

                {/* HEADER */}
                <h2 style={{ fontSize: '15vw', fontWeight: 900, lineHeight: 0.8, letterSpacing: '-0.05em', textTransform: 'uppercase', textAlign: 'center' }}>
                  {activeArtist.name}
                </h2>

                {/* IMAGE */}
                <div style={{ width: '100%', aspectRatio: '4/5', position: 'relative', background: '#111', overflow: 'hidden' }}>
                  <img
                    src={activeArtist.image}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }}
                  />
                  {/* GRAIN OVERLAY */}
                  <div className="filmGrain" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none', mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                </div>

                {/* BIO / DESCRIPTION */}
                <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6, color: '#aaa', borderLeft: '1px solid #333', paddingLeft: '20px' }}>
                  <p style={{ marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px', color: '#666' }}>/ BIOGRAPHY</p>
                  {activeArtist.description}
                </div>

                {/* FOOTER LINKS */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                  {activeArtist.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'monospace', fontSize: '12px',
                        color: '#ececec', textDecoration: 'none',
                        border: '1px solid #333', padding: '10px 20px',
                        textTransform: 'uppercase', letterSpacing: '0.1em'
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="filmGrain" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: activeArtist ? 0.35 : 0.08, transition: 'opacity 0.5s ease', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, zIndex: 50, mixBlendMode: 'overlay' }} />
    </div >
  );
}