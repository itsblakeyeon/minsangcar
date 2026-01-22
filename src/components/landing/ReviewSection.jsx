import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, Quote, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ReviewSection({ reviews }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [expandedImages, setExpandedImages] = useState({});
    
    if (!reviews || reviews.length === 0) return null;
    
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#4880EE] font-medium mb-4 block">REVIEWS</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        실제 고객님들의 이야기
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        저희와 함께 새 출발을 하신 고객님들의 생생한 후기입니다
                    </p>
                </div>
                
                <div className="flex justify-center mb-8">
                    <Link to={createPageUrl('Reviews')}>
                        <Button variant="outline" className="border-[#4880EE] text-[#4880EE] hover:bg-[#4880EE] hover:text-white">
                            전체보기
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <Card className="h-full bg-white border-slate-200 overflow-hidden hover:border-[#4880EE]/30 hover:shadow-lg transition-all">
                                {/* Images */}
                                {review.images && review.images.length > 0 && (
                                    <div>
                                        <div className="grid grid-cols-2 gap-1">
                                            {(expandedImages[review.id] ? review.images : review.images.slice(0, 2)).map((img, idx) => (
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
                                        {review.images.length > 2 && !expandedImages[review.id] && (
                                            <button
                                                onClick={() => setExpandedImages({...expandedImages, [review.id]: true})}
                                                className="mt-2 text-sm text-[#4880EE] hover:underline"
                                            >
                                                사진 더보기 (+{review.images.length - 2})
                                            </button>
                                        )}
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
                                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-4">
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
                        </div>
                    ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <Link to={createPageUrl('Reviews')}>
                            <Button className="bg-[#4880EE] hover:bg-[#4880EE]/90 text-white">
                                모든 리뷰보기
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
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
                    </section>
                    );
                    }