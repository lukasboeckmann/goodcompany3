import React, { useState } from 'react';

const ARTISTS = [
    {
        id: 'veli',
        name: 'Veli',
        bio: '',
        description: '',
        image: '/images/gallery_02.jpg',
        links: [
            { label: 'INSTAGRAM', url: 'https://www.instagram.com/theregularkid/' },
            { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
        ]
    },
    {
        id: '*maliiik',
        name: '*maliiik',
        bio: '',
        description: '',
        image: '/images/maliiik_profile.jpg',
        links: [
            { label: 'INSTAGRAM', url: 'https://www.instagram.com/jamalsrevengee/' },
            { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
        ]
    },
    {
        id: 'cuffa',
        name: 'cuffa',
        bio: '',
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
        bio: '',
        description: '',
        image: 'https://berghain.berlin/media/images/Company_freestyle_Cover_Clean.width-1600.jpg', // Placeholder
        links: [
            { label: 'INSTAGRAM', url: 'https://www.instagram.com/jamalsrevengee/' },
            { label: 'SPOTIFY', url: 'https://open.spotify.com/intl-de/artist/4zihxCwRYFfvLnyDbMKLmg' }
        ]
    }
];

export default function Roster({ setActiveArtist }: { setActiveArtist: (artist: any) => void }) {
    const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

    return (
        <div className="w-full h-full flex items-center pointer-events-auto select-none">

            {/* DIE MAGIE:
               1. w-1/2: Wir nehmen nur die linke Hälfte der Kachel.
               2. justify-center: Wir schieben den inneren Block in die Mitte dieser Hälfte (auf 25% der Gesamtbreite).
            */}
            <div className="w-1/2 h-full flex flex-col justify-center items-center">

                {/* DER INHALTS-BLOCK:
                   Hier sagen wir 'items-start' und 'text-left'.
                   Das sorgt dafür, dass Roster und Namen sauber untereinander linksbündig stehen,
                   obwohl der ganze Block mittig im Raum schwebt.
                */}
                <div className="flex flex-col items-start text-left">
                    <p className="text-[#808080] font-mono text-xs tracking-[0.2em] mb-[4vh] uppercase">
                        [ Roster_01.idx ]
                    </p>

                    <ul className="p-0 list-none flex flex-col items-start">
                        {ARTISTS.map(artist => (
                            <li key={artist.id} className="mb-[1vh]">
                                <button
                                    onMouseEnter={() => setHoveredArtistId(artist.id)}
                                    onMouseLeave={() => setHoveredArtistId(null)}
                                    onClick={(e) => { e.stopPropagation(); setActiveArtist(artist); }}
                                    className="relative bg-none border-none text-[#ececec] text-[5vw] font-normal font-mono cursor-pointer uppercase transition-opacity duration-400 tracking-[-0.03em] flex items-center text-left"
                                    style={{
                                        opacity: hoveredArtistId ? (hoveredArtistId === artist.id ? 1 : 0.2) : 0.7
                                    }}
                                >
                                    {artist.name}

                                    <span
                                        className={`ml-4 text-[10px] transition-all duration-300 ${hoveredArtistId === artist.id ? 'opacity-50' : 'opacity-0'}`}
                                    >
                                        ←
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* RECHTE HÄLFTE LEER */}
            <div className="w-1/2 h-full" />

        </div>
    );
}

export { ARTISTS };