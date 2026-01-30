'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero() {
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false);

    useEffect(() => {
        // Check session storage on mount
        const played = sessionStorage.getItem('heroIntroPlayed');
        if (played) {
            setHasIntroPlayed(true);
        } else {
            // Mark as played for this session
            sessionStorage.setItem('heroIntroPlayed', 'true');
        }
    }, []);

    const { language, setLanguage, t } = useLanguage();

    // Logic for independent Language Switcher class
    const langSwitchClass = hasIntroPlayed ? styles.langSwitcherSkipped : styles.langSwitcher;

    // Helper to choose class for Nav Links
    const linkClass = hasIntroPlayed ? styles.navLinkSkipped : styles.navLink;

    const [wasClicked, setWasClicked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Choose animation class - Only flicker delay if intro hasn't played
    // If isAnimating is true (clicked), force the instant flicker
    const animClass = isAnimating
        ? styles.flickerInstant
        : (hasIntroPlayed ? '' : styles.flickerDelayed);

    // Disable hover/pointer events during animation
    const hoverClass = isAnimating ? styles.noHover : '';

    return (
        <section className={styles.hero}>
            <button
                key={language}
                className={`${langSwitchClass} ${animClass} ${hoverClass}`}
                onClick={(e) => {
                    e.currentTarget.blur();
                    setWasClicked(true);
                    setLanguage(language === 'DE' ? 'EN' : 'DE');

                    // Disable hover for 2s (duration of animation)
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 2000);
                }}
                aria-label={language === 'DE' ? 'DE - Switch language to English' : 'EN - Sprache auf Deutsch umstellen'}
            >
                {language}
            </button>

            <div className={styles.videoContainer}>
                {/* Placeholder: Abstract moody red/gold texture/video */}
                <div className={styles.placeholderBg}>
                    <div className={styles.grain}></div>
                </div>
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    <span className={styles.letter}>B</span>
                    <span className={styles.letter}>I</span>
                    <span className={styles.letter}>B</span>
                    <span className={styles.letter}>I</span>
                    <span className={styles.letter}>Z</span>
                    <span className={styles.letter}>A</span>
                </h1>

                <div className={styles.scrollIndicator}>
                    <span>{t.hero.scroll}</span>
                    <div className={styles.line}></div>
                </div>
            </div>

            <nav className={styles.nav}>
                <Link href="/live" className={linkClass}>
                    {t.nav.live}
                </Link>
                <a href="https://bibiza.krasserstoff.com/" className={linkClass} target="_blank" rel="noopener noreferrer">
                    {t.nav.shop}
                </a>
                <Link href="/contact" className={linkClass}>
                    {t.nav.contact}
                </Link>
                <Link href="/awareness" className={linkClass}>
                    {t.nav.awareness}
                </Link>
            </nav>
        </section>
    );
}

