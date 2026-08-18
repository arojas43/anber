import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowRight, Star } from 'lucide-react';
import Carousel from './Carousel';
import { BACKEND_URL } from '@/config';

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
    { name: 'Sofía Martínez', text: 'La calidad es increíble. Cada pieza es elegante y cómoda, superó todas mis expectativas.', rating: 5, image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Valentina Rodríguez', text: 'El envío fue rápido y el empaque es hermoso. Totalmente recomendado.', rating: 5, image: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Camila González', text: 'Mi tienda favorita para lencería. Diseños únicos y atemporales.', rating: 5, image: 'https://i.pravatar.cc/150?img=10' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
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
                    fetch(`${BACKEND_URL}/api/products?featured=true`),
                    fetch(`${BACKEND_URL}/api/settings/home_carousel`),
                    fetch(`${BACKEND_URL}/api/settings/home_about`),
                    fetch(`${BACKEND_URL}/api/settings/home_testimonials`),
                ]);

                if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
                    const data = await productsRes.value.json();
                    const prods = data.products || [];
                    setFeaturedProducts(prods.slice(0, 4));

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
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                        {[
                            { icon: Truck, title: 'Envío Gratis', desc: 'En compras superiores a $999 MXN' },
                            { icon: ShieldCheck, title: 'Pago Seguro', desc: 'Protección total en tus transacciones' },
                            { icon: RefreshCw, title: 'Devoluciones Fáciles', desc: '30 días para cambios sin preguntas' },
                        ].map((feature, idx) => (
                            <FadeIn
                                key={idx}
                                delay={idx * 0.08}
                                className={`flex items-center gap-4 py-8 ${
                                    idx === 0 ? 'md:pr-10' : idx === 1 ? 'md:px-10' : 'md:pl-10'
                                }`}
                            >
                                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900 text-sm">{feature.title}</p>
                                    <p className="text-sm text-neutral-400 mt-0.5 leading-relaxed">{feature.desc}</p>
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
                                <p className="text-xs font-semibold text-primary-400 uppercase tracking-[0.18em] mb-3">Lo Más Amado</p>
                                <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900 leading-tight">
                                    Productos <em className="not-italic text-primary-500">Destacados</em>
                                </h2>
                            </div>
                            <Link
                                to="/products"
                                className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors group"
                            >
                                Ver toda la colección
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
                                <div className="flex items-center gap-2 text-primary-500">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                                        {aboutData?.title || 'Nuestra Historia'}
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900 leading-tight">
                                    {aboutData?.subtitle || 'Elegancia que Empodera'}
                                </h2>
                                <p className="text-lg text-neutral-500 leading-relaxed max-w-[52ch]">
                                    {aboutData?.text || 'Desde 2020, nos dedicamos a ofrecer lencería de la más alta calidad, combinando elegancia, comodidad y estilo en cada pieza.'}
                                </p>
                                <Link to="/about">
                                    <Button variant="outline" className="rounded-full border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 gap-2">
                                        Conoce Nuestra Historia
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.15}>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-neutral-300/40">
                                    <img
                                        src={aboutData?.image || 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop'}
                                        alt="Sobre Anber"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
                                </div>
                                {/* Floating stat badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.88 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.45, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute -bottom-5 -left-5 hidden lg:flex items-center gap-3 bg-white rounded-2xl shadow-lg shadow-neutral-200/70 px-5 py-4 border border-neutral-100 z-10"
                                >
                                    <span className="text-2xl font-bold font-serif text-neutral-900 leading-none">4.9</span>
                                    <div>
                                        <div className="flex gap-0.5 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-primary-400 text-primary-400" />
                                            ))}
                                        </div>
                                        <p className="text-xs text-neutral-400 leading-none">Calificación promedio</p>
                                    </div>
                                </motion.div>
                                {/* Decorative shapes */}
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-3xl bg-primary-100 -z-10" />
                                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-secondary-100 -z-10" />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Testimonials — asymmetric layout */}
            <section className="py-24 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn className="mb-14">
                        <p className="text-xs font-semibold text-primary-400 uppercase tracking-[0.18em] mb-3">Testimonios</p>
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900">
                            Lo Que Dicen<br className="hidden sm:block" /> Nuestras Clientas
                        </h2>
                    </FadeIn>

                    {testimonials.length >= 2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
                            {/* Featured large card */}
                            <FadeIn className="md:col-span-3" delay={0.05}>
                                <div className="bg-neutral-900 rounded-3xl p-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(testimonials[0]?.rating || 5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary-400 text-primary-400" />
                                            ))}
                                        </div>
                                        <p className="text-xl md:text-[1.35rem] font-serif text-white leading-relaxed">
                                            "{testimonials[0]?.text}"
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-8 mt-8 border-t border-white/10">
                                        <img
                                            src={testimonials[0]?.image}
                                            alt={testimonials[0]?.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-400/30"
                                        />
                                        <div>
                                            <p className="font-semibold text-white">{testimonials[0]?.name}</p>
                                            <p className="text-xs text-white/40 mt-0.5">Clienta Verificada</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Two smaller cards stacked */}
                            <div className="md:col-span-2 flex flex-col gap-5">
                                {testimonials.slice(1, 3).map((t, i) => (
                                    <FadeIn key={i} delay={0.12 + i * 0.08} className="flex-1">
                                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-neutral-100 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="flex gap-0.5 mb-4">
                                                    {[...Array(t.rating)].map((_, j) => (
                                                        <Star key={j} className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
                                                    ))}
                                                </div>
                                                <p className="text-[15px] text-neutral-700 leading-relaxed">"{t.text}"</p>
                                            </div>
                                            <div className="flex items-center gap-3 pt-5 mt-5 border-t border-neutral-100">
                                                <img
                                                    src={t.image}
                                                    alt={t.name}
                                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-100"
                                                />
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
                    ) : (
                        <div className="max-w-2xl">
                            <FadeIn>
                                <div className="bg-neutral-900 rounded-3xl p-10">
                                    <div className="flex gap-1 mb-5">
                                        {[...Array(testimonials[0]?.rating || 5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary-400 text-primary-400" />
                                        ))}
                                    </div>
                                    <p className="text-xl font-serif text-white leading-relaxed mb-8">
                                        "{testimonials[0]?.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img src={testimonials[0]?.image} alt={testimonials[0]?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-400/30" />
                                        <p className="font-semibold text-white">{testimonials[0]?.name}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter — two-column, deep gradient */}
            <section className="py-24 bg-gradient-to-br from-primary-900 to-primary-700 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-[480px] h-[480px] rounded-full bg-primary-600/25 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute left-0 bottom-0 w-72 h-72 rounded-full bg-primary-900/40 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <FadeIn>
                            <p className="text-xs font-semibold text-primary-200 uppercase tracking-[0.18em] mb-5">Newsletter Exclusivo</p>
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight mb-5">
                                Únete a Nuestra Comunidad
                            </h2>
                            <p className="text-lg text-white/70 leading-relaxed">
                                Recibe ofertas exclusivas y un{' '}
                                <span className="text-white font-semibold">10% de descuento</span>{' '}
                                en tu primera compra.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.12}>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                                <Input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 px-5 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl backdrop-blur-sm focus:ring-white/20 focus:border-white/40"
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-white text-primary-800 hover:bg-primary-50 font-semibold rounded-xl shadow-lg transition-colors"
                                >
                                    Suscribirme
                                </Button>
                                <p className="text-xs text-white/40 text-center">Sin spam. Cancela cuando quieras.</p>
                            </form>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewHome;
