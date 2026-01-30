'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './SpotifySection.module.css';

const artistId = '4cohcn6lAkdQIAt3q5C4e2';

export default function SpotifySection() {
    const [showEmbed, setShowEmbed] = useState(false);

    return (
        <section className={styles.section} id="spotify">
            <h2 className={styles.title}>SPOTIFY</h2>
            <div className={styles.container}>
                <div className={styles.embedWrapper}>
                    {!showEmbed ? (
                        <button
                            className={styles.placeholder}
                            onClick={() => setShowEmbed(true)}
                            aria-label="Load Spotify Player"
                        >
                            <div className={styles.placeholderContent}>
                                <div className={styles.albumCover}>
                                    <Image
                                        src="/images/bibiza-atmosphere.jpg"
                                        alt="Bibiza Album Art"
                                        fill
                                        className={styles.coverImage}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.trackInfo}>
                                    <span className={styles.trackTitle}>BIBIZA</span>
                                    <span className={styles.trackArtist}>Top Tracks</span>
                                </div>
                            </div>
                            <div className={styles.glassOverlay}>
                                <div className={styles.playButton} />
                            </div>
                        </button>
                    ) : (
                        <iframe
                            src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
                            width="100%"
                            height="352"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation"
                        ></iframe>
                    )}
                </div>
            </div>
        </section>
    );
}
