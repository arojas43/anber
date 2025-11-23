// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, token, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled || isMenuOpen ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-neutral-200/50" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Anber
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-500 hover:text-primary-600 hover:border-primary-300"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary-50 text-primary-600 hover:text-primary-700">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    2
                  </span>
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex md:items-center space-x-4">
              {token ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-600 font-medium">Hola, {user?.first_name}</span>
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">Admin</Button>
                    </Link>
                  )}
                  <Button onClick={logout} variant="ghost" className="text-neutral-500 hover:text-destructive">Salir</Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-full px-6 shadow-md shadow-primary-300">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50 focus:outline-none"
              >
                <span className="sr-only">Abrir menú</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden transition-all duration-300 ease-in-out overflow-hidden", isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-b border-neutral-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                location.pathname === link.path
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-neutral-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                {user ? (
                  <span className="font-bold">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-neutral-700">
                {user ? `${user.first_name} ${user.last_name}` : 'Invitado'}
              </div>
              <div className="text-sm font-medium text-neutral-500">
                {user?.email || 'No has iniciado sesión'}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
            {token ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;