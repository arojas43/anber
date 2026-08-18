// src/components/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Truck, Shield, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { BACKEND_URL } from '@/config';

interface ProductVariant {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    compare_price: number | null;
    rating: number;
    reviews: number;
    images: string[];
    image_url: string;
    variants: ProductVariant[];
    features: string[];
    stock_quantity: number;
    category_name: string;
}

const ProductDetail: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(0);

    const { addItem } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/api/products/${id}`);

                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }

                const data = await response.json();

                // Build images array from unique images only
                const rawImages: string[] = data.images?.length > 0 ? data.images : [];
                const uniqueImages = [...new Set([data.image_url, ...rawImages].filter(Boolean))] as string[];

                const transformedProduct: Product = {
                    ...data,
                    rating: 0,
                    reviews: 0,
                    images: uniqueImages,
                    features: [
                        'Material premium de alta calidad',
                        'Diseño exclusivo',
                        'Confort garantizado',
                        'Lavado fácil',
                        'Garantía de satisfacción'
                    ]
                };

                setProduct(transformedProduct);
                document.title = `${data.name} | Anber Lencería`;

                if (data.variants && data.variants.length > 0) {
                    setSelectedSize(data.variants[0].name);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }

        return () => {
            document.title = 'Anber — Lencería Premium | Tienda Online México';
        };
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image_url: product.image_url
        });
        addToast(`Agregado al carrito: ${product.name}`, 'success');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Producto no encontrado</h2>
                <p className="text-neutral-600 mb-6">{error || 'El producto que buscas no existe o ha sido eliminado.'}</p>
                <Link to="/products">
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                        Volver a la tienda
                    </Button>
                </Link>
            </div>
        );
    }

    const inStock = product.stock_quantity > 0;

    return (
        <div className="bg-neutral-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav aria-label="Ruta de navegación" className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-neutral-400">
                        <li><Link to="/" className="hover:text-primary-600 transition-colors">Inicio</Link></li>
                        <li aria-hidden="true">/</li>
                        <li><Link to="/products" className="hover:text-primary-600 transition-colors">Productos</Link></li>
                        <li aria-hidden="true">/</li>
                        <li className="text-neutral-700 font-medium truncate max-w-[200px]">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Images */}
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100"
                        >
                            <img
                                src={product.images[currentImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {!inStock && (
                                <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold tracking-wide">Agotado</span>
                                </div>
                            )}
                        </motion.div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        aria-label={`Ver imagen ${idx + 1}`}
                                        aria-pressed={currentImage === idx}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                            currentImage === idx
                                                ? 'border-primary-500 shadow-sm'
                                                : 'border-neutral-200 hover:border-primary-300'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-neutral-900 font-serif mb-2">{product.name}</h1>
                            {product.category_name && (
                                <span className="text-xs font-semibold text-primary-400 uppercase tracking-[0.12em]">
                                    {product.category_name}
                                </span>
                            )}
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold text-primary-600">${product.price.toFixed(2)}</span>
                            {product.compare_price && (
                                <>
                                    <span className="text-2xl text-neutral-400 line-through">${product.compare_price.toFixed(2)}</span>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                        Ahorra {Math.round((1 - product.price / product.compare_price) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-neutral-600 text-lg leading-relaxed">{product.description}</p>

                        {/* Size Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-neutral-900 mb-3">Variante / Talla</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedSize(variant.name)}
                                            className={`min-w-[3rem] px-4 h-12 rounded-lg border-2 font-bold transition-all ${selectedSize === variant.name
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-neutral-200 hover:border-primary-300 text-neutral-600'
                                                }`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-bold text-neutral-900 mb-3">Cantidad</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="h-12 w-12 rounded-lg border-2 border-neutral-200 hover:border-primary-300 text-neutral-600 font-bold"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold text-neutral-900 w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-12 w-12 rounded-lg border-2 border-neutral-200 hover:border-primary-300 text-neutral-600 font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-full py-6 text-lg shadow-lg shadow-primary-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                {inStock ? 'Agregar al Carrito' : 'Agotado'}
                            </Button>
                            <Button
                                variant="outline"
                                aria-label="Agregar a favoritos"
                                className="border-2 border-primary-200 text-primary-700 hover:bg-primary-50 rounded-full px-6"
                            >
                                <Heart className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 space-y-3">
                            <h3 className="font-bold text-neutral-900 mb-4">Características</h3>
                            {product.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-neutral-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary-100">
                                <Truck className="h-6 w-6 text-primary-600" />
                                <div>
                                    <p className="font-bold text-sm text-neutral-900">Envío Gratis</p>
                                    <p className="text-xs text-neutral-500">En pedidos +$999</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary-100">
                                <Shield className="h-6 w-6 text-primary-600" />
                                <div>
                                    <p className="font-bold text-sm text-neutral-900">Compra Segura</p>
                                    <p className="text-xs text-neutral-500">Pago protegido</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
