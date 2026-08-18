import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { BACKEND_URL } from '@/config';

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
          fetch(`${BACKEND_URL}/api/products/?per_page=100`),
          fetch(`${BACKEND_URL}/api/products/categories`),
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
    <div className="min-h-screen bg-neutral-50">
      {/* Page Hero Strip */}
      <div className="bg-primary-50 border-b border-primary-100">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        >
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-[0.2em] mb-4">Anber Lencería</p>
          <h1 className="text-5xl md:text-6xl font-bold font-serif text-neutral-900 mb-4">
            Nuestra <em className="not-italic text-primary-500">Colección</em>
          </h1>
          <p className="text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
            Piezas únicas diseñadas para realzar tu belleza natural
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 bg-white border-neutral-200 rounded-full text-sm shadow-sm focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategoryId === null
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategoryId === cat.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Result count */}
        {!loading && (
          <p className="text-xs text-neutral-400 mb-8 text-center tracking-wide">
            {filtered.length} {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="rounded-2xl bg-neutral-200 animate-pulse aspect-[3/4]" />
                <div className="mt-4 space-y-2.5">
                  <div className="h-2.5 bg-neutral-200 rounded-full animate-pulse w-1/3" />
                  <div className="h-3.5 bg-neutral-200 rounded-full animate-pulse w-4/5" />
                  <div className="h-4 bg-neutral-200 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-28"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                  <Search className="h-7 w-7 text-primary-300" />
                </div>
                <p className="text-neutral-700 text-lg font-medium mb-2">Sin resultados</p>
                <p className="text-neutral-400 text-sm mb-8 max-w-xs mx-auto">
                  No encontramos productos con esos criterios. Intenta con otra búsqueda.
                </p>
                <Button
                  onClick={() => { setSearchTerm(''); setSelectedCategoryId(null); }}
                  className="rounded-full bg-primary-500 hover:bg-primary-600 text-white px-8 h-11 shadow-sm"
                >
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
