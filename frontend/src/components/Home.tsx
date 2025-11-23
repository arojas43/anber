// src/components/Home.tsx
import React, { useState } from 'react';
import Hero from './ui/Hero';
import Sparkles from './ui/Sparkles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw, Plus, Minus, ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const categories = [
        { name: 'Lencería', image: 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop', link: '/products?category=lenceria' },
        { name: 'Brasieres', image: 'https://images.unsplash.com/photo-1619784299414-f5c8e8d4e3e5?q=80&w=800&auto=format&fit=crop', link: '/products?category=brasieres' },
        { name: 'Panties', image: 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=800&auto=format&fit=crop', link: '/products?category=panties' },
        { name: 'Pijamas', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=800&auto=format&fit=crop', link: '/products?category=pijamas' },
    ];

    const featuredProducts = [
        {
            id: 1,
            name: 'Set de Encaje Floral Rosa',
            price: 899.00,
            image: 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=600&auto=format&fit=crop',
            badge: 'Nuevo'
        },
        {
            id: 2,
            name: 'Bralette de Seda Premium',
            price: 549.00,
            image: 'https://images.unsplash.com/photo-1619784299414-f5c8e8d4e3e5?q=80&w=600&auto=format&fit=crop',
            badge: 'Bestseller'
        },
        {
            id: 3,
            name: 'Pijama de Satín Elegante',
            price: 1200.00,
            image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=600&auto=format&fit=crop',
            badge: 'Premium'
        },
        {
            id: 4,
            name: 'Body de Encaje Delicado',
            price: 950.00,
            image: 'https://images.unsplash.com/photo-1583208205675-c9d5382e1d68?q=80&w=600&auto=format&fit=crop',
            badge: 'Nuevo'
        },
    ];

    const testimonials = [
        { name: 'Sofía M.', text: 'La calidad es increíble, me siento hermosa y cómoda.', rating: 5 },
        { name: 'Valentina R.', text: 'El envío fue súper rápido y el empaque es precioso.', rating: 5 },
        { name: 'Camila G.', text: 'Definitivamente mi tienda favorita para lencería.', rating: 4 },
    ];

    const faqs = [
        { question: "¿Cómo sé cuál es mi talla?", answer: "Contamos con una guía de tallas detallada en cada producto. Si tienes dudas, nuestro equipo de soporte puede asesorarte." },
        { question: "¿Hacen envíos internacionales?", answer: "Por el momento solo realizamos envíos a todo México. Estamos trabajando para expandirnos pronto." },
        { question: "¿Cuál es la política de devoluciones?", answer: "Aceptamos cambios y devoluciones dentro de los 30 días posteriores a tu compra, siempre que las prendas conserven sus etiquetas y no hayan sido usadas." }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Hero />

            {/* Features Banner */}
            <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 py-8 border-y border-primary-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-300">
                                <Truck className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-neutral-700 text-lg">Envío Gratis</h3>
                            <p className="text-sm text-neutral-600">En pedidos superiores a $999</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-300">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-neutral-700 text-lg">Pago Seguro</h3>
                            <p className="text-sm text-neutral-600">Transacciones 100% encriptadas</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-300">
                                <RefreshCw className="h-7 w-7" />
                            </div>
                            <h3 className="font-bold text-neutral-700 text-lg">Devoluciones Fáciles</h3>
                            <p className="text-sm text-neutral-600">30 días de garantía</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Featured Products Carousel */}
            <section className="py-24 bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-50 relative overflow-hidden">
                <Sparkles className="opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/20 via-transparent to-secondary-200/20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-neutral-700 font-serif mb-4"
                        >
                            Productos Destacados
                        </motion.h2>
                        <p className="text-neutral-700 max-w-2xl mx-auto text-lg">
                            Descubre nuestras piezas más populares, seleccionadas especialmente para ti
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="overflow-hidden rounded-3xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="grid md:grid-cols-2 gap-8 bg-gradient-to-br from-primary-50 to-secondary-50 p-8 md:p-12 rounded-3xl"
                            >
                                <div className="relative h-96 md:h-full rounded-2xl overflow-hidden group">
                                    <img
                                        src={featuredProducts[currentSlide].image}
                                        alt={featuredProducts[currentSlide].name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                            {featuredProducts[currentSlide].badge}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center space-y-6">
                                    <h3 className="text-4xl font-bold text-neutral-700 font-serif">
                                        {featuredProducts[currentSlide].name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-neutral-600 ml-2">(4.9)</span>
                                    </div>
                                    <p className="text-neutral-600 text-lg leading-relaxed">
                                        Diseñado con los materiales más finos y atención al detalle. Perfecto para sentirte hermosa y cómoda.
                                    </p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-bold text-primary-600">
                                            ${featuredProducts[currentSlide].price.toFixed(2)}
                                        </span>
                                        <span className="text-neutral-500 line-through text-xl">
                                            ${(featuredProducts[currentSlide].price * 1.3).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <Link to={`/products/${featuredProducts[currentSlide].id}`} className="flex-1">
                                            <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-full py-6 text-lg shadow-lg shadow-primary-300 transition-all hover:scale-105">
                                                <ShoppingBag className="mr-2 h-5 w-5" /> Agregar al Carrito
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="border-2 border-primary-300 text-primary-700 hover:bg-primary-50 rounded-full px-6">
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Carousel Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-all shadow-lg hover:scale-110"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm border border-primary-200 flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-all shadow-lg hover:scale-110"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {featuredProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-primary-600' : 'w-2 bg-primary-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-neutral-700 font-serif mb-4"
                        >
                            Explora por Categoría
                        </motion.h2>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            Encuentra la pieza perfecta que resalte tu belleza natural
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((category, idx) => (
                            <Link key={idx} to={category.link} className="group block relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-600/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-2xl font-bold text-white mb-2 font-serif">{category.name}</h3>
                                        <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            Ver Colección <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section >

            {/* Testimonials */}
            < section className="py-24 bg-white relative overflow-hidden" >
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center text-neutral-700 font-serif mb-16"
                    >
                        Lo que dicen nuestras clientas
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 relative hover:shadow-xl transition-all"
                            >
                                <div className="absolute -top-4 left-8 text-6xl text-primary-200 font-serif">"</div>
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-neutral-600 mb-6 italic relative z-10">{testimonial.text}</p>
                                <p className="font-bold text-neutral-700">{testimonial.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Newsletter */}
            < section className="py-24 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white relative overflow-hidden" >
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold font-serif mb-4"
                    >
                        Únete a nuestra comunidad
                    </motion.h2>
                    <p className="text-white/90 mb-8 text-lg">
                        Recibe novedades exclusivas, acceso anticipado a colecciones y un 10% de descuento en tu primera compra
                    </p>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <Input
                            type="email"
                            placeholder="Tu correo electrónico"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 rounded-full px-6 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
                        />
                        <Button className="bg-white text-primary-600 hover:bg-primary-50 h-12 rounded-full px-8 shadow-lg font-bold">
                            Suscribirse
                        </Button>
                    </motion.form>
                </div>
            </section >

            {/* FAQ Section */}
            < section className="py-24 bg-white" >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center text-neutral-700 font-serif mb-12"
                    >
                        Preguntas Frecuentes
                    </motion.h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-primary-50/50 transition-colors"
                                >
                                    <span className="text-lg font-medium text-neutral-700">{faq.question}</span>
                                    {openFaq === idx ? (
                                        <Minus className="h-5 w-5 text-primary-600" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-primary-400" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 text-neutral-600 border-t border-primary-100 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
};

export default Home;
