'use client';

import React from 'react';
import styles from './DiscographySection.module.css';

const albums = [
    { title: 'bis einer weint', year: '2024', color: '#880000' },
    { title: 'Wiener Schickeria', year: '2023', color: '#cc9900' },
    { title: 'Lebe wie ein Hippie', year: '2021', color: '#006600' },
    { title: 'Zwei Zöpfe auf dem Kopf', year: '2021', color: '#990099' },
    { title: 'Bis Dato', year: '2020', color: '#003366' },
    { title: 'Copypaste', year: '2019', color: '#333333' }
];

export default function DiscographySection() {
    return (
        <section className={styles.section} id="music">
            <div className={styles.container}>
                <h2 className={styles.title}>Diskografie</h2>

                <div className={styles.slider}>
                    {albums.map((album, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className={styles.releaseCard}>
                                {/* The Vinyl Disc (Behind) */}
                                <div className={styles.vinyl}>
                                    <div className={styles.vinylLabel}>
                                        <div className={styles.vinylHole} />
                                    </div>
                                </div>

                                {/* The Cover (Front) */}
                                <div className={styles.cover}>
                                    {/* Placeholder styling using color */}
                                    <div
                                        className={styles.placeholderCover}
                                        style={{ backgroundColor: album.color, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                                    >
                                        <span>{album.title}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className={styles.meta}>
                                <div className={styles.albumTitle}>{album.title}</div>
                                <div className={styles.albumYear}>{album.year}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
