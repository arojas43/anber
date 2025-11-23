// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-50 via-secondary-50 to-white border-t border-primary-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                A
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Anber
              </span>
            </Link>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-xs">
              Lencería premium diseñada para realzar tu belleza natural. Calidad, elegancia y comodidad en cada pieza.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li>
                <a href="mailto:hola@anber.com" className="hover:text-primary-600 transition-colors">
                  hola@anber.com
                </a>
              </li>
              <li>
                <a href="tel:+525512345678" className="hover:text-primary-600 transition-colors">
                  +52 55 1234 5678
                </a>
              </li>
              <li className="text-neutral-500">
                Lun - Vie: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500 text-center md:text-left">
              © {new Date().getFullYear()} Anber. Todos los derechos reservados.
            </p>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              Hecho con <Heart className="h-4 w-4 text-primary-500 fill-current" /> en México
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;