import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    link: string;
    cta: string;
}

interface CarouselProps {
    slides: Slide[];
    autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlayInterval = 6000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const next = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(next, autoPlayInterval);
        return () => clearInterval(timer);
    }, [next, autoPlayInterval, isPaused, currentIndex]);

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    const tx = (delay: number) => ({ duration: 0.65, delay, ease: 'easeOut' as const });

    return (
        <div
            className="relative w-full overflow-hidden bg-neutral-950"
            style={{ height: 'calc(100vh - 0px)', minHeight: '560px', maxHeight: '900px' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    {/* Ken Burns background */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-24">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={tx(0.1)}
                                className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                                Nueva Colección
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={tx(0.25)}
                                className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif text-white leading-tight mb-5"
                            >
                                {slides[currentIndex].title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={tx(0.4)}
                                className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-lg"
                            >
                                {slides[currentIndex].subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={tx(0.55)}
                            >
                                <Link to={slides[currentIndex].link}>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="group inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-4 rounded-full text-base shadow-xl shadow-primary-500/30 transition-colors"
                                    >
                                        {slides[currentIndex].cta}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                <motion.div
                    key={currentIndex}
                    className="h-full bg-primary-400"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                />
            </div>

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                aria-label="Anterior"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                aria-label="Siguiente"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 right-6 sm:right-12 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        aria-label={`Ir a slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
