import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Lock } from 'lucide-react';

const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-serif">Configuración</h1>
                <p className="text-neutral-500">Gestiona la configuración de tu cuenta y del sitio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/settings/home">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                Contenido del Home
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-neutral-600">
                                Edita el carousel y la sección "Sobre Nosotros"
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="opacity-60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Cambiar Contraseña
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-neutral-600">
                            Actualiza tu contraseña de acceso
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
