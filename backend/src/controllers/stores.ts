import express from "express";
import Store from "../models/store";
import middleware from "../utils/middleware";

const router = express.Router();

interface StoreFilter {
  storeCategory?: string;
  owner?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

router.get("/", async (req, res) => {
  const { category, search, owner } = req.query;

  const filter: StoreFilter = {};

  if (category && typeof category === "string" && category !== "all") {
    filter.storeCategory = category;
  }

  if (search && typeof search === "string") {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (owner && typeof owner === "string") {
    filter.owner = owner;
  }

  const stores = await Store.find(filter);
  res.json(stores);
});

router.get("/:id", async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (store) {
    res.json(store);
  } else {
    res.status(404).end();
  }
});

// Crear tienda (Admin o Seller)
router.post("/", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const { storeCategory, name, description, location, images, junaeb } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ error: "token missing" });

  const newStore = new Store({
    storeCategory,
    name,
    description,
    location,
    images: images || [],
    junaeb: junaeb || false,
    owner: user.id, // Asigna al creador como dueño
  });

  const savedStore = await newStore.save();
  res.status(201).json(savedStore);
});

router.delete("/:id", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).end();

  const user = req.user;
  if (user?.role !== "admin" && store.owner.toString() !== user?.id) {
    return res.status(403).json({ error: "permission denied" });
  }

  await Store.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

router.put("/:id", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).end();

  const user = req.user;
  if (user?.role !== "admin" && store.owner.toString() !== user?.id) {
    return res.status(403).json({ error: "permission denied" });
  }

  const { storeCategory, name, description, location, images, junaeb } = req.body;

  const storeToUpdate = {
    storeCategory,
    name,
    description,
    location,
    images,
    junaeb,
  };

  const updatedStore = await Store.findByIdAndUpdate(req.params.id, storeToUpdate, { new: true });
  res.json(updatedStore);
});

export default router;
