# ⚡ Inicio Rápido - Anber E-commerce

## ✅ Estado del Proyecto

Tu proyecto está **listo para ejecutarse**. Ya tienes:
- ✅ Entorno virtual Python creado
- ✅ Dependencias del frontend instaladas (node_modules)
- ✅ Base de datos SQLite existente
- ✅ Directorios necesarios creados

## 🚀 Iniciar el Proyecto

### Opción 1: Script Automático (Más Fácil)

```bash
cd /home/alex/Documentos/Anber/ecommerce-app
./start.sh
```

Este script iniciará automáticamente:
- Backend en http://localhost:5000
- Frontend en http://localhost:5173

Presiona `Ctrl+C` para detener ambos servidores.

### Opción 2: Manual (Dos Terminales)

**Terminal 1 - Backend:**
```bash
cd /home/alex/Documentos/Anber/ecommerce-app/backend
source venv/bin/activate
python3 run.py
```

**Terminal 2 - Frontend:**
```bash
cd /home/alex/Documentos/Anber/ecommerce-app/frontend
npm run dev
```

## 🔐 Credenciales de Acceso

- **Email:** `admin@example.com`
- **Password:** `admin123`

## 📍 URLs

Una vez iniciado:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 🛠️ Si Necesitas Reinstalar Dependencias

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📝 Notas

- La base de datos está en `backend/instance/ecommerce.db`
- Las imágenes se guardan en `backend/static/uploads/`
- El backend crea automáticamente el usuario admin si no existe

## 🐛 Problemas Comunes

**Backend no inicia:**
- Verifica que el venv esté activado: `source venv/bin/activate`
- Verifica Python: `python3 --version` (debe ser 3.8+)

**Frontend no inicia:**
- Verifica Node.js: `node --version` (debe ser 16+)
- Reinstala dependencias: `rm -rf node_modules && npm install`

**Error de conexión:**
- Asegúrate de que ambos servidores estén corriendo
- Verifica que los puertos 5000 y 5173 no estén ocupados

¡Listo para empezar! 🎉

