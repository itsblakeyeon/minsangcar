import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, Car, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(false);
    React.useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};

const ModalContent = ({ isSuccess, isSubmitting, formData, setFormData, handleSubmit, vehicle }) => (
    <AnimatePresence mode="wait">
        {isSuccess ? (
            <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
            >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">상담 신청 완료!</h3>
                <p className="text-slate-500">빠른 시일 내에 연락드리겠습니다.</p>
            </motion.div>
        ) : (
            <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
            >
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        귀찮게 계속 연락하지 않아요.
                    </h2>
                    <p className="text-slate-600 text-sm">
                        딱 필요한 차량안내만 드립니다!
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-slate-700">이름</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="홍길동"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                                required
                                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE]"
                                autoFocus={false}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-slate-700">연락처</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="010-0000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                required
                                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE]"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-slate-700">희망 상담 방식</Label>
                        <Tabs 
                            value={formData.preferred_method} 
                            onValueChange={(value) => setFormData({...formData, preferred_method: value})}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-3 bg-slate-100 h-12">
                                <TabsTrigger 
                                    value="문자"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full"
                                >
                                    문자
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="전화"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full"
                                >
                                    전화
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="상관없음"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full"
                                >
                                    상관없음
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-slate-700">추가 문의사항 (선택)</Label>
                        <Textarea
                            placeholder="궁금하신 점이나 요청사항을 적어주세요"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            rows={3}
                            className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE] resize-none"
                        />
                    </div>
                    
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#4880EE] hover:bg-[#3366CC] text-white font-semibold py-6 text-lg rounded-xl"
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
                </form>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function ConsultationModal({ open, onClose, vehicle }) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        preferred_method: '상관없음',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await base44.entities.Consultation.create({
            ...formData,
            vehicle_name: vehicle?.name || ''
        });
        
        setIsSubmitting(false);
        setIsSuccess(true);

        // Meta Pixel Lead Event
        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
            window.fbq('track', 'Lead', {
                content_name: vehicle?.name || '일반 상담',
                content_category: '장기렌트 상담'
            });
        }

        setTimeout(() => {
            setIsSuccess(false);
            setFormData({
                customer_name: '',
                phone: '',
                preferred_method: '상관없음',
                message: ''
            });
            onClose();
        }, 2000);
    };

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onClose}>
                <DrawerContent className="bg-white border-t border-slate-200">
                    <div className="mx-auto w-full max-w-lg px-6 pt-12 pb-6">
                        <ModalContent 
                            isSuccess={isSuccess}
                            isSubmitting={isSubmitting}
                            formData={formData}
                            setFormData={setFormData}
                            handleSubmit={handleSubmit}
                            vehicle={vehicle}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900">
                <ModalContent 
                    isSuccess={isSuccess}
                    isSubmitting={isSubmitting}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    vehicle={vehicle}
                />
            </DialogContent>
        </Dialog>
    );
}