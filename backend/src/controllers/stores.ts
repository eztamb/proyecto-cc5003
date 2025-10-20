import express from "express";
import Store from "../models/store";
import middleware from "../utils/middleware";

const router = express.Router();

// get /api/stores - listar todas las tiendas (con filtros opcionales)
router.get("/", async (req, res) => {
  const { category, search } = req.query;

  const filter: any = {};

  if (category && typeof category === "string" && category !== "all") {
    filter.storeCategory = category;
  }

  if (search && typeof search === "string") {
    // Busca en name y description, insensible a mayúsculas/minúsculas
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const stores = await Store.find(filter);
  res.json(stores);
});

// get /api/stores/:id - obtener una tienda por id
router.get("/:id", async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (store) {
    res.json(store);
  } else {
    res.status(404).end(); // not found
  }
});

// post /api/stores - crear una nueva tienda
router.post("/", middleware.auth, middleware.isAdmin, async (req, res) => {
  const { storeCategory, name, description, location, images, junaeb } = req.body;

  const newStore = new Store({
    storeCategory,
    name,
    description,
    location,
    images: images || [],
    junaeb: junaeb || false,
  });

  const savedStore = await newStore.save();
  res.status(201).json(savedStore); // 201 created
});

// delete /api/stores/:id - eliminar una tienda
router.delete("/:id", middleware.auth, middleware.isAdmin, async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  res.status(204).end(); // 204 no content
});

// put /api/stores/:id - actualizar una tienda
router.put("/:id", middleware.auth, middleware.isAdmin, async (req, res) => {
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
