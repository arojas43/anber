import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import CategoryForm from './CategoryForm';

interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
}

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    const { token } = useAuth();
    const { addToast } = useToast();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                addToast('Error al cargar categorías', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleCreate = () => {
        setEditingCategory(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                addToast('Categoría eliminada correctamente', 'success');
                fetchCategories();
            } else {
                const data = await response.json();
                addToast(data.error || 'Error al eliminar categoría', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            const url = editingCategory
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                addToast(editingCategory ? 'Categoría actualizada' : 'Categoría creada', 'success');
                setIsFormOpen(false);
                fetchCategories();
            } else {
                const errorData = await response.json();
                addToast(errorData.error || 'Error al guardar categoría', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isFormOpen) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-serif text-neutral-900">
                        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h1>
                </div>
                <CategoryForm
                    category={editingCategory}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-serif text-neutral-900">Categorías</h1>
                <Button onClick={handleCreate} className="bg-primary-600 hover:bg-primary-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Categoría
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-neutral-200">
                <Search className="h-5 w-5 text-neutral-400" />
                <Input
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">Cargando...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-neutral-900">Nombre</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-900">Descripción</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-900">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-neutral-900 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900">{category.name}</td>
                                        <td className="px-6 py-4 text-neutral-600 max-w-xs truncate">{category.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {category.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(category)}
                                                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                                            No se encontraron categorías
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
