#!/bin/bash

# script to run the project 
# install deps + run backend/frontend at the same time

echo "🌯🍝🍟 Iniciando BeaucheFoods 🥗🍔🍕"

install_if_needed() {
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias en $1..."
        npm install
    else
        echo "Dependencias ya instaladas en $1."
    fi
}

# deps

cd backend
install_if_needed "backend"
cd ..

cd frontend
install_if_needed "frontend"
cd ..

# run backend (json server)
cd backend
echo "Iniciando backend (express) en http://localhost:3000..."
npm run dev &
BACKEND_PID=$!
cd ..

# wait a couple of secs for backend to start
sleep 2
echo "Backend iniciado. PID: $BACKEND_PID"

# run react + vite app
cd frontend
echo "Iniciando frontend en http://localhost:5173..."
npm run dev

# kill backend when frontend stops
kill $BACKEND_PID
echo "Backend detenido. ¡Hasta la próxima! 🍕"