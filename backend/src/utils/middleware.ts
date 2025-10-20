import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
  role: "admin" | "reviewer";
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// este middleware captura las peticiones a rutas no existentes
const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// este es nuestro manejador de errores centralizado
// se identifica como un middleware de errores porque tiene 4 parámetros
const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(error.message); // imprimimos el error en la consola

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && (error as MongoServerError).code === 11000) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  // para cualquier otro error, pasamos al siguiente middleware de errores si existe
  next(error);
};

// este es nuestro middleware de autenticación
const auth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies.token as string | undefined;
  const csrfTokenFromHeader = req.headers["x-csrf-token"] as string | undefined;

  if (!token || !csrfTokenFromHeader) {
    // si falta alguno de los tokens, lanzamos un error que será capturado
    // por nuestro errorHandler
    const error = new Error("token or csrf token missing");
    error.name = "JsonWebTokenError"; // lo tratamos como un token inválido
    throw error;
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  // jwt.verify decodifica y verifica el token. si es inválido, lanza un error.
  const decodedToken = jwt.verify(token, JWT_SECRET) as {
    id: string;
    username: string;
    role: "admin" | "reviewer";
    csrf: string;
  };

  // verificamos que el csrf token del payload del jwt coincida con el del header
  if (decodedToken.csrf !== csrfTokenFromHeader) {
    const error = new Error("invalid csrf token");
    error.name = "JsonWebTokenError";
    throw error;
  }

  // si todo está bien, añadimos la información del usuario al objeto request
  req.user = {
    id: decodedToken.id,
    username: decodedToken.username,
    role: decodedToken.role,
  };

  next(); // pasamos al siguiente middleware o a la ruta
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "operation not permitted" });
  }
  next();
};

export default {
  unknownEndpoint,
  errorHandler,
  auth,
  isAdmin,
};
