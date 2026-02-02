import React from 'react';
import { useMotionValue, animate } from 'framer-motion';

export default function Socials({ onNavigate }: { onNavigate: (direction: 'up' | 'down') => void }) {
    const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);

    return (
        <div className="pointer-events-auto w-full max-w-[350px] flex flex-col">
            {[
                { id: '01', label: 'INSTAGRAM', url: 'https://www.instagram.com/goodcmpany/' },
                { id: '02', label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/6eCZz1kzSVLeQy2YRTEtO7' },
                { id: '03', label: 'SHOP (COMING SOON)', url: '#' }
            ].map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline text-[#808080] font-mono text-[14px] flex items-center border-b border-[#1a1a1a] transition-colors duration-300 hover:text-[#ececec] group"
                    style={{ paddingTop: '20px', paddingBottom: '28px' }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    <span className="w-[40px] tracking-[0.1em] transition-all duration-200">
                        {hoveredLink === link.id ? '→' : link.id}
                    </span>
                    <span className="tracking-[0.2em]">// {link.label}</span>
                </a>
            ))}

            <div
                className="text-[10px] text-[#444] font-mono tracking-[0.1em]"
                style={{ marginTop: '45px' }}
            >
                FOR SERVICES & MANAGEMENT SEE <span
                    className="text-[#888] border-b border-[#888] cursor-pointer"
                    onClick={() => onNavigate('down')}
                >[SIGNAL]</span>
            </div>
        </div>
    );
}
