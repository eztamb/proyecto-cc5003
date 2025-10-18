import express from "express";
import Store from "../models/store";

const router = express.Router();

// get /api/stores - listar todas las tiendas
router.get("/", async (_req, res) => {
  const stores = await Store.find({});
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
// (más adelante, esta ruta estará protegida)
router.post("/", async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { storeCategory, name, description, location, images, junaeb } = req.body;

  const newStore = new Store({
    storeCategory,
    name,
    description,
    location,
    images: images || [], // si no vienen imágenes, se guarda un array vacío
    junaeb: junaeb || false, // si no viene junaeb, por defecto es false
  });

  const savedStore = await newStore.save();
  res.status(201).json(savedStore); // 201 created
});

// delete /api/stores/:id - eliminar una tienda
// (más adelante, esta ruta estará protegida)
router.delete("/:id", async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  res.status(204).end(); // 204 no content
});

// put /api/stores/:id - actualizar una tienda
// (más adelante, esta ruta estará protegida)
router.put("/:id", async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { storeCategory, name, description, location, images, junaeb } = req.body;

  const storeToUpdate = {
    storeCategory,
    name,
    description,
    location,
    images,
    junaeb,
  };

  const updatedStore = await Store.findByIdAndUpdate(
    req.params.id,
    storeToUpdate,
    { new: true }, // { new: true } hace que devuelva el documento actualizado
  );

  res.json(updatedStore);
});

export default router;
