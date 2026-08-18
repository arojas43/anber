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
        addToast('Mensaje recibido. Te contactaremos pronto.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-primary-50 border-b border-primary-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-semibold text-primary-400 uppercase tracking-[0.2em] mb-4"
                    >
                        Anber Lencería
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-5 font-serif"
                    >
                        Contáctanos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-500 max-w-md mx-auto"
                    >
                        Estamos aquí para ayudarte. Envíanos un mensaje y te respondemos pronto.
                    </motion.p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h2 className="text-3xl font-bold text-neutral-900 mb-8 font-serif">Envíanos un Mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Nombre
                                    </label>
                                    <Input
                                        id="contact-name"
                                        name="name"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Email
                                    </label>
                                    <Input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-subject" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Asunto
                                    </label>
                                    <Input
                                        id="contact-subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="¿En qué podemos ayudarte?"
                                        className="h-12"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Escribe tu mensaje aquí..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 focus:outline-none resize-none text-sm transition-colors"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 rounded-xl text-base font-semibold shadow-sm"
                                >
                                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Enviar Mensaje
                                </Button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl font-bold text-neutral-900 font-serif">Información de Contacto</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0">
                                        <Mail className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900 text-sm mb-0.5">Email</p>
                                        <a href="mailto:hola@anber.com" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                                            hola@anber.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0">
                                        <Phone className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900 text-sm mb-0.5">Teléfono</p>
                                        <a href="tel:+525512345678" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
                                            +52 55 1234 5678
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 flex-shrink-0">
                                        <MapPin className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900 text-sm mb-0.5">Dirección</p>
                                        <p className="text-neutral-600 text-sm leading-relaxed">
                                            Av. Reforma 123, Col. Centro<br />
                                            Ciudad de México, CDMX 06000
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary-50 rounded-2xl p-7 border border-primary-100">
                                <h3 className="text-base font-semibold text-neutral-900 mb-4">Horario de Atención</h3>
                                <dl className="space-y-2 text-sm text-neutral-600">
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-neutral-700">Lunes – Viernes</dt>
                                        <dd>9:00 AM – 6:00 PM</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-neutral-700">Sábado</dt>
                                        <dd>10:00 AM – 4:00 PM</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-neutral-700">Domingo</dt>
                                        <dd>Cerrado</dd>
                                    </div>
                                </dl>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
