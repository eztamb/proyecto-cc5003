import mongoose from "mongoose";

export interface IUser {
  username: string;
  passwordHash: string;
  role: "admin" | "reviewer" | "seller";
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "reviewer", "seller"],
    default: "reviewer",
  },
});

type TransformReturnedObject = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  passwordHash?: string;
  id?: string;
  username: string;
  role: "admin" | "reviewer" | "seller";
};

userSchema.set("toJSON", {
  transform: (_document, returnedObject: TransformReturnedObject) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model<IUser>("User", userSchema);
