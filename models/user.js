import { Mongoose } from "mongoose";

const { Schema, model } = Mongoose;
const UserSchema = new Schema({
  name: { type: String, required: true, min: 4, unique: false },
  email: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model("User", UserSchema);
