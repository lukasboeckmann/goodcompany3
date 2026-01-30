'use client';

import React from 'react';
import styles from './NewsletterSection.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsletterSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.section} id="newsletter">
            <div className={styles.container}>
                <h2 className={styles.title}>{t.newsletter.title}</h2>
                <p className={styles.subtext}>{t.newsletter.subtext}</p>
                <form className={styles.form}>
                    <input
                        type="email"
                        placeholder={t.newsletter.placeholder}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        {t.newsletter.subscribe}
                    </button>
                    <p className={styles.disclaimer}>
                        {t.newsletter.disclaimer}
                    </p>
                </form>
            </div>
        </section>
    );
}
