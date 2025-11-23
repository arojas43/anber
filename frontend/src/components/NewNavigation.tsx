// src/components/NewNavigation.tsx
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

    const productCategories = [
        { name: 'Ver Todo', path: '/products' },
        { name: 'Lencería', path: '/products?category=lenceria' },
        { name: 'Brasieres', path: '/products?category=brasieres' },
        { name: 'Panties', path: '/products?category=panties' },
        { name: 'Pijamas', path: '/products?category=pijamas' },
    ];

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Productos', path: '/products', hasDropdown: true },
        { name: 'Acerca de', path: '/about' },
        { name: 'Contacto', path: '/contact' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/50'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary-300 transition-shadow">
                                A
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        </div>
                        <span className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                            Anber
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.path} className="relative group">
                                {link.hasDropdown ? (
                                    <>
                                        <button
                                            onMouseEnter={() => setProductsOpen(true)}
                                            onMouseLeave={() => setProductsOpen(false)}
                                            className="flex items-center gap-1 text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2"
                                        >
                                            {link.name}
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        <AnimatePresence>
                                            {productsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    onMouseEnter={() => setProductsOpen(true)}
                                                    onMouseLeave={() => setProductsOpen(false)}
                                                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2"
                                                >
                                                    {productCategories.map((category) => (
                                                        <Link
                                                            key={category.path}
                                                            to={category.path}
                                                            className="block px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
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
                                        className={`text-neutral-700 hover:text-primary-600 font-medium transition-colors ${location.pathname === link.path ? 'text-primary-600' : ''
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                <ShoppingBag className="h-6 w-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {token ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/order-history">
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg transition-shadow">
                                            {user?.first_name?.charAt(0)}
                                            {user?.last_name?.charAt(0)}
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
                                    <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full px-6 shadow-md">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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
                        className="md:hidden bg-white border-t border-neutral-200"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.path}>
                                    {link.hasDropdown ? (
                                        <div className="space-y-2">
                                            <p className="font-medium text-neutral-900">{link.name}</p>
                                            <div className="pl-4 space-y-2">
                                                {productCategories.map((category) => (
                                                    <Link
                                                        key={category.path}
                                                        to={category.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block text-neutral-600 hover:text-primary-600"
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
                                            className="block text-neutral-700 hover:text-primary-600 font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            {token ? (
                                <div className="pt-4 border-t border-neutral-200">
                                    <Link
                                        to="/order-history"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block text-neutral-700 hover:text-primary-600 font-medium mb-3"
                                    >
                                        Mi Cuenta
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-neutral-700 hover:text-primary-600 font-medium mb-3"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-neutral-600 hover:text-primary-600"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default NewNavigation;
