import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

const router = express.Router();

// post /api/users - para registrar un nuevo usuario
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 characters long" });
  }

  // el costo del hashing! 10 es un valor estándar y seguro.
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    passwordHash, // guardamos el hash, no la contraseña original
  });

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);
  return;
});

router.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

export default router;
