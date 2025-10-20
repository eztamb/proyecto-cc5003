import express from "express";
import Item from "../models/item";
import Store from "../models/store"; // importamos store para verificar que exista
import middleware from "../utils/middleware";

const router = express.Router();

// get /api/items - listar todos los items
router.get("/", async (_req, res) => {
  // .populate('store', ...) reemplaza el id de la tienda con los datos de la tienda
  const items = await Item.find({}).populate("store", { name: 1, location: 1 });
  res.json(items);
});

// post /api/items - crear un nuevo item
router.post("/", middleware.auth, middleware.isAdmin, async (req, res) => {
  const { name, storeId, description, picture, price } = req.body;

  // verificamos que la tienda exista
  const store = await Store.findById(storeId);
  if (!store) {
    return res.status(400).json({ error: "invalid store id" });
  }

  const newItem = new Item({
    name,
    store: store._id, // guardamos la referencia al id del documento de la tienda
    description,
    picture,
    price,
  });

  const savedItem = await newItem.save();
  res.status(201).json(savedItem);
  return;
});

export default router;
