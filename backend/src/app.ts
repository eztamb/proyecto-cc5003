import "express-async-errors";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import storesRouter from "./controllers/stores";
import itemsRouter from "./controllers/items";
import reviewsRouter from "./controllers/reviews";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import middleware from "./utils/middleware";

dotenv.config();

const app = express();

// --- conexión a la base de datos ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("error: MONGODB_URI is not defined in .env file");
  process.exit(1);
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

// --- middlewares ---
app.use(cors());
app.use(express.json());

// --- rutas ---
app.use("/api/stores", storesRouter);
app.use("/api/items", itemsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// --- middlewares de manejo de errores (después de las rutas) ---
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// --- configuración del servidor ---
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
