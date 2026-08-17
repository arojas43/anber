import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    compare_price?: number;
    image_url: string;
    images?: string[];
    category?: string;
    is_new?: boolean;
    onAddToCart: () => void;
    onAddToWishlist: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    compare_price,
    image_url,
    images,
    category,
    is_new,
    onAddToCart,
    onAddToWishlist,
}) => {
    const mainImage = images?.[0] || image_url;
    const hoverImage = images?.[1];
    const discount = compare_price && compare_price > price
        ? Math.round((1 - price / compare_price) * 100)
        : null;

    return (
        <div className="group relative flex flex-col">
            <Link to={`/products/${id}`} className="block relative overflow-hidden rounded-2xl bg-neutral-100">
                {/* Images */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={mainImage}
                        alt={name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                    />
                    {hoverImage && (
                        <img
                            src={hoverImage}
                            alt={name}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {is_new && (
                            <span className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                Nuevo
                            </span>
                        )}
                        {discount && (
                            <span className="inline-block bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Wishlist */}
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToWishlist();
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                        aria-label="Agregar a favoritos"
                    >
                        <Heart className="h-4 w-4" />
                    </motion.button>

                    {/* Add to cart CTA */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToCart();
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-white/95 hover:bg-white backdrop-blur-sm text-primary-700 font-semibold py-3 px-4 rounded-xl shadow-lg text-sm transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Agregar al carrito
                        </motion.button>
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="mt-4 flex flex-col gap-1 px-0.5">
                {category && (
                    <span className="text-[11px] font-semibold text-primary-500 uppercase tracking-widest">
                        {category}
                    </span>
                )}
                <Link to={`/products/${id}`}>
                    <h3 className="text-sm font-semibold text-neutral-800 leading-snug hover:text-primary-600 transition-colors line-clamp-2">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-neutral-900">
                        ${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    {compare_price && compare_price > price && (
                        <span className="text-sm text-neutral-400 line-through">
                            ${compare_price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
