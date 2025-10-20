import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import middleware from "../utils/middleware";

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

  // el primer usuario registrado es admin
  const userCount = await User.countDocuments({});
  const role = userCount === 0 ? "admin" : "reviewer";

  const newUser = new User({
    username,
    passwordHash, // guardamos el hash, no la contraseña original
    role,
  });

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);
  return;
});

router.get("/", middleware.auth, middleware.isAdmin, async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.put("/:id", middleware.auth, middleware.isAdmin, async (req, res) => {
  const { role } = req.body;
  const userToUpdate = await User.findById(req.params.id);

  if (!userToUpdate) {
    return res.status(404).json({ error: "user not found" });
  }

  if (userToUpdate._id.toString() === req.user?.id) {
    return res.status(403).json({ error: "cannot change own role" });
  }

  userToUpdate.role = role;
  const updatedUser = await userToUpdate.save();
  res.json(updatedUser);
});

router.delete("/:id", middleware.auth, middleware.isAdmin, async (req, res) => {
  const adminUser = req.user;
  if (adminUser?.id === req.params.id) {
    return res.status(403).json({ error: "admin cannot delete themself" });
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
