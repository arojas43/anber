// src/pages/About.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Target, Users } from 'lucide-react';

const About: React.FC = () => {
    const values = [
        { icon: Heart, title: 'Pasión', desc: 'Amamos lo que hacemos y se refleja en cada pieza.' },
        { icon: Sparkles, title: 'Calidad', desc: 'Solo los mejores materiales para ti.' },
        { icon: Target, title: 'Innovación', desc: 'Diseños únicos que marcan tendencia.' },
        { icon: Users, title: 'Comunidad', desc: 'Creamos una familia de mujeres empoderadas.' },
    ];

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-100 via-white to-accent-100 py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 font-serif"
                    >
                        Acerca de Anber
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-neutral-600"
                    >
                        Elegancia, calidad y empoderamiento en cada pieza
                    </motion.p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-neutral-900 mb-6 font-serif">
                                Nuestra Misión
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
                                En Anber, nuestra misión es empoderar a cada mujer a través de lencería que combina
                                elegancia atemporal con comodidad moderna. Creemos que sentirse bien comienza desde adentro.
                            </p>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Cada pieza está cuidadosamente diseñada con materiales premium, pensando en tu bienestar
                                y belleza natural. No solo creamos lencería, creamos confianza.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="h-96 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop"
                                alt="Mission"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gradient-to-br from-neutral-50 to-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-neutral-900 mb-4 font-serif">Nuestros Valores</h2>
                        <p className="text-xl text-neutral-600">Los principios que guían nuestra marca</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 text-white mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{value.title}</h3>
                                <p className="text-neutral-600">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
