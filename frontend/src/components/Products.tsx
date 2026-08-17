import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';

interface Category {
  id: number;
  name: string;
  image_url?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  compare_price?: number;
  description: string;
  category_id: number;
  category_name?: string;
  image_url: string;
  images?: string[];
  is_featured?: boolean;
}

const ICONS: Record<string, string> = {
  'Brasieres': '👙',
  'Conjuntos Íntimos': '💕',
  'Lencería Especial': '✨',
  'Pijamas & Loungewear': '🌙',
  'Ropa Interior': '🎀',
};

const ProductsComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();

  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const catParam = searchParams.get('category_id');
    if (catParam) setSelectedCategoryId(Number(catParam));
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products/?per_page=100'),
          fetch('/api/products/categories'),
        ]);
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.products || []);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data || []);
        }
      } catch {
        addToast('Error al cargar productos', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryId === null || p.category_id === selectedCategoryId;
    return matchesSearch && matchesCat;
  });

  const handleAddToCart = (product: Product) => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url });
    addToast(`${product.name} agregado al carrito`, 'success');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary-500 uppercase tracking-widest mb-3">Anber Lencería</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-neutral-900 mb-4">
            Nuestra <span className="italic text-primary-500">Colección</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Piezas únicas diseñadas para realzar tu belleza natural
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-13 bg-white border-neutral-200 rounded-full text-base shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-sm">
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategoryId === null
              ? 'bg-neutral-900 text-white shadow-md'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
          >
            <span className="mr-1.5">✨</span> Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedCategoryId === cat.id
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600'}`}
            >
              <span className="mr-1.5">{ICONS[cat.name] || '🛍️'}</span>
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-neutral-400 mb-6 text-center">
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'} encontrados
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-neutral-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  >
                    <ProductCard
                      {...product}
                      category={product.category_name}
                      onAddToCart={() => handleAddToCart(product)}
                      onAddToWishlist={() => addToast(`${product.name} agregado a favoritos`, 'info')}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 text-lg mb-6">No encontramos productos con esos criterios</p>
                <Button onClick={() => { setSearchTerm(''); setSelectedCategoryId(null); }} className="rounded-full bg-primary-500 hover:bg-primary-600 text-white px-8">
                  Ver todos los productos
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ProductsComponent;
