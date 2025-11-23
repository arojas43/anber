// src/components/OrderHistory.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Package, User, Settings, LogOut, ChevronRight, Clock, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  image_url?: string;
}

interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  items: OrderItem[];
}

const OrderHistory: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          order_number: 'ORD-7829',
          status: 'delivered',
          total: 1250.00,
          created_at: '2023-10-15',
          items: [
            { id: 1, product_name: 'Set de Encaje Floral', quantity: 1, total_price: 899.00, image_url: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=200&auto=format&fit=crop' },
            { id: 2, product_name: 'Panty de Seda', quantity: 1, total_price: 351.00, image_url: 'https://images.unsplash.com/photo-1596472537366-615d7dc36435?q=80&w=200&auto=format&fit=crop' }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-9283',
          status: 'shipped',
          total: 549.00,
          created_at: '2023-11-02',
          items: [
            { id: 3, product_name: 'Brasier Push-up', quantity: 1, total_price: 549.00, image_url: 'https://images.unsplash.com/photo-1574291874209-574e8684640e?q=80&w=200&auto=format&fit=crop' }
          ]
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return { color: 'text-green-600 bg-green-50', icon: CheckCircle, label: 'Entregado' };
      case 'shipped':
        return { color: 'text-primary-600 bg-primary-50', icon: Truck, label: 'En camino' };
      case 'pending':
        return { color: 'text-yellow-600 bg-yellow-50', icon: Clock, label: 'Pendiente' };
      default:
        return { color: 'text-neutral-600 bg-neutral-50', icon: Clock, label: status };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-neutral-500 truncate max-w-[120px]">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeTab === 'orders' ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <Package className="h-5 w-5" /> Mis Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeTab === 'profile' ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <User className="h-5 w-5" /> Mi Perfil
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeTab === 'settings' ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <Settings className="h-5 w-5" /> Configuración
                </button>
                <div className="pt-4 mt-4 border-t border-neutral-100">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" /> Cerrar Sesión
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-neutral-900 font-serif mb-6">Mis Pedidos</h1>

                {loading ? (
                  <div className="text-center py-12">Cargando pedidos...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100">
                    <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-neutral-900">No tienes pedidos aún</h3>
                    <p className="text-neutral-500 mb-6">¡Es hora de estrenar algo nuevo!</p>
                    <Button className="bg-primary-600 hover:bg-primary-700">Ir a la Tienda</Button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const status = getStatusConfig(order.status);
                    return (
                      <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 flex flex-wrap gap-4 justify-between items-center bg-neutral-50/50">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Pedido</p>
                              <p className="font-medium text-neutral-900">#{order.order_number}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Fecha</p>
                              <p className="font-medium text-neutral-900">{order.created_at}</p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total</p>
                              <p className="font-medium text-neutral-900">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            <status.icon className="h-4 w-4" />
                            {status.label}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="space-y-6">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4 items-center">
                                <div className="h-16 w-16 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
                                  <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-neutral-900">{item.product_name}</h4>
                                  <p className="text-sm text-neutral-500">Cant: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-neutral-900">${item.total_price.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-end">
                            <Button variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50">
                              Ver Detalles <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 font-serif mb-6">Mi Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-900">
                      {user?.first_name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Apellidos</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-900">
                      {user?.last_name}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Correo Electrónico</label>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-900">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button>Editar Perfil</Button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 font-serif mb-6">Configuración</h2>
                <p className="text-neutral-500">Opciones de configuración próximamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;