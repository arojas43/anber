// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                addToast('¡Bienvenido de nuevo!', 'success');
                // Check user role from localStorage since state update might be async
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.role === 'admin') {
                        navigate('/admin/dashboard', { replace: true });
                    } else {
                        navigate(from === '/login' ? '/' : from, { replace: true });
                    }
                } else {
                    navigate('/', { replace: true });
                }
            } else {
                addToast('Credenciales inválidas', 'error');
            }
        } catch (error) {
            addToast('Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        addToast(`Inicio de sesión con ${provider} próximamente`, 'info');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-neutral-50 py-12">
            <Card className="w-full max-w-md border-neutral-100 shadow-xl">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-primary-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-serif">Iniciar Sesión</CardTitle>
                    <p className="text-sm text-neutral-500">
                        Ingresa tus credenciales para acceder a tu cuenta
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button variant="outline" onClick={() => handleSocialLogin('Google')} className="w-full">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('Facebook')} className="w-full">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 121.3 87.1 222.4 203 240.6V327.7h-59.6v-71.7h59.6v-52.5c0-59.1 35.1-92.1 89.4-92.1 26.2 0 53.7 2.6 53.7 2.6v59h-30.3c-29.3 0-38.5 18.2-38.5 36.8v46.1h66.5l-10.6 71.7h-55.9V496.6C416.9 478.4 504 377.3 504 256z"></path></svg>
                            Facebook
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-neutral-500">O continúa con email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                                <Input
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando...' : 'Entrar'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-neutral-500">¿No tienes una cuenta? </span>
                        <button className="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                            Regístrate
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
