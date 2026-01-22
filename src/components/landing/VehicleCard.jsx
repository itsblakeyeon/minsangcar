import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fuel, Calendar, Zap, MessageCircle, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VehicleCard({ vehicle, onConsult, index }) {
    const isElectric = vehicle.fuel_type === '전기' || vehicle.fuel_type === '하이브리드';
    
    return (
        <div>
            <Card className="group bg-white border-slate-200 overflow-hidden hover:border-[#4880EE]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#4880EE]/10 rounded-none">
                <div className="flex flex-col">
                    {/* Image Container */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                        {vehicle.image_url ? (
                            <img 
                                src={vehicle.image_url} 
                                alt={vehicle.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl">🚗</span>
                            </div>
                        )}
                        
                        {/* Badge */}
                         <div className="absolute top-2 left-2 lg:top-4 lg:left-4">
                             <Badge className="bg-blue-600 text-white font-medium text-xs">
                                 [무심사/저신용 전용]
                             </Badge>
                         </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                        {/* Brand & Model */}
                        <div className="mb-3 lg:mb-4">
                            <p className="text-[#4880EE] text-sm lg:text-base font-semibold mb-1">{vehicle.brand}</p>
                            <h3 className="text-lg lg:text-2xl font-bold text-slate-900 group-hover:text-[#4880EE] transition-colors leading-tight">
                                {vehicle.name}
                            </h3>
                            {vehicle.trim && (
                                <p className="text-sm lg:text-base text-slate-600 mt-1">{vehicle.trim}</p>
                            )}
                        </div>
                        
                        {/* Vehicle Info Section */}
                         <div className="mb-3 lg:mb-5 space-y-2">
                             {/* 신차/중고차 가능 */}
                             <div className="flex items-center gap-2 flex-wrap">
                                 <Badge className="bg-blue-600 text-white text-xs lg:text-sm font-medium">완전 신차</Badge>
                                 <Badge className="bg-slate-700 text-white text-xs lg:text-sm font-medium">중고차</Badge>
                                 <span className="text-xs lg:text-sm text-slate-600">둘 다 가능</span>
                             </div>
                             
                             {/* 심사 거절 없음 */}
                             <div className="flex items-center gap-2 text-xs lg:text-sm bg-green-50 p-2.5">
                                 <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 flex-shrink-0" />
                                 <p className="text-slate-700">심사거절 없어서 누구나 가능하지만<br />합리적인 가격에 제공합니다</p>
                             </div>
                         </div>
                        
                        {/* CTA */}
                         <Button 
                             onClick={() => onConsult(vehicle)}
                             className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 lg:py-12 text-base lg:text-lg rounded-none mt-auto"
                         >
                             <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                             상담 신청
                         </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}