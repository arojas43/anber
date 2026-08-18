import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NewNavigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const { user, token, logout } = useAuth();
    const { items } = useCart();
    const location = useLocation();

    const isHome = location.pathname === '/';
    const isTransparent = isHome && !scrolled && !isMenuOpen;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

    const productCategories = [
        { name: 'Ver Todo', path: '/products' },
        { name: 'Brasieres', path: '/products?category=brasieres' },
        { name: 'Conjuntos Íntimos', path: '/products?category=conjuntos' },
        { name: 'Pijamas', path: '/products?category=pijamas' },
        { name: 'Lencería Especial', path: '/products?category=lenceria' },
    ];

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Productos', path: '/products', hasDropdown: true },
        { name: 'Acerca de', path: '/about' },
        { name: 'Contacto', path: '/contact' },
    ];

    const textColor = isTransparent
        ? 'text-white/90 hover:text-white'
        : 'text-neutral-700 hover:text-primary-600';

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isTransparent
                    ? 'bg-transparent'
                    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/50'
            }`}
            aria-label="Navegación principal"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group" aria-label="Anber — Inicio">
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-primary-600 transition-colors">
                                A
                            </div>
                        </div>
                        <span className={`text-2xl font-serif font-bold transition-colors ${isTransparent ? 'text-white' : 'text-primary-600'}`}>
                            Anber
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.path} className="relative">
                                {link.hasDropdown ? (
                                    <>
                                        <button
                                            onMouseEnter={() => setProductsOpen(true)}
                                            onMouseLeave={() => setProductsOpen(false)}
                                            aria-haspopup="true"
                                            aria-expanded={productsOpen}
                                            className={`flex items-center gap-1 font-medium transition-colors py-2 ${textColor}`}
                                        >
                                            {link.name}
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        <AnimatePresence>
                                            {productsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                                    onMouseEnter={() => setProductsOpen(true)}
                                                    onMouseLeave={() => setProductsOpen(false)}
                                                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-neutral-100 py-2"
                                                    role="menu"
                                                >
                                                    {productCategories.map((category) => (
                                                        <Link
                                                            key={category.path}
                                                            to={category.path}
                                                            role="menuitem"
                                                            className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`font-medium transition-colors ${textColor} ${
                                            location.pathname === link.path
                                                ? isTransparent ? 'text-white' : 'text-primary-600'
                                                : ''
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            aria-label={`Carrito de compras${cartItemsCount > 0 ? `, ${cartItemsCount} artículos` : ''}`}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`relative transition-colors ${
                                    isTransparent
                                        ? 'text-white hover:bg-white/10'
                                        : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
                                }`}
                            >
                                <ShoppingBag className="h-6 w-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* Auth — desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {token ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/order-history" aria-label="Mi cuenta">
                                        <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-primary-600 transition-colors">
                                            {(user?.first_name?.charAt(0) || '') + (user?.last_name?.charAt(0) || '')}
                                        </div>
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin">
                                            <Button variant="outline" size="sm" className="border-primary-300 text-primary-700 hover:bg-primary-50">
                                                Admin
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login">
                                    <Button className={`rounded-full px-6 shadow-sm transition-colors ${
                                        isTransparent
                                            ? 'bg-white text-primary-700 hover:bg-primary-50'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                                    }`}>
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                            aria-expanded={isMenuOpen}
                            className={`md:hidden p-2 rounded-lg transition-colors ${
                                isTransparent
                                    ? 'text-white hover:bg-white/10'
                                    : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                            }`}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-1">
                            {navLinks.map((link) => (
                                <div key={link.path}>
                                    {link.hasDropdown ? (
                                        <div>
                                            <p className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-2">
                                                {link.name}
                                            </p>
                                            <div className="space-y-0.5">
                                                {productCategories.map((category) => (
                                                    <Link
                                                        key={category.path}
                                                        to={category.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors text-sm"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                                location.pathname === link.path
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 mt-2 border-t border-neutral-100">
                                {token ? (
                                    <div className="space-y-0.5">
                                        <Link
                                            to="/order-history"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-3 py-2.5 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 font-medium transition-colors"
                                        >
                                            Mi Cuenta
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block px-3 py-2.5 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 font-medium transition-colors"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="block w-full text-left px-3 py-2.5 rounded-lg text-neutral-500 hover:bg-neutral-50 hover:text-primary-600 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-xl">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NewNavigation;
