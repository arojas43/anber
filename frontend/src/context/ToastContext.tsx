// src/context/ToastContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md min-w-[300px]
                ${toast.type === 'success' ? 'bg-white/90 border-green-200 text-green-800' : ''}
                ${toast.type === 'error' ? 'bg-white/90 border-red-200 text-red-800' : ''}
                ${toast.type === 'info' ? 'bg-white/90 border-blue-200 text-blue-800' : ''}
              `}
                        >
                            <div className={`
                p-1 rounded-full 
                ${toast.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                ${toast.type === 'error' ? 'bg-red-100 text-red-600' : ''}
                ${toast.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
              `}>
                                {toast.type === 'success' && <CheckCircle className="h-4 w-4" />}
                                {toast.type === 'error' && <AlertCircle className="h-4 w-4" />}
                                {toast.type === 'info' && <Info className="h-4 w-4" />}
                            </div>
                            <p className="text-sm font-medium flex-1">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
