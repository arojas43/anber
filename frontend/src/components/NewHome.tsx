// src/components/NewHome.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowRight, Star, Quote } from 'lucide-react';
import Carousel from './Carousel';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1619784299414-f5c8e8d4e3e5?q=80&w=1920&auto=format&fit=crop',
        title: 'Elegancia Femenina',
        subtitle: 'Descubre piezas únicas que realzan tu belleza natural con nuestra nueva colección de temporada.',
        link: '/products',
        cta: 'Explorar Colección'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=1920&auto=format&fit=crop',
        title: 'Comodidad y Estilo',
        subtitle: 'Lencería diseñada para acompañarte en cada momento de tu día.',
        link: '/products',
        cta: 'Ver Novedades'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=1920&auto=format&fit=crop',
        title: 'Detalles que Enamoran',
        subtitle: 'Encajes premium y acabados delicados para una experiencia inolvidable.',
        link: '/products',
        cta: 'Comprar Ahora'
    }
];

const NewHome: React.FC = () => {
    const { addItem } = useCart();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [dynamicSlides, setDynamicSlides] = useState<any[]>(slides); // Use hardcoded as fallback
    const [aboutData, setAboutData] = useState<any>(null);
    const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured products
                const productsRes = await fetch('http://localhost:5000/api/products?featured=true');
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setFeaturedProducts(data.products?.slice(0, 4) || []);
                }

                // Fetch carousel
                const carouselRes = await fetch('http://localhost:5000/api/settings/home_carousel');
                if (carouselRes.ok) {
                    const data = await carouselRes.json();
                    if (data.value && data.value.length > 0) {
                        setDynamicSlides(data.value);
                    }
                }

                // Fetch about section
                const aboutRes = await fetch('http://localhost:5000/api/settings/home_about');
                if (aboutRes.ok) {
                    const data = await aboutRes.json();
                    setAboutData(data.value);
                }

                // Fetch testimonials
                const testimonialsRes = await fetch('http://localhost:5000/api/settings/home_testimonials');
                if (testimonialsRes.ok) {
                    const data = await testimonialsRes.json();
                    if (data.value && data.value.length > 0) {
                        setDynamicTestimonials(data.value);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const testimonials = [
        { name: 'Sofía Martínez', text: 'La calidad es increíble. Cada pieza es elegante y cómoda.', rating: 5, image: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Valentina Rodríguez', text: 'El envío fue rápido y el empaque es hermoso. Totalmente recomendado.', rating: 5, image: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Camila González', text: 'Mi tienda favorita para lencería. Diseños únicos y atemporales.', rating: 5, image: 'https://i.pravatar.cc/150?img=10' },
    ];

    const handleAddToCart = (product: typeof featuredProducts[0]) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url
        });
        addToast(`${product.name} agregado al carrito`, 'success');
    };

    const handleAddToWishlist = (productName: string) => {
        addToast(`${productName} agregado a favoritos`, 'info');
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            addToast('¡Gracias por suscribirte!', 'success');
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section - Simplified */}
            {/* Hero Carousel */}
            <Carousel slides={dynamicSlides} />

            {/* Features Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Truck, title: 'Envío Gratis', desc: 'En compras superiores a $999' },
                            { icon: ShieldCheck, title: 'Pago Seguro', desc: 'Protección total en tus transacciones' },
                            { icon: RefreshCw, title: 'Devoluciones Fáciles', desc: '30 días para cambios y devoluciones' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary-300/50">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 font-serif">
                            Productos Destacados
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Descubre nuestras piezas más populares, seleccionadas con cuidado para ti
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard
                                    {...product}
                                    onAddToCart={() => handleAddToCart(product)}
                                    onAddToWishlist={() => handleAddToWishlist(product.name)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/products">
                            <Button className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                                Ver Toda la Colección
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold">
                                <Sparkles className="h-5 w-5" />
                                {aboutData?.title || 'Nuestra Historia'}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 font-serif">
                                {aboutData?.subtitle || 'Elegancia que Empodera'}
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                {aboutData?.text || 'Desde 2020, nos dedicamos a ofrecer lencería de la más alta calidad, combinando elegancia, comodidad y estilo. Cada pieza es cuidadosamente seleccionada para que te sientas hermosa y segura en cada momento de tu día.'}
                            </p>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Desde nuestros inicios, nos hemos comprometido a crear lencería que no solo se ve bien,
                                sino que te hace sentir increíble cada día.
                            </p>
                            <Link to="/about">
                                <Button variant="outline" className="border-2 border-primary-400 text-primary-700 hover:bg-primary-50 rounded-full px-6">
                                    Conoce Más Sobre Nosotros
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src={aboutData?.image || 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop'}
                                alt="About Us"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gradient-to-br from-primary-50 to-accent-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 font-serif">
                            Lo Que Dicen Nuestras Clientas
                        </h2>
                        <p className="text-xl text-neutral-600">
                            Miles de mujeres confían en nosotros cada día
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonials).map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-lg relative"
                            >
                                <Quote className="absolute top-6 left-6 h-8 w-8 text-primary-200" />
                                <div className="flex items-center gap-1 mb-4 mt-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-primary-400 text-primary-400" />
                                    ))}
                                </div>
                                <p className="text-neutral-700 mb-6 italic leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                                        <p className="text-sm text-neutral-500">Cliente Verificada</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-24 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                            Únete a Nuestra Comunidad
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Recibe ofertas exclusivas, acceso anticipado a nuevas colecciones y un 10% de descuento en tu primera compra
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <Input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-14 px-6 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full backdrop-blur-sm focus:ring-white/50"
                                required
                            />
                            <Button
                                type="submit"
                                className="h-14 bg-white text-primary-600 hover:bg-neutral-100 px-8 rounded-full font-semibold shadow-lg"
                            >
                                Suscribirme
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default NewHome;
