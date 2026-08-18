import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-primary-50 via-secondary-50 to-white border-t border-primary-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2" aria-label="Anber — Inicio">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                A
              </div>
              <span className="text-2xl font-bold text-primary-600">
                Anber
              </span>
            </Link>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-xs">
              Lencería premium diseñada para realzar tu belleza natural. Calidad, elegancia y comodidad en cada pieza.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/anber"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com/anber"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com/anber"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Twitter"
                className="h-10 w-10 rounded-full bg-white border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm"
              >
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Enlaces del footer">
            <h3 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Productos', to: '/products' },
                { label: 'Acerca de', to: '/about' },
                { label: 'Contacto', to: '/contact' },
                { label: 'Carrito', to: '/cart' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
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
              <li className="text-neutral-500">Lun — Vie: 9:00 AM – 6:00 PM</li>
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
              Hecho con{' '}
              <Heart className="h-4 w-4 text-primary-500 fill-current" aria-hidden="true" />{' '}
              en México
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
