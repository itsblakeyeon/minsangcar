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
import { consultationsApi } from '@/api';
import { Loader2, CheckCircle, Car, Phone, User, Calendar, DollarSign } from 'lucide-react';
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

const ModalContent = ({ isSuccess, isSubmitting, formData, setFormData, handleSubmit, vehicle, errors, setErrors }) => (
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
                                onChange={(e) => {
                                    setFormData({...formData, customer_name: e.target.value});
                                    if (errors?.customer_name) setErrors({...errors, customer_name: ''});
                                }}
                                className={`pl-10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE] ${errors?.customer_name ? 'border-red-500 border-2' : 'border-slate-200'}`}
                                autoFocus={false}
                            />
                        </div>
                        {errors?.customer_name && <p className="text-red-500 text-sm">{errors.customer_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700">연락처</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="01012345678"
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({...formData, phone: e.target.value});
                                    if (errors?.phone) setErrors({...errors, phone: ''});
                                }}
                                className={`pl-10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE] ${errors?.phone ? 'border-red-500 border-2' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors?.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-slate-700">차량 필요 시기</Label>
                        <Tabs
                            value={formData.timeline}
                            onValueChange={(value) => setFormData({...formData, timeline: value})}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-3 bg-slate-100 h-12">
                                <TabsTrigger
                                    value="최대한 빨리"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full text-xs sm:text-sm"
                                >
                                    최대한 빨리
                                </TabsTrigger>
                                <TabsTrigger
                                    value="1~2개월 내"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full text-xs sm:text-sm"
                                >
                                    1~2개월 내
                                </TabsTrigger>
                                <TabsTrigger
                                    value="늦어도 상관없음"
                                    className="data-[state=active]:bg-[#4880EE] data-[state=active]:text-white h-full text-xs sm:text-sm"
                                >
                                    늦어도 상관없음
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700">매월 얼마까지 낼 수 있나요?</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="예: 50만원"
                                value={formData.monthly_budget}
                                onChange={(e) => setFormData({...formData, monthly_budget: e.target.value})}
                                className="pl-10 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4880EE] focus:ring-[#4880EE] border-slate-200"
                            />
                        </div>
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
        timeline: '최대한 빨리',
        monthly_budget: '',
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
            newErrors.customer_name = '이름을 입력해주세요';
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
                vehicle_name: vehicle?.name || ''
            });

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
                    timeline: '최대한 빨리',
                    monthly_budget: '',
                    message: ''
                });
                onClose();
            }, 2000);
        } catch (error) {
            alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
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
                            errors={errors}
                            setErrors={setErrors}
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
                    errors={errors}
                    setErrors={setErrors}
                />
            </DialogContent>
        </Dialog>
    );
}