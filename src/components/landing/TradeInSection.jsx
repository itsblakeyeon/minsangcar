import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Zap, RefreshCw } from 'lucide-react';

export default function TradeInSection() {
    const services = [
        {
            icon: DollarSign,
            title: '중고 차량 판매',
            description: '타던 차를 최고가로'
        },
        {
            icon: Zap,
            title: '중도해지 위약금',
            description: '부담 없이 처리'
        },
        {
            icon: RefreshCw,
            title: '차량 승계',
            description: '간편한 절차'
        }
    ];

    return (
        <section className="py-24 bg-slate-900 border-b-4 border-slate-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        이미 타고 계신 차량이 있으신가요?
                    </h2>
                    <p className="text-slate-300 text-lg">
                        중고 차량 판매 / 중도해지 위약금 / 차량 승계도 도와주겠습니다!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-[#0052CC] rounded-lg flex items-center justify-center mx-auto mb-6">
                                <service.icon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                            <p className="text-slate-400">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}