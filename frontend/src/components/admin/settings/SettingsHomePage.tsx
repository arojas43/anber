// src/components/admin/settings/SettingsHomePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';

interface CarouselSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    link: string;
    cta: string;
}

interface AboutSection {
    title: string;
    subtitle: string;
    text: string;
    image: string;
}

interface Testimonial {
    id: number;
    name: string;
    text: string;
    rating: number;
    image: string;
}

const SettingsHomePage: React.FC = () => {
    const { token } = useAuth();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
    const [about, setAbout] = useState<AboutSection>({
        title: '',
        subtitle: '',
        text: '',
        image: ''
    });
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        fetchSettings();
    }, [token]);

    const fetchSettings = async () => {
        try {
            // Fetch carousel
            const carouselRes = await fetch('/api/admin/settings/home_carousel', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (carouselRes.ok) {
                const data = await carouselRes.json();
                setCarousel(data.value || []);
            }

            // Fetch about
            const aboutRes = await fetch('/api/admin/settings/home_about', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (aboutRes.ok) {
                const data = await aboutRes.json();
                setAbout(data.value || { title: '', subtitle: '', text: '', image: '' });
            }

            // Fetch testimonials
            const testimonialsRes = await fetch('/api/admin/settings/home_testimonials', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (testimonialsRes.ok) {
                const data = await testimonialsRes.json();
                setTestimonials(data.value || []);
            }
        } catch (error) {
            addToast('Error al cargar configuración', 'error');
        }
    };

    const uploadCarouselImage = async (file: File, slideIndex: number) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/admin/settings/carousel/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                updateCarouselSlide(slideIndex, 'image', data.url);
                addToast('Imagen subida exitosamente', 'success');
            } else {
                addToast('Error al subir imagen', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        }
    };

    const uploadAboutImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/admin/settings/about/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                updateAbout('image', data.url);
                addToast('Imagen subida exitosamente', 'success');
            } else {
                addToast('Error al subir imagen', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        }
    };

    const uploadTestimonialImage = async (file: File, index: number) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/admin/settings/testimonials/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                updateTestimonial(index, 'image', data.url);
                addToast('Avatar subido exitosamente', 'success');
            } else {
                addToast('Error al subir avatar', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        }
    };

    const updateCarouselSlide = (index: number, field: keyof CarouselSlide, value: string) => {
        const newCarousel = [...carousel];
        newCarousel[index] = { ...newCarousel[index], [field]: value };
        setCarousel(newCarousel);
    };

    const updateAbout = (field: keyof AboutSection, value: string) => {
        setAbout({ ...about, [field]: value });
    };

    const addTestimonial = () => {
        const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
        setTestimonials([...testimonials, {
            id: newId,
            name: '',
            text: '',
            rating: 5,
            image: 'https://i.pravatar.cc/150?img=' + newId
        }]);
    };

    const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setTestimonials(newTestimonials);
    };

    const deleteTestimonial = (index: number) => {
        setTestimonials(testimonials.filter((_, i) => i !== index));
    };

    const saveCarousel = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/settings/home_carousel', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: carousel })
            });

            if (response.ok) {
                addToast('Carousel actualizado', 'success');
            } else {
                addToast('Error al guardar carousel', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveAbout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/settings/home_about', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: about })
            });

            if (response.ok) {
                addToast('Sección "Sobre Nosotros" actualizada', 'success');
            } else {
                addToast('Error al guardar', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveTestimonials = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/settings/home_testimonials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: testimonials })
            });

            if (response.ok) {
                addToast('Testimonios actualizados', 'success');
            } else {
                addToast('Error al guardar testimonios', 'error');
            }
        } catch (error) {
            addToast('Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-serif">Configuración del Home</h1>
                <p className="text-neutral-500">Edita el contenido de la página principal</p>
            </div>

            {/* Carousel Editor */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Carousel Principal</CardTitle>
                        <Button onClick={saveCarousel} disabled={loading} className="gap-2">
                            <Save className="h-4 w-4" />
                            Guardar Carousel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {carousel.map((slide, index) => (
                        <div key={slide.id} className="border border-neutral-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-semibold text-lg">Slide {index + 1}</h3>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imagen del Slide</label>
                                <div className="flex gap-4">
                                    <Input
                                        value={slide.image}
                                        onChange={(e) => updateCarouselSlide(index, 'image', e.target.value)}
                                        placeholder="URL de la imagen o sube una"
                                        className="flex-1"
                                    />
                                    <label className="cursor-pointer">
                                        <Button type="button" variant="outline" className="gap-2">
                                            <Upload className="h-4 w-4" />
                                            Subir
                                        </Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) uploadCarouselImage(file, index);
                                            }}
                                        />
                                    </label>
                                </div>
                                {slide.image && (
                                    <img
                                        src={slide.image}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg mt-2"
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título</label>
                                    <Input
                                        value={slide.title}
                                        onChange={(e) => updateCarouselSlide(index, 'title', e.target.value)}
                                        placeholder="Ej: Elegancia Femenina"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto del Botón</label>
                                    <Input
                                        value={slide.cta}
                                        onChange={(e) => updateCarouselSlide(index, 'cta', e.target.value)}
                                        placeholder="Ej: Explorar Colección"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subtítulo</label>
                                <Textarea
                                    value={slide.subtitle}
                                    onChange={(e) => updateCarouselSlide(index, 'subtitle', e.target.value)}
                                    rows={2}
                                    placeholder="Descripción del slide..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link de Destino</label>
                                <Input
                                    value={slide.link}
                                    onChange={(e) => updateCarouselSlide(index, 'link', e.target.value)}
                                    placeholder="/products"
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* About Section Editor */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Sección "Sobre Nosotros"</CardTitle>
                        <Button onClick={saveAbout} disabled={loading} className="gap-2">
                            <Save className="h-4 w-4" />
                            Guardar Sección
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Título</label>
                        <Input
                            value={about.title}
                            onChange={(e) => updateAbout('title', e.target.value)}
                            placeholder="Ej: Nuestra Historia"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subtítulo</label>
                        <Input
                            value={about.subtitle}
                            onChange={(e) => updateAbout('subtitle', e.target.value)}
                            placeholder="Ej: Elegancia que Empodera"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Texto</label>
                        <Textarea
                            value={about.text}
                            onChange={(e) => updateAbout('text', e.target.value)}
                            rows={4}
                            placeholder="Describe tu historia..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagen</label>
                        <div className="flex gap-4">
                            <Input
                                value={about.image}
                                onChange={(e) => updateAbout('image', e.target.value)}
                                placeholder="URL de la imagen o sube una"
                                className="flex-1"
                            />
                            <label className="cursor-pointer">
                                <Button type="button" variant="outline" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    Subir
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadAboutImage(file);
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {about.image && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <img
                                src={about.image}
                                alt="About"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Testimonials Editor */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Testimonios</CardTitle>
                        <div className="flex gap-2">
                            <Button onClick={addTestimonial} variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Agregar Testimonio
                            </Button>
                            <Button onClick={saveTestimonials} disabled={loading} className="gap-2">
                                <Save className="h-4 w-4" />
                                Guardar Testimonios
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="border border-neutral-200 rounded-lg p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Testimonio {index + 1}</h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTestimonial(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre</label>
                                    <Input
                                        value={testimonial.name}
                                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                        placeholder="Ej: Sofía Martínez"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Avatar</label>
                                    <div className="flex gap-4">
                                        <Input
                                            value={testimonial.image}
                                            onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
                                            placeholder="URL del avatar o sube uno"
                                            className="flex-1"
                                        />
                                        <label className="cursor-pointer">
                                            <Button type="button" variant="outline" size="sm" className="gap-2">
                                                <Upload className="h-4 w-4" />
                                                Subir
                                            </Button>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) uploadTestimonialImage(file, index);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Testimonio</label>
                                <Textarea
                                    value={testimonial.text}
                                    onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                                    rows={2}
                                    placeholder="Escribe el testimonio..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Calificación (1-5)</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={testimonial.rating}
                                    onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    ))}

                    {testimonials.length === 0 && (
                        <p className="text-center text-neutral-500 py-8">
                            No hay testimonios. Agrega uno para comenzar.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsHomePage;
