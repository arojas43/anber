import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type ResultType = 'success' | 'failure' | 'pending';

const config: Record<ResultType, { icon: React.ElementType; color: string; bg: string; title: string; msg: string }> = {
    success: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: '¡Pago exitoso!',
        msg: 'Tu pedido ha sido confirmado. Recibirás un correo con los detalles de tu compra.',
    },
    failure: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-50',
        title: 'Pago rechazado',
        msg: 'No pudimos procesar tu pago. Intenta con otro método o verifica los datos de tu tarjeta.',
    },
    pending: {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        title: 'Pago pendiente',
        msg: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
    },
};

const PaymentResult: React.FC<{ type: ResultType }> = ({ type }) => {
    const [params] = useSearchParams();
    const paymentId = params.get('payment_id');
    const { icon: Icon, color, bg, title, msg } = config[type];

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl border border-neutral-100 p-10 max-w-md w-full text-center"
            >
                <div className={`w-20 h-20 rounded-full ${bg} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`h-10 w-10 ${color}`} />
                </div>
                <h1 className="text-2xl font-bold font-serif text-neutral-900 mb-3">{title}</h1>
                <p className="text-neutral-500 mb-2 leading-relaxed">{msg}</p>
                {paymentId && (
                    <p className="text-xs text-neutral-400 mt-1 mb-6 font-mono">Referencia: {paymentId}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    {type === 'failure' && (
                        <Link to="/checkout">
                            <Button variant="outline" className="rounded-full border-primary-300 text-primary-600">
                                Intentar de Nuevo
                            </Button>
                        </Link>
                    )}
                    <Link to="/products">
                        <Button className="rounded-full bg-primary-500 hover:bg-primary-600 text-white">
                            Seguir Comprando
                        </Button>
                    </Link>
                    {(type === 'success' || type === 'pending') && (
                        <Link to="/order-history">
                            <Button variant="outline" className="rounded-full border-neutral-300">
                                Mis Pedidos
                            </Button>
                        </Link>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export const PaymentSuccess = () => <PaymentResult type="success" />;
export const PaymentFailure = () => <PaymentResult type="failure" />;
export const PaymentPending = () => <PaymentResult type="pending" />;
