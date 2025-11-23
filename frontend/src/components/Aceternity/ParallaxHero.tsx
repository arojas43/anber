// src/components/Aceternity/ParallaxHero.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    children?: React.ReactNode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
    title,
    subtitle,
    backgroundImage,
    children
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden">
            {/* Background with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0">
                {backgroundImage ? (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/30 via-primary-600/20 to-white"></div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-100"></div>
                )}
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 flex items-center justify-center h-full"
            >
                <div className="text-center px-4 max-w-5xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold text-neutral-900 mb-6 font-serif"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-neutral-700 mb-12"
                    >
                        {subtitle}
                    </motion.p>
                    {children}
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center"
                >
                    <motion.div className="w-1.5 h-3 bg-primary-500 rounded-full mt-2"></motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
