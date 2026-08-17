import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BACKEND_URL } from '@/config';

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-primary-100 text-primary-700',
    shipped: 'bg-violet-100 text-violet-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const Dashboard: React.FC = () => {
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const { token } = useAuth();

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 rounded-2xl bg-neutral-100 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center py-24 text-neutral-500">
                Error al cargar el dashboard.
            </div>
        );
    }

    const statCards = [
        {
            title: 'Ventas Totales',
            value: `$${stats.total_sales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            sub: 'MXN acumulado',
            icon: DollarSign,
            gradient: 'from-green-400 to-emerald-500',
            bg: 'bg-green-50',
            text: 'text-green-700',
        },
        {
            title: 'Pedidos Activos',
            value: stats.active_orders,
            sub: 'Pendientes de procesar',
            icon: ShoppingBag,
            gradient: 'from-primary-400 to-primary-600',
            bg: 'bg-primary-50',
            text: 'text-primary-700',
        },
        {
            title: 'Productos',
            value: stats.total_products,
            sub: 'En catálogo',
            icon: Package,
            gradient: 'from-violet-400 to-violet-600',
            bg: 'bg-violet-50',
            text: 'text-violet-700',
        },
        {
            title: 'Clientas',
            value: stats.total_customers,
            sub: 'Registradas',
            icon: Users,
            gradient: 'from-orange-400 to-rose-500',
            bg: 'bg-orange-50',
            text: 'text-orange-700',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 font-serif">Dashboard</h1>
                <p className="text-sm text-neutral-500 mt-1">Resumen de actividad de tu tienda.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                        className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="text-2xl font-bold text-neutral-900 mb-0.5">{stat.value}</div>
                        <div className="text-xs font-medium text-neutral-400">{stat.sub}</div>
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                            <span className="text-xs font-semibold text-neutral-600">{stat.title}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl border border-neutral-100 shadow-sm"
            >
                <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-900">Ventas Recientes</h2>
                    <span className="text-xs text-neutral-400">Últimos 5 pedidos</span>
                </div>
                <div className="divide-y divide-neutral-50">
                    {stats.recent_sales.length === 0 ? (
                        <div className="py-12 text-center text-sm text-neutral-400">
                            No hay ventas registradas todavía.
                        </div>
                    ) : (
                        stats.recent_sales.map((sale: any, idx: number) => (
                            <motion.div
                                key={sale.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.06 }}
                                className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                        <ShoppingBag className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900 font-mono">{sale.order_number}</p>
                                        <p className="text-xs text-neutral-400">{sale.customer}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[sale.status] || 'bg-neutral-100 text-neutral-600'}`}>
                                        {statusLabels[sale.status] || sale.status}
                                    </span>
                                    <span className="text-sm font-bold text-neutral-900 min-w-[70px] text-right">
                                        ${sale.total.toFixed(2)}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
