// src/components/admin/products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface Variant {
  name: string;
  sku: string;
  price: string;
  stock_quantity: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    sku: '',
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
    category_id: '',
    image_url: '',
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (id) {
      // Fetch product data for editing
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/admin/products`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const products = await response.json();
            const product = products.find((p: any) => p.id === parseInt(id));
            if (product) {
              setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                compare_price: product.compare_price || '',
                sku: product.sku || '',
                stock_quantity: product.stock_quantity || 0,
                is_active: product.is_active !== undefined ? product.is_active : true,
                is_featured: product.is_featured !== undefined ? product.is_featured : false,
                category_id: product.category_id || '',
                image_url: product.image_url || '',
              });
            }
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', sku: '', price: '', stock_quantity: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles[index] = file;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      newPreviews[index] = null;
      setImagePreviews(newPreviews);
    }

    setImageFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity.toString()),
        variants: variants.map(v => ({
          name: v.name,
          sku: v.sku,
          price: v.price ? parseFloat(v.price) : null,
          stock_quantity: parseInt(v.stock_quantity)
        }))
      };

      const url = id
        ? `/api/admin/products/${id}`
        : '/api/admin/products';

      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const productId = id || result.product_id;

        // Upload images if any
        const hasImages = imageFiles.some(f => f !== null);
        if (hasImages && productId) {
          const formData = new FormData();
          imageFiles.forEach((file, index) => {
            if (file) {
              formData.append(`image_${index}`, file);
            }
          });

          const uploadResponse = await fetch(`/api/admin/products/${productId}/upload-images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });

          if (!uploadResponse.ok) {
            addToast('Producto guardado pero error al subir imágenes', 'error');
          }
        }

        addToast(id ? 'Producto actualizado' : 'Producto creado', 'success');
        navigate('/admin/products');
      } else {
        const error = await response.json();
        addToast(error.error || 'Error al guardar producto', 'error');
      }
    } catch (error) {
      addToast('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/products')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-serif">
            {id ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <p className="text-neutral-500">
            {id ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Producto *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Set de Encaje Floral"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">SKU *</label>
                <Input
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: EF-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe el producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio *</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Comparación</label>
                <Input
                  name="compare_price"
                  type="number"
                  step="0.01"
                  value={formData.compare_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stock *</label>
                <Input
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL de Imagen</label>
                <Input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleCheckboxChange('is_active', checked as boolean)}
                />
                <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                  Producto Activo
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleCheckboxChange('is_featured', checked as boolean)}
                />
                <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                  Producto Destacado
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imágenes del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-600">
              Sube hasta 4 imágenes. La primera será la imagen principal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">
                    {index === 0 ? 'Imagen Principal *' : `Imagen Adicional ${index}`}
                  </label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 hover:border-primary-400 transition-colors">
                    {imagePreviews[index] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[index]!}
                          alt={`Preview ${index}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleImageChange(index, null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-48 text-neutral-500 hover:text-primary-600 transition-colors">
                        <Upload className="h-12 w-12 mb-2" />
                        <span className="text-sm">Click para subir imagen</span>
                        <span className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageChange(index, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Variantes (Opcional)</CardTitle>
              <Button type="button" onClick={addVariant} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Variante
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.length === 0 ? (
              <p className="text-neutral-500 text-sm">No hay variantes. Agrega una si el producto tiene diferentes opciones.</p>
            ) : (
              variants.map((variant, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Variante {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                      placeholder="Nombre (Ej: Talla M)"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="SKU"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Precio"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock_quantity}
                      onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {loading ? 'Guardando...' : (id ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
