import React from 'react';
import { motion } from 'framer-motion';

export default function TeamShowcaseSection() {
    const images = [
        'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/6bc5b2e3e_Frame427326247.png',
        'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/9ab998224_Frame427326248.png'
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="overflow-hidden rounded-lg shadow-lg"
                        >
                            <img 
                                src={image}
                                alt="Team showcase"
                                className="w-full h-auto object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}