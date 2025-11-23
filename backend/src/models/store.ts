import mongoose from "mongoose";

const allowedCategories = [
  "Cafetería",
  "Restaurante",
  "Food Truck",
  "Máquina Expendedora",
  "Minimarket",
  "Otro",
];

interface IStore {
  storeCategory: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  junaeb: boolean;
  owner: mongoose.Types.ObjectId;
}

const storeSchema = new mongoose.Schema<IStore>({
  storeCategory: {
    type: String,
    required: true,
    enum: allowedCategories,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  junaeb: {
    type: Boolean,
    required: true,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

type TransformReturnedObject = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  id?: string;
  storeCategory: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  junaeb: boolean;
  owner: mongoose.Types.ObjectId;
};

storeSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IStore>("Store", storeSchema);
