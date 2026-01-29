'use client';

import React from 'react';
import { VAULT_FILES } from '@/data/content';

export const VaultCell = () => {
    const [vaultInput, setVaultInput] = React.useState('');
    const [status, setStatus] = React.useState<'LOCKED' | 'DECRYPTING' | 'UNLOCKED'>('LOCKED');
    const [glitch, setGlitch] = React.useState(false);
    const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleValidate = () => {
        if (vaultInput.toUpperCase().trim() === 'COMPANY') {
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
