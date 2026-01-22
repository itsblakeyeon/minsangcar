import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from './VehicleCard';

export default function VehiclesSection({ vehicles, onConsult, sectionRef }) {
    const [fuelFilter, setFuelFilter] = useState('all');
    
    let filteredVehicles = [...vehicles];
    
    // 차종 필터
    if (fuelFilter === 'electric') {
        filteredVehicles = filteredVehicles.filter(v => v.fuel_type === '전기');
    } else if (fuelFilter === 'gas') {
        filteredVehicles = filteredVehicles.filter(v => v.fuel_type === '가솔린' || v.fuel_type === '디젤' || v.fuel_type === '하이브리드');
    }
    
    return (
        <section ref={sectionRef} className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        지금 당장 출고가능한 차량
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-6 md:mb-8">
                        리스트에 없거나, 원하시는 차량이 있으시다면 별도 문의해 주세요!
                    </p>
                </motion.div>
                
                {/* Filters */}
                <div className="mb-6 md:mb-10 max-w-md mx-auto">
                    <Tabs value={fuelFilter} onValueChange={setFuelFilter} className="w-full">
                        <TabsList className="bg-slate-100 p-1 w-full h-12">
                            <TabsTrigger 
                                value="all"
                                className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white text-slate-600 px-6 h-10 flex-1"
                            >
                                모두
                            </TabsTrigger>
                            <TabsTrigger 
                                value="electric"
                                className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white text-slate-600 px-6 h-10 flex-1"
                            >
                                전기차
                            </TabsTrigger>
                            <TabsTrigger 
                                value="gas"
                                className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white text-slate-600 px-6 h-10 flex-1"
                            >
                                내연기관
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                {/* Vehicles Grid */}
                {filteredVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {filteredVehicles.map((vehicle, index) => (
                            <VehicleCard 
                                key={vehicle.id}
                                vehicle={vehicle}
                                onConsult={onConsult}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-400">해당 카테고리의 차량이 없습니다.</p>
                    </div>
                )}
            </div>
        </section>
    );
}