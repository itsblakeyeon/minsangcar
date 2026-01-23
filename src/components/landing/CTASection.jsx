import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, CheckCircle, User, Car, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { consultationsApi } from '@/api';

export default function CTASection() {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        vehicle_name: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validatePhone = (phone) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.customer_name) {
            newErrors.customer_name = '성함을 입력해주세요';
        }
        if (!formData.phone) {
            newErrors.phone = '연락처를 입력해주세요';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = '01012345678 형식으로 입력해주세요';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        setIsSubmitting(true);
        try {
            await consultationsApi.create({
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

            setIsSuccess(true);
            setFormData({
                customer_name: '',
                phone: '',
                vehicle_name: '',
                message: ''
            });

            // 2초 후 폼으로 복귀
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
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
                    <div className="max-w-xl mx-auto mb-8">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">상담 신청 완료!</h3>
                                    <p className="text-white/80 text-lg">빠른 시일 내에 연락드리겠습니다.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4"
                                >
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="홍길동"
                                                value={formData.customer_name}
                                                onChange={(e) => {
                                                    setFormData({...formData, customer_name: e.target.value});
                                                    if (errors.customer_name) setErrors({...errors, customer_name: ''});
                                                }}
                                                className={`pl-10 bg-white text-slate-900 h-12 ${errors.customer_name ? 'border-2 border-red-500' : 'border-none'}`}
                                            />
                                        </div>
                                        {errors.customer_name && <p className="text-red-300 text-sm mt-1">{errors.customer_name}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="01012345678"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    setFormData({...formData, phone: e.target.value});
                                                    if (errors.phone) setErrors({...errors, phone: ''});
                                                }}
                                                className={`pl-10 bg-white text-slate-900 h-12 ${errors.phone ? 'border-2 border-red-500' : 'border-none'}`}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-300 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="relative">
                                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="희망 차종"
                                            value={formData.vehicle_name}
                                            onChange={(e) => setFormData({...formData, vehicle_name: e.target.value})}
                                            className="pl-10 bg-white text-slate-900 border-none h-12"
                                        />
                                    </div>
                                    <Textarea
                                        placeholder="문의사항"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="bg-white text-slate-900 border-none min-h-24"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl font-semibold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                신청 중...
                                            </>
                                        ) : (
                                            '무료 상담 신청하기'
                                        )}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

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