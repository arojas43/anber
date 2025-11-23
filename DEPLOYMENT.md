# Guía de Deployment: Seenode

## ✅ Compatibilidad Verificada

Tu proyecto **ES COMPATIBLE** con Seenode. Incluye:
- ✅ Frontend React con Vite
- ✅ Backend Flask (Python)
- ✅ SQLite database
- ✅ Archivos estáticos (uploads)

---

## Estructura del Proyecto

```
ecommerce-app/
├── frontend/          # React app
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/         # Build output
├── backend/           # Flask app
│   ├── run.py
│   ├── requirements.txt
│   └── static/
│       └── uploads/  # User-uploaded images
└── .env              # Environment variables
```

---

## Paso 1: Preparar el Proyecto

### 1.1 Crear `.env` en la raíz

```bash
# Backend
SECRET_KEY=tu-clave-secreta-muy-segura-cambiala
JWT_SECRET_KEY=tu-jwt-secret-muy-seguro
DATABASE_URL=sqlite:///ecommerce.db

# Frontend (opcional)
VITE_API_URL=https://tu-dominio.com/api
```

### 1.2 Actualizar `backend/run.py`

Asegúrate de que use variables de entorno:

```python
import os
from app import create_app, db
from app.models import User, UserRoles

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        admin = User.query.filter_by(email='admin@example.com').first()
        if not admin:
            admin = User(
                email='admin@example.com',
                first_name='Admin',
                last_name='User',
                role=UserRoles.ADMIN
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

### 1.3 Verificar `backend/requirements.txt`

```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-CORS==4.0.0
Flask-JWT-Extended==4.6.0
Werkzeug==3.0.1
Pillow==10.1.0
```

---

## Paso 2: Configurar Seenode

### 2.1 Crear `seenode.json` en la raíz

```json
{
  "name": "ecommerce-app",
  "version": "1.0.0",
  "apps": [
    {
      "name": "frontend",
      "type": "static",
      "path": "./frontend/dist",
      "buildCommand": "cd frontend && npm install && npm run build",
      "port": 3000
    },
    {
      "name": "backend",
      "type": "python",
      "path": "./backend",
      "startCommand": "python3 run.py",
      "port": 5000,
      "env": {
        "FLASK_ENV": "production"
      }
    }
  ],
  "database": {
    "type": "sqlite",
    "path": "./backend/instance/ecommerce.db"
  }
}
```

### 2.2 Configurar CORS en Backend

En `backend/app/__init__.py`, asegúrate de que CORS permita tu dominio:

```python
cors.init_app(app, resources={
    r"/api/*": {
        "origins": ["https://tu-dominio.com", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

---

## Paso 3: Deploy en Seenode

### 3.1 Conectar Repositorio

1. Sube tu código a GitHub/GitLab
2. En Seenode, conecta tu repositorio
3. Selecciona la rama `main` o `master`

### 3.2 Configurar Variables de Entorno

En el panel de Seenode, agrega:

```
SECRET_KEY=<genera-una-clave-segura>
JWT_SECRET_KEY=<genera-otra-clave-segura>
DATABASE_URL=sqlite:///ecommerce.db
PORT=5000
```

### 3.3 Deploy

1. Click en "Deploy"
2. Seenode ejecutará:
   - `cd frontend && npm install && npm run build`
   - `cd backend && pip install -r requirements.txt`
   - `python3 run.py`

---

## Paso 4: Configuración Post-Deploy

### 4.1 Persistencia de Archivos

**IMPORTANTE:** Las imágenes subidas se guardan en `backend/static/uploads/`.

En Seenode, configura un **volumen persistente**:
- Path: `/backend/static/uploads`
- Esto asegura que las imágenes no se pierdan al re-deployar

### 4.2 Base de Datos

SQLite se guarda en `backend/instance/ecommerce.db`.

Configura otro volumen persistente:
- Path: `/backend/instance`

### 4.3 Servir Archivos Estáticos

Asegúrate de que Flask sirva los archivos estáticos. En `backend/app/__init__.py`:

```python
from flask import send_from_directory
import os

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)
```

---

## Paso 5: Verificación

### 5.1 Checklist Post-Deploy

- [ ] Frontend carga correctamente
- [ ] Login funciona (`admin@example.com` / `admin123`)
- [ ] API responde (prueba `/api/products`)
- [ ] Subida de imágenes funciona
- [ ] Imágenes se muestran correctamente
- [ ] Base de datos persiste entre deploys

### 5.2 URLs Esperadas

- **Frontend:** `https://tu-app.seenode.com`
- **Backend API:** `https://tu-app.seenode.com/api`
- **Imágenes:** `https://tu-app.seenode.com/static/uploads/products/...`

---

## Troubleshooting

### Problema: "Failed to fetch"

**Solución:** Verifica CORS en `backend/app/__init__.py`

### Problema: Imágenes no cargan

**Solución:** 
1. Verifica que el volumen persistente esté configurado
2. Revisa permisos de la carpeta `static/uploads`

### Problema: Base de datos se resetea

**Solución:** Configura volumen persistente para `/backend/instance`

---

## Migración a Producción (Opcional)

Para mejor rendimiento en producción:

### Opción 1: Cloudinary (Imágenes)

```bash
pip install cloudinary
```

Actualiza `backend/app/routes/admin.py` para usar Cloudinary en lugar de almacenamiento local.

### Opción 2: PostgreSQL (Base de Datos)

```bash
pip install psycopg2-binary
```

Cambia `DATABASE_URL` en `.env`:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## Comandos Útiles

### Local Development

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
python3 run.py
```

### Build Local

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
```

---

## Contacto y Soporte

Si tienes problemas con el deployment en Seenode:
1. Revisa los logs en el panel de Seenode
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que los volúmenes persistentes estén activos
