import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlayInterval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [currentIndex, autoPlayInterval]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-neutral-900">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl mx-auto text-white space-y-6">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-7xl font-bold font-serif"
                            >
                                {slides[currentIndex].title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl md:text-2xl text-white/90"
                            >
                                {slides[currentIndex].subtitle}
                            </motion.p>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Link to={slides[currentIndex].link}>
                                    <Button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-full">
                                        {slides[currentIndex].cta}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10"
            >
                <ChevronRight className="h-8 w-8" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
