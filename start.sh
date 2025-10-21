# install deps + run backend/frontend at the same time

echo "🌯🍝🍟 Iniciando BeaucheFoods 🥗🍔🍕"

install_if_needed() {
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias en $(basename "$(pwd)")..."
        npm install
    else
        echo "Dependencias ya instaladas en $(basename "$(pwd)")."
    fi
}

# deps backend
echo "Verificando dependencias del backend..."
cd backend
install_if_needed
cd ..

# deps frontend
echo "Verificando dependencias del frontend..."
cd frontend
install_if_needed
cd ..

# run backend (Express)
cd backend
echo "Iniciando backend (Express) en http://localhost:3001..." 
npm run dev &
BACKEND_PID=$!
cd ..

echo "Esperando que el backend inicie..."
sleep 3
echo "Backend iniciado. PID: $BACKEND_PID"

# run react + vite app
cd frontend
echo "Iniciando frontend en http://localhost:5173..."
npm run dev 

echo "Deteniendo backend (PID: $BACKEND_PID)..."
kill $BACKEND_PID
wait $BACKEND_PID 2>/dev/null
echo "Backend detenido. ¡Hasta la próxima! 🍕"