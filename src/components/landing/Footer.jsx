import React from 'react';
import { Car } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-16 bg-slate-900 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-[#4880EE] flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">민생지원카</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            저신용·개인회생 전문 장기렌트 컨설팅<br />
                            누구나 내 차를 가질 수 있도록 도와드립니다.
                        </p>
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">고객센터</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>전화: 010-3520-3234</li>
                            <li>운영시간: 평일 09:00 - 18:00</li>
                            <li>점심시간: 12:00 - 13:00</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}