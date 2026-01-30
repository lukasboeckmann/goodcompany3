import Image from 'next/image';
import styles from './FullScreenImage.module.css';

interface FullScreenImageProps {
    src: string;
    alt: string;
}

export default function FullScreenImage({ src, alt }: FullScreenImageProps) {
    return (
        <section className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image
                    src={src}
                    alt={alt}
                    className={styles.image}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    priority
                />
            </div>
        </section>
    );
}
