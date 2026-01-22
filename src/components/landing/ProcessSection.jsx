import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PhoneCall, CheckCircle, Car } from 'lucide-react';

const steps = [
    {
        icon: FileText,
        title: '상담 신청',
        description: '원하시는 차량을 선택하세요.'
    },
    {
        icon: PhoneCall,
        title: '전문 상담',
        description: '담당 상담사가 맞춤 견적을 상세히 안내드려요.'
    },
    {
        icon: CheckCircle,
        title: '확인 & 계약',
        description: '승인 거절이 없어요! 단 하나, 음주여부가 있는지만 확인합니다! (다른 곳에서 거절 받은 이력이 있어도 괜찮아요.)'
    },
    {
        icon: Car,
        title: '차량 인도',
        description: '전국 어디든 원하는 곳에서 받을 수 있어요.'
    }
];

export default function ProcessSection() {
    return (
        <section className="py-24 bg-white border-b-4 border-slate-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#4880EE] font-medium mb-4 block">PROCESS</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        간편한 4단계 진행 절차
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        복잡한 서류, 어려운 절차 없이 쉽고 빠르게 진행됩니다
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="text-center relative z-10">
                                {/* Icon */}
                                    <div className="w-24 h-24 bg-blue-50 border-3 border-[#4880EE] flex items-center justify-center mx-auto mb-6 hover:bg-[#4880EE] transition-all">
                                    <step.icon className="w-10 h-10 text-[#4880EE] hover:text-white" />
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}