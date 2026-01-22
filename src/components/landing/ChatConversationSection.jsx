import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChatConversationSection() {
    const scrollContainer = useRef(null);
    
    const conversations = [
        {
            id: 1,
            image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/6777c42eb_01.png'
        },
        {
            id: 2,
            image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/1250363b6_02.png'
        },
        {
            id: 3,
            image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/b63c7a94e_03.png'
        },
        {
            id: 4,
            image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/9802193ec_04.png'
        }
    ];

    const scroll = (direction) => {
        if (scrollContainer.current) {
            const scrollAmount = 400;
            scrollContainer.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        실제 고객상담 내용
                    </h2>
                    <p className="text-lg text-slate-600">
                        한 분 한 분 소중히 상담해 드려요!
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Scroll Container */}
                    <div
                        ref={scrollContainer}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {conversations.map((conv, index) => (
                            <motion.div
                                key={conv.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex-shrink-0"
                            >
                                <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                                    <img
                                        src={conv.image}
                                        alt={`고객상담 ${conv.id}`}
                                        loading="lazy"
                                        className="w-72 h-auto object-cover"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 z-10 p-2 bg-[#4880EE] text-white rounded-full hover:bg-[#3366CC] transition-colors opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 z-10 p-2 bg-[#4880EE] text-white rounded-full hover:bg-[#3366CC] transition-colors opacity-0 group-hover:opacity-100 duration-300"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}