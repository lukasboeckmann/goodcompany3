import Link from 'next/link';
import styles from './CornerMenu.module.css';

const ITEMS = [
    { label: 'Live', path: '/live', position: styles.topLeft },
    { label: 'Shop', path: '/shop', position: styles.topRight },
    { label: 'Kontakt', path: '/kontakt', position: styles.bottomLeft },
    { label: 'Company', path: '/company', position: styles.bottomRight },
];

export default function CornerMenu() {
    return (
        <div className={styles.container}>
            {ITEMS.map((item) => (
                <Link key={item.label} href={item.path} className={`${styles.square} ${item.position}`}>
                    <span>{item.label}</span>
                </Link>
            ))}
        </div>
    );
}
