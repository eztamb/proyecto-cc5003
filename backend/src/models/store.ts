import mongoose from "mongoose";

interface IStore {
  storeCategory: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  junaeb: boolean;
}

const storeSchema = new mongoose.Schema<IStore>({
  storeCategory: {
    type: String,
    required: true,
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
};

storeSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IStore>("Store", storeSchema);
