import express from "express";
import Item from "../models/item";
import Store from "../models/store";
import Review from "../models/review";
import middleware from "../utils/middleware";

const router = express.Router();

// get /api/items/search - buscar items con filtros y rating de tienda
router.get("/search", async (req, res) => {
  const { q, sort } = req.query;

  const filter: Record<string, unknown> = {};
  if (typeof q === "string" && q.trim() !== "") {
    filter.name = { $regex: q, $options: "i" };
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

export default router;
