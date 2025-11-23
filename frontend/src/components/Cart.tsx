// src/components/Cart.tsx
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
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-700 mb-8 font-serif">Tu Carrito ({items.length} artículos)</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Cart Items */}
          <section className="lg:col-span-7">
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex py-6 px-6 bg-white rounded-2xl shadow-sm border border-neutral-100">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1596472537366-615d7dc36435?q=80&w=200&auto=format&fit=crop'}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-neutral-700">
                      <h3>
                        <Link to={`/products/${item.id}`} className="hover:text-primary-600 transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="ml-4 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">Talla: M (Ejemplo)</p>

                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 hover:bg-neutral-50 text-neutral-600 transition-colors rounded-l-lg"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-medium text-neutral-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-neutral-50 text-neutral-600 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary */}
          <section className="mt-16 rounded-2xl bg-white px-6 py-8 shadow-sm border border-neutral-100 lg:col-span-5 lg:mt-0 lg:p-8 sticky top-24">
            <h2 className="text-lg font-medium text-neutral-700 mb-6">Resumen del Pedido</h2>

            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-600">Subtotal</dt>
                <dd className="text-sm font-medium text-neutral-700">${total.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <dt className="flex items-center text-sm text-neutral-600">
                  <span>Envío</span>
                </dt>
                <dd className="text-sm font-medium text-neutral-700">Gratis</dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <dt className="text-base font-bold text-neutral-700">Total</dt>
                <dd className="text-xl font-bold text-primary-600">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link to="/checkout">
                <Button className="w-full rounded-xl py-6 text-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-300">
                  Proceder al Pago <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex justify-center text-center text-sm text-neutral-500">
              <p>
                o{' '}
                <Link to="/products" className="font-medium text-primary-600 hover:text-primary-500">
                  Continuar Comprando
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;