# Anber E-commerce

Sistema de e-commerce moderno para lencería con panel de administración completo y CMS integrado.

## 🚀 Características

- ✅ Frontend React con Tailwind CSS v4
- ✅ Backend Flask (Python)
- ✅ Sistema de autenticación JWT
- ✅ Panel de administración completo
- ✅ CMS para editar contenido del home
- ✅ Upload de imágenes
- ✅ Gestión de productos, categorías y órdenes
- ✅ Carrito de compras
- ✅ Sistema de testimonios

## 📋 Requisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

## 🛠️ Instalación

### Backend

```bash
cd backend
pip install -r requirements.txt
python3 run.py
```

El backend correrá en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 👤 Credenciales por Defecto

- **Email:** admin@example.com
- **Password:** admin123

## 📁 Estructura del Proyecto

```
ecommerce-app/
├── backend/              # Flask API
│   ├── app/
│   │   ├── models.py    # Modelos de BD
│   │   ├── routes/      # Endpoints
│   │   └── __init__.py
│   ├── instance/        # Base de datos SQLite
│   ├── static/uploads/  # Imágenes subidas
│   └── run.py
├── frontend/            # React App
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.tsx
│   └── package.json
├── DEPLOYMENT.md        # Guía de deployment
└── SEENODE_READY.md    # Info para Seenode
```

## 🎨 CMS - Gestión de Contenido

Accede a `/admin/settings/home` para editar:

- **Carousel:** 3 slides con imágenes, títulos y CTAs
- **Sobre Nosotros:** Título, subtítulo, texto e imagen
- **Testimonios:** Agregar/editar/eliminar testimonios

## 🚢 Deployment en Seenode

Ver `DEPLOYMENT.md` y `SEENODE_READY.md` para instrucciones detalladas.

**Importante:** Configurar volúmenes persistentes para:
- `/backend/instance` (base de datos)
- `/backend/static/uploads` (imágenes)

## 📝 Licencia

Proyecto privado - Anber

## 🤝 Contacto

Para soporte, contacta al equipo de desarrollo.