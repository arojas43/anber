// src/components/Aceternity/InfiniteCarousel.tsx
import React, { type ReactNode } from "react";
import { motion } from "framer-motion";

interface InfiniteCarouselProps {
    children: ReactNode;
    speed?: "slow" | "normal" | "fast";
    direction?: "left" | "right";
    pauseOnHover?: boolean;
}

export const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
    children,
    speed = "normal",
    direction = "left",
    pauseOnHover = true
}) => {
    const speedMap = {
        slow: 40,
        normal: 20,
        fast: 10
    };

    return (
        <div className="overflow-hidden relative">
            <motion.div
                className="flex gap-4"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
                }}
                transition={{
                    duration: speedMap[speed],
                    repeat: Infinity,
                    ease: "linear"
                }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};
