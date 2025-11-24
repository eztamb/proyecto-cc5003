#!/bin/bash

echo "🚀 Iniciando despliegue en producción..."

# build back
echo "📦 Compilando backend..."
cd backend
npm ci --production=false
npm run build

# build frontend
echo "🎨 Compilando frontend..."
cd ../frontend
npm ci
npm run build

echo "✅ Compilación completada!"
echo ""
echo "📝 Siguiente paso: subir archivos al servidor"
echo "   Usa: scp -P 219 -r . fullstack@fullstack.dcc.uchile.cl:~/proyecto"