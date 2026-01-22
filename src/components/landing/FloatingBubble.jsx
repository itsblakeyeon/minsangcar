import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FloatingBubble({ onConsultClick }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300 && !isDismissed) {
                setIsVisible(true);
            } else if (window.scrollY <= 300) {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    const handleDismiss = (e) => {
        e.stopPropagation();
        setIsDismissed(true);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    className="fixed bottom-6 inset-x-0 mx-auto z-40 px-4"
                >
                    <div 
                        onClick={onConsultClick}
                        className="relative bg-[#0052CC] text-white px-4 py-3 rounded-full shadow-2xl cursor-pointer hover:bg-[#003399] transition-all hover:scale-105 w-full max-w-2xl"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute -top-2 -right-2 bg-white text-slate-700 rounded-full p-1 hover:bg-slate-100 transition-colors shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-3">
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/a25f2c485_.png"
                                alt="민생지원카"
                                className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="text-left flex-1 min-w-0">
                                <p className="font-bold text-sm leading-tight truncate">
                                    진심입니다! 저희는 100% 심사없습니다!
                                </p>
                                <p className="text-xs text-white/80 leading-tight truncate">
                                    - 민생지원카 대표 박왕기 -
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}