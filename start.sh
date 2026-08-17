#!/bin/bash

# Script para iniciar el proyecto Anber E-commerce

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}🚀 Iniciando Anber E-commerce...${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Verificar si el venv existe
if [ ! -d "backend/venv" ]; then
    echo "${YELLOW}⚠️  El entorno virtual no existe. Ejecuta ./setup.sh primero${NC}"
    exit 1
fi

# Verificar si node_modules existe
if [ ! -d "frontend/node_modules" ]; then
    echo "${YELLOW}⚠️  Las dependencias del frontend no están instaladas. Ejecuta ./setup.sh primero${NC}"
    exit 1
fi

# Iniciar Backend
echo "${GREEN}🔧 Iniciando Backend en http://localhost:5000...${NC}"
cd backend
source venv/bin/activate
python3 run.py &
BACKEND_PID=$!
cd ..

# Esperar un poco para que el backend inicie
sleep 3

# Iniciar Frontend
echo "${GREEN}🔧 Iniciando Frontend en http://localhost:5173...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "${GREEN}✅ Servidores iniciados!${NC}"
echo ""
echo "${BLUE}📍 URLs:${NC}"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "${YELLOW}Presiona Ctrl+C para detener los servidores${NC}"
echo ""

# Esperar a que los procesos terminen
wait

