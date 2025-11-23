// src/components/admin/Dashboard.tsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { token } = useAuth();

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  if (loading) return <div>Cargando dashboard...</div>;
  if (!stats) return <div>Error al cargar datos</div>;

  const statCards = [
    { title: 'Ventas Totales', value: `$${stats.total_sales.toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Pedidos Activos', value: stats.active_orders, icon: ShoppingBag, color: 'bg-primary-100 text-primary-600' },
    { title: 'Productos', value: stats.total_products, icon: Package, color: 'bg-purple-100 text-purple-600' },
    { title: 'Clientes', value: stats.total_customers, icon: Users, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 font-serif">Dashboard</h1>
        <p className="text-neutral-500">Resumen de la actividad de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_sales.map((sale: any) => (
                <div key={sale.id} className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-neutral-900">{sale.order_number}</p>
                    <p className="text-sm text-neutral-500">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">${sale.total.toFixed(2)}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600">
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
              {stats.recent_sales.length === 0 && (
                <p className="text-center text-neutral-500 py-4">No hay ventas recientes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;