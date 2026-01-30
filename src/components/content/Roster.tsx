import React, { useState } from 'react';

const ARTISTS = [
    {
        id: 'veli',
        name: 'Veli',
        bio: 'The Visionary.',
        description: '',
        image: '/images/gallery_02.jpg',
        links: [
            { label: 'INSTAGRAM', url: 'https://www.instagram.com/theregularkid/' },
            { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
        ]
    },
    {
        id: 'malik',
        name: 'Malik',
        bio: 'The Architect.',
        description: '',
        image: '/images/maliiik_profile.jpg',
        links: [
            { label: 'INSTAGRAM', url: 'https://www.instagram.com/jamalsrevengee/' },
            { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
        ]
    }
];

export default function Roster({ setActiveArtist }: { setActiveArtist: (artist: any) => void }) {
    const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

    return (
        <div className="w-full h-full flex flex-col justify-center text-left select-none pointer-events-auto pl-[15%]">
            <p className="text-[#808080] font-mono text-xs tracking-[0.2em] mb-[4vh] uppercase">[ Roster_01.idx ]</p>
            <ul className="p-0 list-none">
                {ARTISTS.map(artist => (
                    <li key={artist.id} className="mb-[1vh]">
                        <button
                            onMouseEnter={() => setHoveredArtistId(artist.id)}
                            onMouseLeave={() => setHoveredArtistId(null)}
                            onClick={(e) => { e.stopPropagation(); setActiveArtist(artist); }}
                            className="bg-none border-none text-[#ececec] text-[3vw] font-normal font-mono cursor-pointer uppercase transition-opacity duration-400 tracking-[-0.03em]"
                            style={{
                                opacity: hoveredArtistId ? (hoveredArtistId === artist.id ? 1 : 0.2) : 0.7
                            }}
                        >
                            {artist.name}
                            {hoveredArtistId === artist.id && <span className="ml-[10px] text-[10px] align-middle opacity-50">←</span>}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { ARTISTS };
