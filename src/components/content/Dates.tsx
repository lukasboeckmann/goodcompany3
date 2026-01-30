import React from 'react';

export default function Dates() {
    return (
        <div className="w-full max-w-[1200px] px-[10%] pointer-events-auto">
            <div className="border-b border-[#333] pb-[10px] mb-[10px] grid grid-cols-3 font-mono text-[10px] text-[#808080]">
                <span className="text-left">DATE</span>
                <span className="text-center">CITY</span>
                <span className="text-right">VENUE</span>
            </div>
            {[
                { d: '22.03.26', c: 'BERLIN', v: 'KANTINE AM BERGHAIN' }
            ].map((date, i) => (
                <div key={i} className="grid grid-cols-3 font-mono text-[14px] text-[#ececec] mb-[10px] pb-[10px] border-b border-white/5">
                    <span className="text-left">{date.d}</span>
                    <span className="text-center">{date.c}</span>
                    <span className="text-right text-[#888]">{date.v}</span>
                </div>
            ))}
        </div>
    );
}
