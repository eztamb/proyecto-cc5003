import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user";
import middleware from "../utils/middleware";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  // --- el usuario es válido, ahora creamos los tokens ---

  // 1. generamos un token csrf aleatorio
  const csrfToken = crypto.randomUUID();

  // 2. creamos el objeto que irá dentro del jwt (el payload)
  const userForToken = {
    username: user.username,
    id: user._id.toString(),
    role: user.role,
    csrf: csrfToken, // incluimos el token csrf en el payload del jwt
  };

  // 3. firmamos el jwt con una clave secreta
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env file");
    return res.status(500).json({ error: "internal server error" });
  }

  const token = jwt.sign(userForToken, JWT_SECRET, {
    expiresIn: "1h", // el token expirará en 1 hora
  });

  // 4. enviamos los tokens al cliente
  res
    .cookie("token", token, {
      httpOnly: true, // la cookie no es accesible desde javascript en el navegador
      secure: process.env.NODE_ENV === "production", // solo se envía en https en producción
      sameSite: "strict", // la cookie solo se envía en peticiones del mismo sitio
    })
    .setHeader("X-CSRF-Token", csrfToken) // enviamos el csrf token en un header
    .status(200)
    .send({ username: user.username, id: user.id, role: user.role });

  return;
});

router.get("/me", middleware.auth, async (req, res) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.status(200).send({ username: user.username, id: user.id, role: user.role });
  return;
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token").status(204).end();
});

export default router;
