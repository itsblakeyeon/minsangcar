import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiclesApi, reviewsApi } from '@/api';

import HeroSection from '@/components/landing/HeroSection';
import HeroImageSlider from '@/components/landing/HeroImageSlider';
import VehiclesSection from '@/components/landing/VehiclesSection';
import ChatConversationSection from '@/components/landing/ChatConversationSection';
import ProcessSection from '@/components/landing/ProcessSection';
import TradeInSection from '@/components/landing/TradeInSection';
import ReviewSection from '@/components/landing/ReviewSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ConsultationModal from '@/components/landing/ConsultationModal';
import FloatingBubble from '@/components/landing/FloatingBubble';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';

export default function Home() {
    const vehiclesRef = useRef(null);
    const [consultModalOpen, setConsultModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [welcomePopupOpen, setWelcomePopupOpen] = useState(true);
    
    const { data: vehicles = [] } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => vehiclesApi.list()
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['featured-reviews'],
        queryFn: () => reviewsApi.listFeatured(3)
    });
    
    const handleScrollToVehicles = () => {
        vehiclesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleConsult = (vehicle) => {
        setSelectedVehicle(vehicle);
        setConsultModalOpen(true);
    };
    
    return (
        <div className="min-h-screen bg-white">
            <HeroSection onScrollToVehicles={handleScrollToVehicles} onConsultClick={() => {
              setSelectedVehicle(null);
              setConsultModalOpen(true);
          }} />
            <HeroImageSlider />
            
            <ReviewSection reviews={reviews} id="reviews" />
            
            <div id="vehicles">
                <VehiclesSection 
                    vehicles={vehicles}
                    onConsult={handleConsult}
                    sectionRef={vehiclesRef}
                />
            </div>

            <ChatConversationSection />

            <div id="process">
                <ProcessSection />
            </div>
            <TradeInSection />
            
            <CTASection />
            
            <Footer />
            
            <ConsultationModal 
                open={consultModalOpen}
                onClose={() => setConsultModalOpen(false)}
                vehicle={selectedVehicle}
            />

            <FloatingBubble onConsultClick={() => setConsultModalOpen(true)} />

            {/* Welcome Popup */}
            <Dialog open={welcomePopupOpen} onOpenChange={setWelcomePopupOpen}>
                <DialogContent className="max-w-sm md:max-w-2xl p-0 bg-transparent border-none mx-4">
                    <button 
                        onClick={() => setWelcomePopupOpen(false)}
                        className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-white shadow-lg hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-700" />
                    </button>
                    <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69708718d96dde7f4883c932/eb25843af_Frame427326276.png" 
                        alt="민생지원카 프로모션"
                        className="w-full h-auto rounded-lg"
                    />
                </DialogContent>
            </Dialog>
            </div>
            );
            }