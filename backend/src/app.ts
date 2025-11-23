import "express-async-errors";
import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import storesRouter from "./controllers/stores";
import itemsRouter from "./controllers/items";
import reviewsRouter from "./controllers/reviews";
import usersRouter from "./controllers/users";
import authRouter from "./controllers/auth";
import middleware from "./utils/middleware";

dotenv.config();

const app = express();

// --- Configuración de Base de Datos Dinámica ---
// Si estamos en modo 'test', usamos la base de datos de prueba
const isTestEnv = process.env.NODE_ENV === "test";
const MONGODB_URI = isTestEnv ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(`MONGODB_URI is not defined in .env file (Environment: ${process.env.NODE_ENV})`);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // Solo logeamos si NO estamos en tests para no ensuciar la consola de Playwright
    if (!isTestEnv) {
      console.log(`connected to mongodb (${isTestEnv ? "TEST" : "DEV"} environment)`);
    }
  })
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "unknown error";
    console.error("error connecting to mongodb:", errorMessage);
  });

// --- middlewares ---
app.use(
  cors({
    origin: "http://localhost:5173", // url frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["X-CSRF-Token"],
  }),
);
app.use(express.json());
app.use(cookieParser());

// --- rutas ---
app.use("/api/stores", storesRouter);
app.use("/api/items", itemsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// --- middlewares de manejo de errores (después de las rutas) ---
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// --- configuración del servidor ---
const PORT = 3001;

// Exportamos el servidor para poder iniciarlo desde otros scripts si fuera necesario,
// o prevenir que se inicie dos veces en tests de integración unitarios.
// Para este caso simple, mantenemos el listen aquí, pero condicionado si se requiriera.
if (process.env.NODE_ENV !== "test_unit") {
  app.listen(PORT, () => {
    if (!isTestEnv) console.log(`server running on port ${PORT}`);
  });
}

export default app;
