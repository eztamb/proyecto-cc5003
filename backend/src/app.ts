import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "express-async-errors";

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
const MONGODB_URI = isTestEnv
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // Solo logeamos si NO estamos en tests para no ensuciar la consola de Playwright
    // if (!isTestEnv) {
    //   console.log(`connected to mongodb (${isTestEnv ? "TEST" : "DEV"} environment)`);
    // }
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => { // error is unknown type because. Its safer as it can be anything. Asuming a type may lead to runtime errors.
    const errorMessage = error instanceof Error ? error.message : "unknown error";
    console.error("error connecting to mongodb:", errorMessage);
  });

// --- middlewares ---
console.log("Connected to MongoDB");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
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

export default app;
