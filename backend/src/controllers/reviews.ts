import express from "express";
import Review from "../models/review";
import Store from "../models/store";
import middleware from "../utils/middleware";

const router = express.Router();

// get /api/reviews - listar todas las reviews
router.get("/", async (_req, res) => {
  const reviews = await Review.find({})
    .populate("store", { name: 1 })
    .populate("user", { username: 1 });
  res.json(reviews);
});

// post /api/reviews - crear una nueva review
router.post("/", middleware.auth, async (req, res) => {
  const { storeId, rating, comment, picture, userName } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "operation not permitted" });
  }

  const store = await Store.findById(storeId);
  if (!store) {
    return res.status(400).json({ error: "invalid store id" });
  }

  const newReview = new Review({
    store: store._id,
    user: user.id,
    rating,
    comment,
    picture,
    userName: userName || user.username,
  });

  const savedReview = await newReview.save();
  await savedReview.populate("user", { username: 1 });
  res.status(201).json(savedReview);
  return;
});

// delete /api/reviews/:id - eliminar una review
router.delete("/:id", middleware.auth, async (req, res) => {
  const user = req.user;
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).end();
  }

  // user is admin or the creator of the review
  if (user?.role === "admin" || review.user.toString() === user?.id) {
    await Review.findByIdAndDelete(req.params.id);
    return res.status(204).end();
  }

  return res.status(403).json({ error: "operation not permitted" });
});

export default router;
