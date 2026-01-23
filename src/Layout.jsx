import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Layout({ children, currentPageName }) {
    const [isScrolled, setIsScrolled] = useState(false);
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

    const tabs = [
        { label: '고객후기', path: createPageUrl('Reviews') },
        { label: '신차장기렌트', path: createPageUrl('Home') + '#vehicles' },
        { label: '진행과정', path: createPageUrl('Home') + '#process' }
    ];

    const isActive = (path) => {
        const currentPath = location.pathname;
        const targetUrl = new URL(path, window.location.origin);
        const targetPath = targetUrl.pathname;

        if (targetPath === '/Home' || targetPath === '/') {
            return currentPath === '/' || currentPath === '/Home';
        }

        return currentPath === targetPath;
    };

    return (
        <div className="min-h-screen bg-white">
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

                {/* Navigation Tabs */}
                <div className="border-t border-slate-200 bg-white">
                    <div className="max-w-6xl mx-auto px-6 flex gap-8">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.label}
                                to={tab.path}
                                className={`py-3 text-sm font-medium transition-colors border-b-2 ${isActive(tab.path)
                                    ? 'border-[#4880EE] text-[#4880EE]'
                                    : 'border-transparent text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}