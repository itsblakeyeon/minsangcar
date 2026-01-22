import React from 'react';

export default function HeroImageSlider() {
    const heroImage = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/dcd50def6_4141.png';
    
    return (
        <section className="py-8">
            <style>{`
                @keyframes panImage {
                    0% { background-position: 0% center; }
                    100% { background-position: 100% center; }
                }
                .animate-pan {
                    animation: panImage 12s ease-in-out infinite;
                }
            `}</style>

            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
                <div 
                    className="w-full h-40 md:h-44 animate-pan bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${heroImage}')`,
                        backgroundSize: 'auto 100%',
                        backgroundPosition: '0% center'
                    }}
                />
            </div>
        </section>
    );
}