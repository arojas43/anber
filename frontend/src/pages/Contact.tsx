// src/pages/Contact.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const Contact: React.FC = () => {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-100 via-white to-accent-100 py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 font-serif"
                    >
                        Contáctanos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-neutral-600"
                    >
                        Estamos aquí para ayudarte. Envíanos un mensaje
                    </motion.p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8 font-serif">Envíanos un Mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Nombre</label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Asunto</label>
                                    <Input
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="¿En qué podemos ayudarte?"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Mensaje</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Escribe tu mensaje aquí..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white h-14 rounded-full text-lg shadow-lg"
                                >
                                    <Send className="mr-2 h-5 w-5" />
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-8 font-serif">Información de Contacto</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white flex-shrink-0">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                                            <p className="text-neutral-600">contacto@anber.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white flex-shrink-0">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 mb-1">Teléfono</h3>
                                            <p className="text-neutral-600">+52 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white flex-shrink-0">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900 mb-1">Dirección</h3>
                                            <p className="text-neutral-600">
                                                Av. Reforma 123, Col. Centro<br />
                                                Ciudad de México, CDMX 06000
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl">
                                <h3 className="text-xl font-semibold text-neutral-900 mb-4">Horario de Atención</h3>
                                <div className="space-y-2 text-neutral-700">
                                    <p><strong>Lunes - Viernes:</strong> 9:00 AM - 7:00 PM</p>
                                    <p><strong>Sábado:</strong> 10:00 AM - 6:00 PM</p>
                                    <p><strong>Domingo:</strong> Cerrado</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
