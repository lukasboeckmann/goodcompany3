'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './LiveSection.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function LiveSection() {
    const { t } = useLanguage();
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% visible
        );

        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        return () => {
            if (titleRef.current) {
                observer.unobserve(titleRef.current);
            }
        };
    }, [isVisible]);

    const dates = [
        { date: '12.05.', city: 'WIEN', venue: 'Gasometer' },
        { date: '14.05.', city: 'BERLIN', venue: 'Columbiahalle' },
        { date: '15.05.', city: 'HAMBURG', venue: 'Inselpark Arena' },
        { date: '17.05.', city: 'KÖLN', venue: 'Palladium' },
        { date: '18.05.', city: 'MÜNCHEN', venue: 'Tonhalle' },
        { date: '25.05.', city: 'ZÜRICH', venue: 'Volkshaus' },
    ];

    return (
        <section className={styles.section} id="live">
            <div className={styles.container}>
                <h2
                    ref={titleRef}
                    className={`${styles.title} ${isVisible ? styles.visible : ''}`}
                >
                    {t.live.title}
                </h2>

                <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                        src="https://static.wixstatic.com/media/0d7bc6_b9269e39e2a24e96991337f6c7776e2c~mv2.jpg/v1/fill/w_1200,h_1200,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0d7bc6_b9269e39e2a24e96991337f6c7776e2c~mv2.jpg"
                        alt="Bibiza Live"
                        className={styles.image}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <Link href="/live" className={styles.allDatesLink}>
                    {t.live.allDates} &rarr;
                </Link>
            </div>
        </section>
    );
}
