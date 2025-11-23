// src/components/Checkout.tsx
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { token } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      addToast('Debes iniciar sesión para comprar', 'error');
      // Ideally redirect to login with return url
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const response = await fetch('http://localhost:5000/api/products/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          billing_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          notes: ''
        })
      });

      if (response.ok) {
        clearCart();
        setStep(3);
      } else {
        const data = await response.json();
        addToast(data.error || 'Error al procesar el pedido', 'error');
      }
    } catch (error) {
      addToast('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
        <h2 className="text-2xl font-bold text-neutral-700 mb-4">Tu carrito está vacío</h2>
        <Link to="/products">
          <Button>Volver a la tienda</Button>
        </Link>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-700 mb-2 font-serif">¡Gracias por tu compra!</h1>
        <p className="text-neutral-600 mb-8 max-w-md">
          Hemos recibido tu pedido correctamente. Te enviaremos un correo de confirmación a {formData.email}.
        </p>
        <Link to="/">
          <Button className="rounded-full px-8 bg-primary-600 hover:bg-primary-700">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center text-neutral-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Carrito
        </Link>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact & Shipping */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-700">Envío</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Correo Electrónico</label>
                    <Input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Nombre</label>
                    <Input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Apellidos</label>
                    <Input
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Dirección</label>
                    <Input
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Ciudad</label>
                    <Input
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Código Postal</label>
                    <Input
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Teléfono</label>
                    <Input
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-700">Pago</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Número de Tarjeta</label>
                    <Input
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Vencimiento (MM/YY)</label>
                      <Input
                        name="expiry"
                        placeholder="MM/YY"
                        required
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="bg-neutral-50 border-neutral-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">CVC</label>
                      <Input
                        name="cvc"
                        placeholder="123"
                        required
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="bg-neutral-50 border-neutral-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm text-neutral-500 bg-neutral-50 p-4 rounded-lg">
                  <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                  Tus datos están encriptados y seguros.
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-xl shadow-primary-300"
              >
                {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 sticky top-24">
              <h3 className="text-lg font-bold text-neutral-700 mb-6">Resumen de Compra</h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-neutral-700 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-neutral-500">Cant: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-neutral-700">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-neutral-700 pt-2 border-t border-neutral-100">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;