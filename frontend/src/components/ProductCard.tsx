// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card3D } from '@/components/Aceternity/Card3D';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category?: string;
    is_new?: boolean;
    onAddToCart: () => void;
    onAddToWishlist: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    image_url,
    category,
    is_new,
    onAddToCart,
    onAddToWishlist
}) => {
    return (
        <Link to={`/products/${id}`} className="block">
            <Card3D className="group">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50">
                        <img
                            src={image_url}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Badges */}
                        {is_new && (
                            <span className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                Nuevo
                            </span>
                        )}

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onAddToCart();
                                    }}
                                    className="flex-1 bg-white/95 hover:bg-white text-primary-600 backdrop-blur-sm shadow-xl"
                                    size="sm"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Agregar
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onAddToWishlist();
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/95 hover:bg-white border-white/50 backdrop-blur-sm shadow-xl"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-3">
                        {category && (
                            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                                {category}
                            </span>
                        )}

                        <h3 className="text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {name}
                        </h3>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-neutral-900">
                                    ${price.toFixed(2)}
                                </span>
                                <span className="text-xs text-neutral-500">MXN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card3D>
        </Link>
    );
};
