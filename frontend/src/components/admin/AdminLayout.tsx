import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Productos', path: '/admin/products', icon: Package },
    { name: 'Pedidos', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Usuarios', path: '/admin/users', icon: Users },
    { name: 'Configuración', path: '/admin/settings', icon: Settings },
];

const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col h-full bg-neutral-900 text-white w-64">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        A
                    </div>
                    <span className="text-lg font-bold text-white">Anber</span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* User info */}
            {user && (
                <div className="px-4 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">Menú Principal</p>
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                isActive
                                    ? 'bg-primary-500/20 text-primary-300 shadow-sm'
                                    : 'text-white/60 hover:text-white hover:bg-white/8'
                            )}
                        >
                            <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary-400' : '')} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors"
                >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Ir a la tienda
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

const AdminLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const currentPage = navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Admin';

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed h-full w-64 z-20 shadow-xl">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-30 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 35 }}
                            className="fixed left-0 top-0 h-full z-40 md:hidden shadow-2xl"
                        >
                            <Sidebar onClose={() => setMobileOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 sm:px-8 h-16 flex items-center gap-4">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                        aria-label="Abrir menú"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-base font-semibold text-neutral-900">{currentPage}</h1>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
