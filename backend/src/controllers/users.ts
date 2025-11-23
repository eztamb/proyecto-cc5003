import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import SellerRequest from "../models/sellerRequest";
import middleware from "../utils/middleware";
import { validateEmail, validateRut } from "../utils/validation";

const router = express.Router();

// post /api/users - para registrar un nuevo usuario
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // validaciones básicas
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: "username must be at least 3 characters long" });
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res
      .status(400)
      .json({ error: "username can only contain letters, numbers and underscores" });
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
    passwordHash,
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

// crear solicitud
router.post("/requests", middleware.auth, async (req, res) => {
  const { fullName, rut, email, description } = req.body;
  const user = req.user;

  if (!user) return res.status(401).end();

  // Validaciones de solicitud
  if (!fullName || fullName.trim().length < 5 || fullName.length > 100) {
    return res.status(400).json({ error: "Full Name must be between 5 and 100 characters" });
  }

  if (!validateRut(rut)) {
    return res.status(400).json({ error: "Invalid RUT" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid Email" });
  }

  if (!description || description.trim().length < 20 || description.length > 500) {
    return res.status(400).json({ error: "Description must be between 20 and 500 characters" });
  }

  // verificar si ya existe una pendiente
  const existing = await SellerRequest.findOne({ user: user.id, status: "pending" });
  if (existing) {
    return res.status(400).json({ error: "Pending request already exists" });
  }

  const newRequest = new SellerRequest({
    user: user.id,
    fullName,
    rut,
    email,
    description,
  });

  const savedRequest = await newRequest.save();
  res.status(201).json(savedRequest);
});

// listar solicitudes (Admin)
router.get("/requests", middleware.auth, middleware.isAdmin, async (_req, res) => {
  const requests = await SellerRequest.find({ status: "pending" }).populate("user", {
    username: 1,
  });
  res.json(requests);
});

// aprobar/rechazar solicitud (Admin)
router.put("/requests/:id", middleware.auth, middleware.isAdmin, async (req, res) => {
  const { status } = req.body; // approved | rejected
  const request = await SellerRequest.findById(req.params.id);

  if (!request) return res.status(404).json({ error: "Request not found" });

  request.status = status;
  await request.save();

  if (status === "approved") {
    await User.findByIdAndUpdate(request.user, { role: "seller" });
  }

  res.json(request);
});

export default router;
