import { Request, Response, NextFunction } from "express";

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
  }

  // para cualquier otro error, pasamos al siguiente middleware de errores si existe
  next(error);
};

export default {
  unknownEndpoint,
  errorHandler,
};
