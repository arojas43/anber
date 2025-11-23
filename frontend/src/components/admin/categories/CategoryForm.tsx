import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface CategoryFormProps {
    category?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        image_url: category?.image_url || '',
        is_active: category?.is_active !== undefined ? category.is_active : true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{category ? 'Editar Categoría' : 'Nueva Categoría'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Nombre de la Categoría</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Descripción</label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image_url" className="text-sm font-medium">URL de Imagen</label>
                        <Input
                            id="image_url"
                            name="image_url"
                            type="url"
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">Activo</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                        <Button type="submit">Guardar Categoría</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CategoryForm;
