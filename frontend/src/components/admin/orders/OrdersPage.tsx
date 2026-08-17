import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    currency: string;
    customer_name: string;
    customer_email: string;
    shipping_address: string;
    created_at: string;
}

const STATUS_MAP: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Pendiente', classes: 'bg-amber-100 text-amber-800' },
    confirmed: { label: 'Confirmado', classes: 'bg-primary-100 text-primary-800' },
    shipped: { label: 'Enviado', classes: 'bg-violet-100 text-violet-800' },
    delivered: { label: 'Entregado', classes: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-800' },
};

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/products/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    addToast('Error al cargar pedidos', 'error');
                }
            } catch {
                addToast('Error de conexión', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
                addToast('Estado del pedido actualizado', 'success');
            } else {
                addToast('Error al actualizar estado', 'error');
            }
        } catch {
            addToast('Error de conexión', 'error');
        }
    };

    const filtered = orders.filter(
        (o) =>
            o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (s: string) =>
        new Date(s).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-serif">Pedidos</h1>
                <p className="text-neutral-500 mt-1">Gestiona y actualiza el estado de los pedidos.</p>
            </div>

            <Card className="border-neutral-100 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-medium">Lista de Pedidos</CardTitle>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                placeholder="Buscar por número o cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-neutral-50 border-neutral-200"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-neutral-500">Cargando pedidos...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                            {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos aún.'}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-neutral-100 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-neutral-50">
                                    <TableRow>
                                        <TableHead>Pedido</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((order) => {
                                        const statusInfo = STATUS_MAP[order.status] || { label: order.status, classes: 'bg-neutral-100 text-neutral-700' };
                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-mono text-sm font-medium text-neutral-900">
                                                    {order.order_number}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium text-neutral-900 text-sm">{order.customer_name || '—'}</p>
                                                    <p className="text-xs text-neutral-400">{order.customer_email || ''}</p>
                                                </TableCell>
                                                <TableCell className="text-neutral-600 text-sm whitespace-nowrap">
                                                    {formatDate(order.created_at)}
                                                </TableCell>
                                                <TableCell className="font-semibold text-neutral-900">
                                                    ${order.total.toFixed(2)} <span className="text-xs font-normal text-neutral-400">{order.currency}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusInfo.classes}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end flex-wrap gap-1.5">
                                                        {order.status !== 'confirmed' && order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5"
                                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                                                                Confirmar
                                                            </Button>
                                                        )}
                                                        {order.status === 'confirmed' && (
                                                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5"
                                                                onClick={() => updateOrderStatus(order.id, 'shipped')}>
                                                                Enviar
                                                            </Button>
                                                        )}
                                                        {order.status === 'shipped' && (
                                                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 text-green-700 border-green-200 hover:bg-green-50"
                                                                onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                                                Entregado
                                                            </Button>
                                                        )}
                                                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5 text-red-600 border-red-200 hover:bg-red-50"
                                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                                                                Cancelar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersPage;
