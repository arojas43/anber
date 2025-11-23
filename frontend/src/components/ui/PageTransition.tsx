// src/components/ui/PageTransition.tsx
import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
