import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: String,
  price: Number,
  updatedAt: Date,
});

export const ItemModel = mongoose.model("Item", itemSchema);
