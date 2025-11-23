import mongoose from "mongoose";
import { IUser } from "./user";

interface IReview {
  store: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUser;
  rating: number;
  comment: string;
  picture?: string;
  userName?: string;
  updatedAt?: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    userName: {
      type: String,
    },
  },
  { timestamps: true }, // Maneja createdAt y updatedAt automáticamente
);

// Indice compuesto único para evitar múltiples reseñas del mismo usuario a la misma tienda
reviewSchema.index({ store: 1, user: 1 }, { unique: true });

type TransformReturnedObject = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  id?: string;
  store: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUser;
  rating: number;
  comment: string;
  picture?: string;
  userName?: string;
  updatedAt?: Date;
  createdAt?: Date;
};

reviewSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
