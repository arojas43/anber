import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowRight, Star, Quote } from 'lucide-react';
import Carousel from './Carousel';

const FALLBACK_SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=1920&q=85',
        title: 'Elegancia Femenina',
        subtitle: 'Descubre piezas únicas que realzan tu belleza natural con nuestra nueva colección de temporada.',
        link: '/products',
        cta: 'Explorar Colección',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1574291874209-574e8684640e?auto=format&fit=crop&w=1920&q=85',
        title: 'Comodidad y Estilo',
        subtitle: 'Lencería diseñada para acompañarte en cada momento de tu día.',
        link: '/products',
        cta: 'Ver Novedades',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=85',
        title: 'Detalles que Enamoran',
        subtitle: 'Encajes premium y acabados delicados para una experiencia inolvidable.',
        link: '/products',
        cta: 'Comprar Ahora',
    },
];

const defaultTestimonials = [
    { name: 'Sofía Martínez', text: 'La calidad es increíble. Cada pieza es elegante y cómoda.', rating: 5, image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Valentina Rodríguez', text: 'El envío fue rápido y el empaque es hermoso. Totalmente recomendado.', rating: 5, image: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Camila González', text: 'Mi tienda favorita para lencería. Diseños únicos y atemporales.', rating: 5, image: 'https://i.pravatar.cc/150?img=10' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const NewHome: React.FC = () => {
    const { addItem } = useCart();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [dynamicSlides, setDynamicSlides] = useState<any[]>(FALLBACK_SLIDES);
    const [aboutData, setAboutData] = useState<any>(null);
    const [dynamicTestimonials, setDynamicTestimonials] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, carouselRes, aboutRes, testimonialsRes] = await Promise.allSettled([
                    fetch('/api/products?featured=true'),
                    fetch('/api/settings/home_carousel'),
                    fetch('/api/settings/home_about'),
                    fetch('/api/settings/home_testimonials'),
                ]);

                if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
                    const data = await productsRes.value.json();
                    const prods = data.products || [];
                    setFeaturedProducts(prods.slice(0, 4));

                    // Build carousel from first 3 featured products that have images
                    const slideCandidates = prods.filter((p: any) => p.image_url).slice(0, 3);
                    if (slideCandidates.length > 0) {
                        const SLIDE_COPY = [
                            { title: 'Elegancia Femenina', subtitle: 'Descubre piezas únicas que realzan tu belleza natural con nuestra nueva colección de temporada.', cta: 'Explorar Colección' },
                            { title: 'Comodidad y Estilo', subtitle: 'Lencería diseñada para acompañarte en cada momento de tu día, con materiales premium.', cta: 'Ver Novedades' },
                            { title: 'Detalles que Enamoran', subtitle: 'Encajes premium y acabados delicados para una experiencia inolvidable.', cta: 'Comprar Ahora' },
                        ];
                        setDynamicSlides(slideCandidates.map((p: any, i: number) => ({
                            id: p.id,
                            image: (p.images?.[0] || p.image_url).replace('w=600&h=800', 'w=1920&h=1080'),
                            title: SLIDE_COPY[i]?.title || p.name,
                            subtitle: SLIDE_COPY[i]?.subtitle || p.description,
                            link: '/products',
                            cta: SLIDE_COPY[i]?.cta || 'Ver Producto',
                        })));
                    }
                }
                if (carouselRes.status === 'fulfilled' && carouselRes.value.ok) {
                    const data = await carouselRes.value.json();
                    if (data.value?.length > 0) setDynamicSlides(data.value);
                }
                if (aboutRes.status === 'fulfilled' && aboutRes.value.ok) {
                    const data = await aboutRes.value.json();
                    setAboutData(data.value);
                }
                if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.ok) {
                    const data = await testimonialsRes.value.json();
                    if (data.value?.length > 0) setDynamicTestimonials(data.value);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = (product: any) => {
        addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url });
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

    const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : defaultTestimonials;

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <Carousel slides={dynamicSlides} />

            {/* Features Strip */}
            <section className="bg-white border-b border-neutral-100">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Truck, title: 'Envío Gratis', desc: 'En compras superiores a $999 MXN' },
                            { icon: ShieldCheck, title: 'Pago Seguro', desc: 'Protección total en tus transacciones' },
                            { icon: RefreshCw, title: 'Devoluciones Fáciles', desc: '30 días para cambios sin preguntas' },
                        ].map((feature, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                                        <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-24 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <FadeIn className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6">
                            <div>
                                <p className="text-sm font-semibold text-primary-500 uppercase tracking-widest mb-3">Lo Más Amado</p>
                                <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900 leading-tight">
                                    Productos <span className="italic text-primary-500">Destacados</span>
                                </h2>
                            </div>
                            <Link to="/products" className="flex-shrink-0">
                                <Button variant="outline" className="rounded-full border-neutral-300 text-neutral-700 hover:border-primary-400 hover:text-primary-600 gap-2">
                                    Ver todo
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </FadeIn>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
                            {featuredProducts.map((product, idx) => (
                                <FadeIn key={product.id} delay={idx * 0.08}>
                                    <ProductCard
                                        {...product}
                                        onAddToCart={() => handleAddToCart(product)}
                                        onAddToWishlist={() => handleAddToWishlist(product.name)}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Brand Story */}
            <section className="py-28 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn>
                            <div className="space-y-7">
                                <div className="flex items-center gap-2 text-primary-600">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-sm font-semibold uppercase tracking-widest">
                                        {aboutData?.title || 'Nuestra Historia'}
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900 leading-tight">
                                    {aboutData?.subtitle || 'Elegancia que Empodera'}
                                </h2>
                                <p className="text-lg text-neutral-600 leading-relaxed">
                                    {aboutData?.text || 'Desde 2020, nos dedicamos a ofrecer lencería de la más alta calidad, combinando elegancia, comodidad y estilo.'}
                                </p>
                                <Link to="/about">
                                    <Button variant="outline" className="rounded-full border-2 border-primary-300 text-primary-700 hover:bg-primary-50 gap-2 mt-2">
                                        Conoce Nuestra Historia
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.15}>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={aboutData?.image || 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop'}
                                        alt="Sobre Anber"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-3xl" />
                                </div>
                                {/* Floating accent */}
                                <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl bg-primary-100 -z-10" />
                                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-accent-100 -z-10" />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn className="text-center mb-16">
                        <p className="text-sm font-semibold text-primary-500 uppercase tracking-widest mb-3">Testimonios</p>
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900">
                            Lo Que Dicen Nuestras Clientas
                        </h2>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow h-full flex flex-col">
                                    <Quote className="h-7 w-7 text-primary-200 mb-5" />
                                    <p className="text-neutral-700 leading-relaxed flex-1 mb-6 text-[15px]">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-1 mb-5">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary-400 text-primary-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
                                        <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100" />
                                        <div>
                                            <p className="font-semibold text-neutral-900 text-sm">{t.name}</p>
                                            <p className="text-xs text-neutral-400">Clienta Verificada</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                />
                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <FadeIn>
                        <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4">Newsletter</p>
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-5">
                            Únete a Nuestra Comunidad
                        </h2>
                        <p className="text-lg text-white/80 mb-10 leading-relaxed">
                            Recibe ofertas exclusivas y un <strong className="text-white">10% de descuento</strong> en tu primera compra.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 h-12 px-5 bg-white/15 border-white/30 text-white placeholder:text-white/50 rounded-full backdrop-blur-sm focus:ring-white/40 focus:border-white/60"
                            />
                            <Button
                                type="submit"
                                className="h-12 bg-white text-primary-600 hover:bg-neutral-100 font-semibold px-8 rounded-full whitespace-nowrap shadow-xl"
                            >
                                Suscribirme
                            </Button>
                        </form>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
};

export default NewHome;
