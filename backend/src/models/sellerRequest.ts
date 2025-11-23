import mongoose from "mongoose";

interface ISellerRequest {
  user: mongoose.Types.ObjectId;
  fullName: string;
  rut: string;
  email: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}

const sellerRequestSchema = new mongoose.Schema<ISellerRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    rut: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

type TransformReturnedObject = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  id?: string;
  user: mongoose.Types.ObjectId;
  fullName: string;
  rut: string;
  email: string;
  description: string;
  status: "pending" | "approved" | "rejected";
};

sellerRequestSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<ISellerRequest>("SellerRequest", sellerRequestSchema);
