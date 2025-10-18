import express from "express";
import Review from "../models/review";
import Store from "../models/store";

const router = express.Router();

// get /api/reviews - listar todas las reviews
router.get("/", async (_req, res) => {
  const reviews = await Review.find({}).populate("store", { name: 1 });
  res.json(reviews);
});

// post /api/reviews - crear una nueva review
router.post("/", async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { storeId, rating, comment, picture, userName } = req.body;

  const store = await Store.findById(storeId);
  if (!store) {
    return res.status(400).json({ error: "invalid store id" });
  }

  const newReview = new Review({
    store: store._id,
    rating,
    comment,
    picture,
    userName, // más adelante, esto vendrá del usuario logueado
  });

  const savedReview = await newReview.save();
  res.status(201).json(savedReview);
  return;
});

export default router;
