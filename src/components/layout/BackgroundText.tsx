import React from 'react';
import { motion } from 'framer-motion';

const BackgroundText = React.memo(() => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: '50%', left: '14%', // Shifted to 14% as requested in goodcompany2
                width: '100%', height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'translate(-50%, -50%)',
                willChange: 'transform'
            }}
        >
            <h1 style={{
                fontSize: '40vw', fontWeight: 900, color: '#ececec', opacity: 0.03,
                whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '-0.05em'
            }}>
                GOOD COMPANY
            </h1>
        </motion.div>
    );
});

export default BackgroundText;
