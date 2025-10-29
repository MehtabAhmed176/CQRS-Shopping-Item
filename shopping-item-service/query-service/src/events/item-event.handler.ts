import { ItemModel } from "../models/item.model.js";

export const handleItemCreated = async (data: any) => {
  console.log("🟢 ItemCreated received:", data);
  await ItemModel.create({
    itemId: data.id,
    name: data.name,
    price: data.price,
    updatedAt: new Date(),
  });
};

export const handleItemUpdated = async (data: any) => {
  console.log("🟡 ItemUpdated received:", data);
  await ItemModel.updateOne(
    { itemId: data.id },
    { $set: { name: data.name, price: data.price, updatedAt: new Date() } }
  );
};
