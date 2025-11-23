// src/components/admin/products/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  image_url?: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        addToast('Error al cargar productos', 'error');
      }
    } catch (error) {
      addToast('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleDelete = async (productId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        addToast('Producto eliminado', 'success');
        fetchProducts(); // Refresh list
      } else {
        addToast('Error al eliminar producto', 'error');
      }
    } catch (error) {
      addToast('Error de conexión', 'error');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-serif">Productos</h1>
          <p className="text-neutral-500">Gestiona tu inventario y catálogo.</p>
        </div>
        <Button
          onClick={() => navigate('/admin/products/new')}
          className="bg-primary-600 hover:bg-primary-700 gap-2"
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <Card className="border-neutral-100 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Lista de Productos</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-neutral-50 border-neutral-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-neutral-500">Cargando productos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos. Crea uno nuevo.'}
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-neutral-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 overflow-hidden">
                          {product.image_url && (
                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-neutral-900">{product.name}</TableCell>
                      <TableCell className="text-neutral-500">{product.sku}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock_quantity < 20 ? "text-orange-600 font-medium" : "text-neutral-600"}>
                          {product.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                          }`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-500 hover:text-primary-600"
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-500 hover:text-red-600"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;