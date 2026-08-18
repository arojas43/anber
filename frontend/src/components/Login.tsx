import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                addToast('¡Bienvenido de nuevo!', 'success');
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    navigate(user.role === 'admin' ? '/admin/dashboard' : (from === '/login' ? '/' : from), { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } else {
                addToast('Credenciales inválidas', 'error');
            }
        } catch {
            addToast('Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            addToast('Completa tu nombre completo', 'error');
            return;
        }
        setLoading(true);
        try {
            const success = await register(email, password, firstName, lastName);
            if (success) {
                addToast('¡Cuenta creada! Iniciando sesión...', 'success');
                const loginOk = await login(email, password);
                if (loginOk) navigate('/', { replace: true });
            } else {
                addToast('No se pudo crear la cuenta. El email puede ya estar en uso.', 'error');
            }
        } catch {
            addToast('Error al crear la cuenta', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-neutral-50 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-100 shadow-lg overflow-hidden">
                {/* Tab switcher */}
                <div className="flex border-b border-neutral-100">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                            mode === 'login'
                                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                                : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                            mode === 'register'
                                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                                : 'text-neutral-500 hover:text-neutral-700'
                        }`}
                    >
                        Crear Cuenta
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary-600" aria-hidden="true" />
                        </div>
                        <h1 className="text-2xl font-bold font-serif text-neutral-900">
                            {mode === 'login' ? 'Bienvenida de nuevo' : 'Crea tu cuenta'}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            {mode === 'login'
                                ? 'Ingresa tus credenciales para acceder'
                                : 'Únete a nuestra comunidad Anber'}
                        </p>
                    </div>

                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="nombre@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
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
                                className="w-full h-11 text-base bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Iniciando...' : 'Entrar'}
                                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="reg-firstname" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Nombre
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                                        <Input
                                            id="reg-firstname"
                                            name="first_name"
                                            autoComplete="given-name"
                                            placeholder="Ana"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="reg-lastname" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                        Apellidos
                                    </label>
                                    <Input
                                        id="reg-lastname"
                                        name="last_name"
                                        autoComplete="family-name"
                                        placeholder="García"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="nombre@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-11 bg-neutral-50 border-neutral-200 focus:bg-white transition-colors"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-base bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                            </Button>

                            <p className="text-xs text-neutral-400 text-center leading-relaxed">
                                Al registrarte aceptas recibir comunicaciones de Anber.
                                Puedes darte de baja cuando quieras.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
