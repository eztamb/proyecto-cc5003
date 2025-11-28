import express from "express";
import Item, { IItem } from "../models/item";
import Store from "../models/store";
import Review from "../models/review";
import middleware from "../utils/middleware";
import type { FilterQuery } from "mongoose";
import { createAccentRegex } from "../utils/search";

const router = express.Router();

// get /api/items/search - buscar items con filtros y rating de tienda
router.get("/search", async (req, res) => {
  const { q, sort } = req.query;

  const filter: FilterQuery<IItem> = {};
  if (typeof q === "string" && q.trim() !== "") {
    // usamos el helper para generar el regex
    const regexPattern = createAccentRegex(q.trim());
    filter.name = { $regex: regexPattern, $options: "i" };
  }

  let sortOption: Record<string, 1 | -1> = {};
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const items = await Item.find(filter)
    .sort(sortOption)
    .populate("store", { name: 1, location: 1 });

  // Enriquecer items con el rating de la tienda
  const itemsWithStoreRating = await Promise.all(
    items.map(async (item) => {
      const itemObj = item.toJSON();
      const reviews = await Review.find({ store: item.store });
      const averageRating =
        reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

      return {
        ...itemObj,
        storeRating: Math.round(averageRating * 10) / 10,
      };
    }),
  );

  res.json(itemsWithStoreRating);
});

router.get("/", async (_req, res) => {
  // .populate('store', ...) reemplaza el id de la tienda con los datos de la tienda
  const items = await Item.find({}).populate("store", { name: 1, location: 1 });
  res.json(items);
});

router.post("/", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const { name, storeId, description, picture, price } = req.body;
  const user = req.user;

  // verificamos que la tienda exista
  const store = await Store.findById(storeId);
  if (!store) {
    return res.status(400).json({ error: "invalid store id" });
  }

  // Validar permisos: Admin o Dueño de la tienda
  if (user?.role !== "admin" && store.owner.toString() !== user?.id) {
    return res.status(403).json({ error: "not authorized to add items to this store" });
  }

  const newItem = new Item({
    name,
    store: store._id,
    description,
    picture,
    price,
  });

  const savedItem = await newItem.save();
  res.status(201).json(savedItem);
  return;
});

router.put("/:id", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const { name, description, picture, price } = req.body;
  const user = req.user;

  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "item not found" });
  }

  const store = await Store.findById(item.store);
  if (!store) {
    return res.status(404).json({ error: "store not found" });
  }

  // validar permisos: Admin o Dueño de la tienda
  if (user?.role !== "admin" && store.owner.toString() !== user?.id) {
    return res.status(403).json({ error: "permission denied" });
  }

  item.name = name;
  item.description = description;
  item.picture = picture;
  item.price = price;

  const updatedItem = await item.save();
  res.json(updatedItem);
  return;
});

router.delete("/:id", middleware.auth, middleware.isSellerOrAdmin, async (req, res) => {
  const user = req.user;

  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).end();
  }

  const store = await Store.findById(item.store);
  if (!store) {
    // si no hay tienda asociada (data inconsistente), permitimos borrar al admin
    if (user?.role === "admin") {
      await Item.findByIdAndDelete(req.params.id);
      return res.status(204).end();
    }
    return res.status(404).json({ error: "associated store not found" });
  }

  // validar permisos
  if (user?.role !== "admin" && store.owner.toString() !== user?.id) {
    return res.status(403).json({ error: "permission denied" });
  }

  await Item.findByIdAndDelete(req.params.id);
  res.status(204).end();
  return;
});

export default router;
