import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartComponent: React.FC = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="bg-white p-8 rounded-full shadow-sm mb-6">
          <ShoppingBag className="h-16 w-16 text-neutral-300" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-700 mb-2 font-serif">Tu carrito está vacío</h2>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Parece que aún no has añadido nada. Explora nuestra colección y encuentra algo especial para ti.
        </p>
        <Link to="/products">
          <Button className="rounded-full px-8 py-6 text-lg bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200">
            Ver Colección
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-32 lg:pb-12 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8 font-serif">
          Tu Carrito <span className="text-neutral-400 font-normal text-xl">({items.length} {items.length === 1 ? 'artículo' : 'artículos'})</span>
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Cart Items */}
          <section className="lg:col-span-7" aria-label="Artículos en el carrito">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5 px-4 sm:px-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
                  {/* Image */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1596472537366-615d7dc36435?q=80&w=200&auto=format&fit=crop'}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 min-w-0">
                    {/* Name + Price */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold text-neutral-800 leading-snug line-clamp-2">
                        <Link to={`/products/${item.id}`} className="hover:text-primary-600 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-sm font-bold text-neutral-900 flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-400">
                      ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN c/u
                    </p>

                    {/* Quantity + Delete */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border border-neutral-200 rounded-lg" role="group" aria-label={`Cantidad de ${item.name}`}>
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          aria-label="Reducir cantidad"
                          className="p-2 hover:bg-neutral-50 text-neutral-600 transition-colors rounded-l-lg"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-neutral-700 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                          className="p-2 hover:bg-neutral-50 text-neutral-600 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary — desktop sidebar */}
          <section
            className="hidden lg:block mt-0 rounded-2xl bg-white px-6 py-8 shadow-sm border border-neutral-100 lg:col-span-5 sticky top-24"
            aria-label="Resumen del pedido"
          >
            <h2 className="text-lg font-semibold text-neutral-800 mb-6">Resumen del Pedido</h2>

            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-600">Subtotal</dt>
                <dd className="text-sm font-medium text-neutral-700">
                  ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <dt className="text-sm text-neutral-600">Envío</dt>
                <dd className="text-sm font-medium text-green-600">Gratis</dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <dt className="text-base font-bold text-neutral-800">Total</dt>
                <dd className="text-xl font-bold text-primary-600">
                  ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link to="/checkout">
                <Button className="w-full rounded-xl py-6 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
                  Proceder al Pago <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-5 text-center text-sm text-neutral-500">
              o{' '}
              <Link to="/products" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Continuar Comprando
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile fixed checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 lg:hidden z-40 shadow-lg">
        <Link to="/checkout">
          <Button className="w-full rounded-xl py-5 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm">
            Pagar ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartComponent;
