export const PROJECTS = [
    {
        id: '01',
        title: 'SIGNAL',
        category: 'Visual Identity',
        src: 'https://cdn.dribbble.com/users/32512/screenshots/16287950/media/f57e296865df3c3c7344933a39e248b9.mp4',
        type: 'video',
        gridPos: { col: 0, row: 0 }
    },
    {
        id: '02',
        title: 'ROSTER',
        category: 'Talent',
        src: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=2564&auto=format&fit=crop', // Stock High-Quality Portrait
        type: 'image',
        gridPos: { col: 1, row: 0 }
    },
    {
        id: '03',
        title: 'THE VAULT',
        category: 'Archive',
        src: '/images/gallery_02.jpg', // Placeholder for Vault cover
        type: 'image',
        gridPos: { col: 2, row: 0 }
    },
    {
        id: '04',
        title: 'GALLERY',
        category: 'Collections',
        src: 'https://cdn.dribbble.com/userupload/4468694/file/original-59754f9a76d85918737df90234796740.mp4',
        type: 'video',
        gridPos: { col: 0, row: 1 }
    },
    {
        id: '05',
        title: 'SOCIALS',
        category: 'Connect',
        src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop',
        type: 'image',
        gridPos: { col: 1, row: 1 }
    },
    {
        id: '06',
        title: 'STUDIO',
        category: 'Session',
        src: 'https://www.youtube.com/embed/6zMS8ZRzQ1o', // YouTube behaves differently, handled in component
        type: 'youtube',
        gridPos: { col: 2, row: 1 }
    },
    {
        id: '07',
        title: 'DATES',
        category: 'Live',
        src: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2670&auto=format&fit=crop',
        type: 'image',
        gridPos: { col: 0, row: 2 }
    },
    {
        id: '08',
        title: 'SIGNAL',
        category: 'Contact',
        src: 'https://cdn.dribbble.com/users/125832/screenshots/11267812/media/6b9942a0378906967814b7858c440a44.mp4',
        type: 'video',
        gridPos: { col: 1, row: 2 }
    },
    {
        id: '09',
        title: 'IMPRINT',
        category: 'Legal',
        src: 'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=2671&auto=format&fit=crop',
        type: 'image',
        gridPos: { col: 2, row: 2 }
    }
];

export const ARTISTS = [
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

export const GALLERY_IMAGES = [
    { id: '01', src: 'https://berghain.berlin/media/images/Company_freestyle_Cover_Clean.width-1600.jpg', caption: 'CLUB_NIGHT_001' },
    { id: '02', src: '/images/gallery_02.jpg', caption: 'THE_GANG' },
];

export const VAULT_FILES = [
    { type: 'VIDEO', name: 'STUDIO_SESSION_RAW.MP4', size: '42MB', url: '/videos/studio_session_raw.mp4' },
    { type: 'AUDIO', name: 'UNRELEASED_DEMO_V1.WAV', size: '12MB', url: '#' },
    { type: 'IMAGE', name: 'GOODCOMPANY_TOUR_POSTER.PDF', size: '05MB', url: '#' },
    { type: 'IMAGE', name: 'STAGE_DESIGN_SCHEMATICS.JPG', size: '08MB', url: '#' },
];
