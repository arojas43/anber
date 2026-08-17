#!/bin/bash

echo "🚀 Configurando proyecto Anber E-commerce..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Python
echo "📦 Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado. Por favor instálalo primero."
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "${GREEN}✅ $PYTHON_VERSION${NC}"

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi
NODE_VERSION=$(node --version)
echo "${GREEN}✅ Node.js $NODE_VERSION${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instálalo primero."
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "${GREEN}✅ npm $NPM_VERSION${NC}"

echo ""
echo "🔧 Configurando Backend..."
cd backend

# Crear venv si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar venv e instalar dependencias
echo "📦 Instalando dependencias del backend..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p instance
mkdir -p static/uploads/products
mkdir -p static/uploads/carousel
mkdir -p static/uploads/about
mkdir -p static/uploads/testimonials

cd ..

echo ""
echo "🔧 Configurando Frontend..."
cd frontend

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

cd ..

echo ""
echo "${GREEN}✅ Setup completado!${NC}"
echo ""
echo "Para iniciar el proyecto:"
echo "  ${YELLOW}./start.sh${NC}  o"
echo "  ${YELLOW}cd backend && source venv/bin/activate && python3 run.py${NC}  (en una terminal)"
echo "  ${YELLOW}cd frontend && npm run dev${NC}  (en otra terminal)"
echo ""
echo "Credenciales por defecto:"
echo "  Email: admin@example.com"
echo "  Password: admin123"

