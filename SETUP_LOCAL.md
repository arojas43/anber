# 🚀 Guía de Setup Local - Anber E-commerce

Esta guía te ayudará a levantar el proyecto en tu máquina local.

## 📋 Requisitos Previos

- **Python 3.8+** (verificar con `python3 --version`)
- **Node.js 16+** (verificar con `node --version`)
- **npm** (viene con Node.js, verificar con `npm --version`)

## 🛠️ Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# 1. Dar permisos de ejecución (si no los tiene)
chmod +x setup.sh start.sh

# 2. Ejecutar setup (instala dependencias)
./setup.sh

# 3. Iniciar el proyecto
./start.sh
```

### Opción 2: Manual

#### Backend

```bash
cd backend

# Crear entorno virtual (si no existe)
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En Linux/Mac
# o
venv\Scripts\activate  # En Windows

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Crear directorios necesarios
mkdir -p instance
mkdir -p static/uploads/products
mkdir -p static/uploads/carousel
mkdir -p static/uploads/about
mkdir -p static/uploads/testimonials

# Iniciar servidor
python3 run.py
```

El backend estará disponible en: **http://localhost:5000**

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 🔐 Credenciales por Defecto

- **Email:** `admin@example.com`
- **Password:** `admin123`

## 📁 Estructura de Directorios

```
ecommerce-app/
├── backend/
│   ├── app/              # Código de la aplicación
│   ├── instance/         # Base de datos SQLite (se crea automáticamente)
│   ├── static/uploads/   # Imágenes subidas
│   ├── venv/             # Entorno virtual Python
│   └── run.py            # Punto de entrada
├── frontend/
│   ├── src/              # Código fuente React
│   ├── node_modules/     # Dependencias (se crea con npm install)
│   └── package.json
├── setup.sh              # Script de instalación
└── start.sh              # Script de inicio
```

## 🔧 Variables de Entorno (Opcional)

El proyecto funciona sin archivo `.env` ya que tiene valores por defecto. Si quieres personalizarlos, crea un archivo `.env` en la raíz:

```bash
# Backend
SECRET_KEY=tu-clave-secreta-muy-segura
JWT_SECRET_KEY=tu-jwt-secret-muy-seguro
DATABASE_URL=sqlite:///ecommerce.db
FLASK_ENV=development
PORT=5000
```

## 🐛 Solución de Problemas

### Backend no inicia

1. Verifica que Python 3.8+ esté instalado
2. Asegúrate de que el entorno virtual esté activado
3. Verifica que todas las dependencias estén instaladas: `pip install -r requirements.txt`

### Frontend no inicia

1. Verifica que Node.js 16+ esté instalado
2. Elimina `node_modules` y `package-lock.json` y vuelve a instalar:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error de CORS

El backend está configurado para aceptar peticiones desde `http://localhost:5173` y `http://localhost:3000`. Si usas otro puerto, modifica `backend/app/__init__.py`.

### Base de datos no se crea

La base de datos se crea automáticamente al ejecutar `run.py` por primera vez. Si hay problemas, elimina `backend/instance/ecommerce.db` y vuelve a ejecutar.

## 📝 Notas Importantes

- La base de datos SQLite se guarda en `backend/instance/ecommerce.db`
- Las imágenes subidas se guardan en `backend/static/uploads/`
- El backend crea automáticamente un usuario admin si no existe
- El proyecto usa SQLite para desarrollo local (no requiere configuración adicional)

## 🎯 Próximos Pasos

1. Accede a http://localhost:5173
2. Inicia sesión con las credenciales por defecto
3. Explora el panel de administración en `/admin`
4. Edita el contenido del home en `/admin/settings/home`

¡Listo! 🎉

