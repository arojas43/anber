// src/components/ui/Sparkles.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SparklesProps {
    className?: string;
}

const Sparkles: React.FC<SparklesProps> = ({ className = '' }) => {
    const sparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
    }));

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {sparkles.map((sparkle) => (
                <motion.div
                    key={sparkle.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: sparkle.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

export default Sparkles;
