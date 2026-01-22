import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Shield, CheckCircle, Award, Wallet, Users, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection({ onScrollToVehicles, onConsultClick }) {
    const heroImage = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/dcd50def6_4141.png';
    
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0052CC] border-b-4 border-[#0052CC]">
            {/* Background Pattern - Removed */}
            
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <div>
                    {/* Hero Image */}
                    <div className="w-screen mb-8 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/670e504a2_.png"
                            alt="차량 이미지"
                            loading="eager"
                            className="w-full max-w-[1200px] h-auto mx-auto block"
                        />
                    </div>
                    
                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        <div className="inline-block bg-white text-[#0052CC] px-3 py-1 rounded-full text-sm md:text-base font-semibold mb-3">최근 3년이내</div><br />
                        음주운전만 없다면<br />
                        <span className="text-white">
                            원하는 차량 즉시출고!
                        </span>
                    </h1>
                    
                    <div className="max-w-2xl mx-auto mb-10">
                        <p className="text-base md:text-lg text-white/85 leading-relaxed mb-4">
                            저신용자, 개인회생, 연체이력<br />
                            민생지원카에선 진짜 상관없어요.
                        </p>
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 border border-white/40 rounded-full">
                                <Check className="w-4 h-4 text-white" />
                                <span className="font-semibold text-white text-sm">100% 보장</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 mb-12 px-2 md:px-0 max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 px-3 py-3 md:px-5 md:py-3 bg-white border-3 border-white">
                            <div className="flex items-center justify-center w-10 h-10 md:w-10 md:h-10 rounded-full bg-amber-500 flex-shrink-0">
                                <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm md:text-sm font-bold text-slate-900">
                                    신용 심사<br />100% 없음
                                </div>
                                <div className="text-xs md:text-xs text-slate-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 md:w-3 md:h-3" />
                                    인증
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-3 md:px-5 md:py-3 bg-white border-3 border-white">
                            <div className="flex items-center justify-center w-10 h-10 md:w-10 md:h-10 rounded-full bg-rose-500 flex-shrink-0">
                                <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm md:text-sm font-bold text-slate-900">
                                    누적 가입자<br />10360명
                                </div>
                                <div className="text-xs md:text-xs text-slate-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 md:w-3 md:h-3" />
                                    인증
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Consultation Button */}
                    <button 
                        onClick={onConsultClick}
                        className="w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-lg transition-colors mt-2 mb-16 md:mb-8"
                    >
                        상담신청하기
                    </button>

                </div>
            </div>
        </section>
    );
}