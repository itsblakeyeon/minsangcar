import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ConsultationModal from '@/components/landing/ConsultationModal';

export default function Layout({ children, currentPageName }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);

        // Handle hash scroll
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Use setTimeout to ensure the DOM is ready
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    return (
        <div className="min-h-screen bg-white pb-24">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
                :root {
                    --primary: #0052CC;
                    --primary-light: #3366FF;
                    --primary-lighter: #E0EBFF;
                    --primary-dark: #003399;
                }
                * {
                    font-family: 'Noto Sans KR', sans-serif;
                    letter-spacing: 0.01em;
                    line-height: 1.8;
                }
            `}</style>

            {/* Header */}
            <header className={`bg-white border-b border-slate-200 sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/efbac61fe_.png"
                            alt="민생지원카"
                            className="h-10"
                        />
                        <span className="font-bold text-slate-900 text-sm">저신용을 위한 민생지원카</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <a href="tel:010-3520-3234" className="hover:opacity-70 transition-opacity">
                            <span className="text-xs text-slate-500 block">상담문의</span>
                            <span className="text-sm font-medium text-slate-900">010-3520-3234</span>
                        </a>
                    </div>
                </div>
            </header>

            {children}

            {/* Fixed Bottom CTA Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-[#4880EE] hover:bg-[#3366CC] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="text-lg">무심사 테슬라 문의</span>
                    </button>
                </div>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
