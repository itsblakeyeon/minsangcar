import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, Quote, ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Reviews() {
    const [selectedImage, setSelectedImage] = useState(null);
    
    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews'],
        queryFn: () => base44.entities.Review.list('-created_date'),
        initialData: [],
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="mb-4 text-slate-600 hover:text-[#4880EE]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            홈으로 돌아가기
                        </Button>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        고객 후기
                    </h1>
                    <p className="text-slate-500">
                        저희와 함께 새 출발을 하신 고객님들의 생생한 후기입니다
                    </p>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">후기를 불러오는 중...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">아직 등록된 후기가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="h-full bg-white border-slate-200 overflow-hidden hover:border-[#4880EE]/30 hover:shadow-lg transition-all">
                                    {/* Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-1">
                                            {review.images.map((img, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="relative h-32 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => setSelectedImage(img)}
                                                >
                                                    <img 
                                                        src={img} 
                                                        alt={`${review.customer_name} 후기 ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="p-6">
                                        {/* Quote Icon */}
                                        <Quote className="w-8 h-8 text-[#4880EE]/20 mb-4" />
                                        
                                        {/* Rating */}
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-[#4880EE] fill-[#4880EE]' : 'text-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Content */}
                                        <p className="text-slate-600 leading-relaxed mb-6">
                                            "{review.content}"
                                        </p>
                                        
                                        {/* Customer Info */}
                                        <div className="pt-4 border-t border-slate-100 mt-auto">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{review.customer_name}</p>
                                                    {review.customer_situation && (
                                                        <p className="text-sm text-slate-400">{review.customer_situation}</p>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Image Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    {selectedImage && (
                        <img 
                            src={selectedImage} 
                            alt="리뷰 이미지"
                            className="w-full h-auto max-h-[90vh] object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}