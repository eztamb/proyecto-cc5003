import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// carga las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// --- conexión a la base de datos ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("error: MONGODB_URI is not defined in .env file");
  process.exit(1); // detiene la aplicación si la uri no está definida
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "unknown error";
    console.error("error connecting to mongodb:", errorMessage);
  });

// --- configuración del servidor (lo que ya tenías) ---
const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
