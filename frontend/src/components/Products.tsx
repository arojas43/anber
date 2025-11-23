// src/components/Products.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Heart, Sparkles, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  is_new?: boolean;
}

const ProductsComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams] = useSearchParams();

  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          addToast('Error al cargar productos', 'error');
        }
      } catch (error) {
        addToast('Error de conexión', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url
    });
    addToast(`Agregado al carrito: ${product.name}`, 'success');
  };

  const handleWishlist = (productName: string) => {
    addToast(`Agregado a favoritos: ${productName}`, 'info');
  };

  const categories = [
    { id: 'all', name: 'Todo', icon: '✨' },
    { id: 'lenceria', name: 'Lencería', icon: '💕' },
    { id: 'brasieres', name: 'Brasieres', icon: '👗' },
    { id: 'panties', name: 'Panties', icon: '🎀' },
    { id: 'pijamas', name: 'Pijamas', icon: '🌙' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 mb-4 font-serif">
            Nuestra Colección
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Descubre piezas únicas diseñadas para realzar tu belleza natural ✨
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
              <Input
                placeholder="Buscar productos mágicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-full text-lg focus:border-primary-400 focus:ring-4 focus:ring-primary-100 shadow-lg shadow-primary-200/50"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-400/50 scale-105'
                  : 'bg-white/90 backdrop-blur-sm text-primary-700 hover:bg-primary-50 border-2 border-primary-200 shadow-md hover:shadow-lg'
                  }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/80 rounded-3xl h-[500px] animate-pulse backdrop-blur-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-gradient-to-br from-white to-primary-50/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary-100"
                >
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Badge */}
                    {product.is_new && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 left-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg"
                      >
                        ✨ Nuevo
                      </motion.span>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleWishlist(product.name)}
                        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm text-primary-600 flex items-center justify-center hover:bg-primary-50 transition-colors shadow-lg border-2 border-primary-200"
                      >
                        <Heart className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-primary-500 uppercase tracking-wider font-bold">{product.category}</span>
                    </div>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-neutral-500 ml-2">(4.8)</span>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-full px-6 py-3 shadow-lg shadow-primary-400/50 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-[100px]"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-neutral-600 text-xl mb-4">No encontramos productos con esos criterios</p>
            <Button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full px-8"
            >
              Ver todos los productos
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsComponent;