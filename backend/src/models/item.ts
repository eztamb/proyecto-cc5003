import mongoose from "mongoose";

interface IItem {
  name: string;
  store: mongoose.Types.ObjectId;
  description: string;
  picture?: string;
  price: number;
}

const itemSchema = new mongoose.Schema<IItem>({
  name: {
    type: String,
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

type TransformReturnedObject = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  id?: string;
  name: string;
  store: mongoose.Types.ObjectId;
  description: string;
  picture?: string;
  price: number;
};

itemSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IItem>("Item", itemSchema);
