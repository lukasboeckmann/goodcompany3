'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './MusicVideosSection.module.css';
import { useLanguage } from '@/context/LanguageContext';

const carouselVideos = [
    { title: 'Galopp!', id: '4lsu19beN9E' },
    { title: 'aufnimmawiederschaun', id: 'V9oPTAUYv2w' },
    { title: 'Stadtpark Insomnia', id: 'Ld3xgrI4rY0' },
    { title: 'Eine Ode an Wien', id: 'xHz_fZEMZX0' },
    { title: 'Casanova', id: '4Yl58IPl-X8' },
    { title: 'Wunschkonzert', id: 'gZh4LvnihAc' },
    { title: 'angefahrn', id: '-bsUHmu4TX8' },
    { title: 'Tanzen', id: 'eg5AQr8xzD4' }
];

export default function MusicVideosSection() {
    const { t } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);
    // State for the currently playing video in the main player
    const [activeVideo, setActiveVideo] = useState(carouselVideos[0]);
    // Prevent autoplay on initial load, but allow it on subsequent clicks
    const [shouldAutoplay, setShouldAutoplay] = useState(false);

    // Create a "virtual infinite" list (20 sets) to avoid scroll-jumping glitches
    // This provides a smooth "revolver" feel without the browser hickups caused by scroll resets
    const infiniteVideos = Array(20).fill(carouselVideos).flat();

    // Scroll to middle set on load logic
    useEffect(() => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const firstCard = current.firstElementChild as HTMLElement;
            // Best effort estimation if not rendered yet
            const cardWidth = firstCard ? firstCard.clientWidth : 350;
            const gap = 20;
            const itemWidth = cardWidth + gap;

            // Initial Jump to middle (Set 10)
            // This gives plenty of buffer in both directions
            const startOffset = (carouselVideos.length * 10) * itemWidth;
            current.scrollLeft = startOffset;
        }
    }, []); // Run once on mount

    const handleScroll = () => {
        // No more complex reset logic here. 
        // We rely on the massive buffer of 20 sets. 
        // User would have to scroll for minutes to hit the edge.
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const firstCard = current.firstElementChild as HTMLElement;
            const cardWidth = firstCard ? firstCard.clientWidth : 350;
            const gap = 20;
            const itemWidth = cardWidth + gap;

            const currentScroll = current.scrollLeft;
            const currentIndex = Math.round(currentScroll / itemWidth);

            let nextIndex;
            if (direction === 'left') {
                nextIndex = currentIndex - 1;
            } else {
                nextIndex = currentIndex + 1;
            }

            current.scrollTo({
                left: nextIndex * itemWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleThumbnailClick = (video: typeof carouselVideos[0]) => {
        setActiveVideo(video);
        setShouldAutoplay(true);
    };

    return (
        <section className={styles.section} id="videos">
            <div className={styles.container}>
                <h2 className={styles.title}>{t.live.musicVideos}</h2>

                {/* Main Player (Featured Video) */}
                <div className={styles.featuredVideo}>
                    <div className={styles.videoWrapper}>
                        <iframe
                            className={styles.iframe}
                            // Autoplay only after first interaction
                            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=${shouldAutoplay ? 1 : 0}&mute=0&controls=1&loop=1&playlist=${activeVideo.id}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=1`}
                            title={`Bibiza - ${activeVideo.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Carousel Videos (Thumbnails) */}
                <div
                    className={styles.carouselContainer}
                    ref={scrollRef}
                    onScroll={handleScroll}
                    tabIndex={0}
                    role="region"
                    aria-label="Musikvideos Karussell - Mit Pfeiltasten scrollen"
                >
                    {infiniteVideos.map((video, index) => (
                        <div
                            key={`${video.id}-${index}`}
                            className={styles.carouselVideoCard}
                            onClick={() => handleThumbnailClick(video)}
                        >
                            {/* Use YouTube Thumbnail instead of heavy Iframe */}
                            <div className={styles.thumbnailWrapper}>
                                <Image
                                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                    alt={video.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="300px"
                                    loading="eager" // Preload images for smooth scrolling
                                />
                            </div>
                            {/* Play Button Overlay */}
                            <div className={styles.playOverlay}>
                                <div className={styles.playIcon} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className={styles.controls}>
                    <button onClick={() => scroll('left')} className={styles.navButton}>
                        &larr; {t.live.prev}
                    </button>
                    <button onClick={() => scroll('right')} className={styles.navButton}>
                        {t.live.next} &rarr;
                    </button>
                </div>
            </div>
        </section>
    );
}
