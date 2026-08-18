import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '@/config';

// MercadoPago logo inline SVG
const MercadoPagoLogo = () => (
    <svg viewBox="0 0 48 48" className="h-6 w-auto" aria-label="Mercado Pago">
        <circle cx="24" cy="24" r="24" fill="#00BCFF" />
        <path d="M12 26.5c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="26.5" r="4" fill="#fff" />
    </svg>
);

const Checkout: React.FC = () => {
    const { items, total, clearCart } = useCart();
    const { token, user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayWithMercadoPago = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            addToast('Debes iniciar sesión para comprar', 'error');
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            addToast('Tu carrito está vacío', 'error');
            return;
        }

        const required = ['address', 'city', 'postalCode', 'phone'] as const;
        for (const field of required) {
            if (!formData[field].trim()) {
                addToast('Completa todos los campos de envío', 'error');
                return;
            }
        }

        setLoading(true);

        try {
            const shippingAddress = `${formData.address}, ${formData.city} CP ${formData.postalCode}`;

            const response = await fetch(`${BACKEND_URL}/api/payments/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                    })),
                    shipping_address: shippingAddress,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                addToast(data.error || 'Error al crear la preferencia de pago', 'error');
                return;
            }

            // Redirect to Mercado Pago checkout
            const url = data.init_point || data.sandbox_init_point;
            if (url) {
                clearCart();
                window.location.href = url;
            } else {
                addToast('No se pudo obtener el enlace de pago', 'error');
            }
        } catch {
            addToast('Error de conexión con Mercado Pago', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-neutral-700 mb-2 font-serif">Tu carrito está vacío</h2>
                <p className="text-neutral-500 mb-6">Agrega productos antes de continuar</p>
                <Link to="/products">
                    <Button className="rounded-full bg-primary-500 hover:bg-primary-600">Explorar Productos</Button>
                </Link>
            </div>
        );
    }

    const tax = total * 0.16;
    const grandTotal = total + tax;

    return (
        <div className="min-h-screen bg-neutral-50 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al Carrito
                </Link>

                <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-7"
                    >
                        <form onSubmit={handlePayWithMercadoPago} className="space-y-6">
                            {/* Shipping */}
                            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-7">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-neutral-900">Dirección de Envío</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Correo electrónico</label>
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
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre</label>
                                        <Input
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Apellidos</label>
                                        <Input
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Dirección</label>
                                        <Input
                                            name="address"
                                            required
                                            placeholder="Calle, número, colonia"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ciudad</label>
                                        <Input
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Código Postal</label>
                                        <Input
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono</label>
                                        <Input
                                            name="phone"
                                            required
                                            placeholder="+52 55 1234 5678"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="bg-neutral-50 border-neutral-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-7">
                                <h2 className="text-lg font-semibold text-neutral-900 mb-5">Método de Pago</h2>

                                <div className="border-2 border-[#00BCFF]/30 bg-[#00BCFF]/5 rounded-xl p-5 flex items-center gap-4">
                                    <MercadoPagoLogo />
                                    <div>
                                        <p className="font-semibold text-neutral-900 text-sm">Mercado Pago</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            Tarjeta de crédito, débito, OXXO, transferencia y más
                                        </p>
                                    </div>
                                    <div className="ml-auto w-4 h-4 rounded-full bg-[#00BCFF] flex-shrink-0" />
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400 bg-neutral-50 rounded-lg p-3">
                                    <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    Serás redirigido a Mercado Pago para completar el pago de forma segura.
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-base font-semibold rounded-xl bg-[#00BCFF] hover:bg-[#00a8e0] text-white shadow-lg shadow-[#00BCFF]/30 transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Redirigiendo...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <MercadoPagoLogo />
                                        Pagar ${grandTotal.toFixed(2)} con Mercado Pago
                                    </span>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5 mt-6 lg:mt-0"
                    >
                        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-7 sticky top-24">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Resumen del Pedido</h3>

                            <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-start">
                                        <div className="h-14 w-14 rounded-xl overflow-hidden border border-neutral-100 flex-shrink-0 bg-neutral-50">
                                            {item.image_url && (
                                                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-800 truncate">{item.name}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Cant: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-neutral-100 pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>IVA (16%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Envío</span>
                                    <span className="text-green-600 font-medium">Gratis</span>
                                </div>
                                <div className="flex justify-between font-bold text-neutral-900 text-lg pt-2 border-t border-neutral-100">
                                    <span>Total</span>
                                    <span>${grandTotal.toFixed(2)} <span className="text-xs font-normal text-neutral-400">MXN</span></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
