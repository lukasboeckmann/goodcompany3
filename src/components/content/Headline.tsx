import React from 'react';

export default function Headline() {
    return (
        <div className="w-full h-full flex items-center justify-center select-none text-center">
            <h1
                // FIX 1: leading-[0.8] -> leading-[0.85] (Mehr Platz zwischen Zeilen)
                // FIX 2: pb-[1vw] (Kleiner Abstand unten, damit C und O nicht abgeschnitten werden)
                className="text-[12vw] font-[800] uppercase leading-[0.80] tracking-[-0.05em] text-[#ececec] pb-[1vw]"
                style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, black 15%, black 85%, rgba(0,0,0,0.6) 100%)',
                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, black 15%, black 85%, rgba(0,0,0,0.6) 100%)'
                }}
            >
                Good<br />Company.
            </h1>
        </div>
    );
}