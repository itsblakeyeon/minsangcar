import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function CTASection() {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        vehicle_name: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_name || !formData.phone) {
            toast.error('성함과 연락처는 필수입니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            await base44.entities.Consultation.create({
                ...formData,
                status: '대기중'
            });

            // Meta Pixel Lead Event
            if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
                window.fbq('track', 'Lead', {
                    content_name: formData.vehicle_name || '일반 상담',
                    content_category: '장기렌트 상담'
                });
            }

            toast.success('상담 신청이 완료되었습니다!');
            setFormData({
                customer_name: '',
                phone: '',
                vehicle_name: '',
                message: ''
            });
        } catch (error) {
            toast.error('신청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <section className="py-24 bg-[#4880EE] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        구질구질한 세일즈하지 않아요.<br />
                        깔끔하게 견적만 받으세요!
                    </h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        저신용, 개인회생도 문제없습니다.<br />
                        전문 상담사가 최적의 조건을 찾아드립니다.
                    </p>
                    
                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                            <Input
                                placeholder="성함"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                                className="bg-white text-slate-900 border-none h-12"
                                required
                            />
                            <Input
                                placeholder="연락처"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="bg-white text-slate-900 border-none h-12"
                                required
                            />
                            <Input
                                placeholder="희망하시는 차종"
                                value={formData.vehicle_name}
                                onChange={(e) => setFormData({...formData, vehicle_name: e.target.value})}
                                className="bg-white text-slate-900 border-none h-12"
                            />
                            <Textarea
                                placeholder="궁금하신 부분을 남겨주세요"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="bg-white text-slate-900 border-none min-h-24"
                            />
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl font-semibold"
                            >
                                {isSubmitting ? '전송 중...' : '상담 요청하기'}
                            </Button>
                        </div>
                    </form>

                    {/* Phone Number */}
                    <div className="flex items-center justify-center gap-2 text-white">
                        <Phone className="w-5 h-5" />
                        <span className="text-lg">먼저 연락하시려면</span>
                        <a 
                            href="tel:010-3520-3234" 
                            className="text-2xl font-bold hover:underline"
                        >
                            010-3520-3234
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}