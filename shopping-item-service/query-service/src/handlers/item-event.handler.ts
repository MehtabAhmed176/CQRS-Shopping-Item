import { ItemModel } from "../models/item.model.js";

// 🟢 Handle ItemCreated Event
export const handleItemCreated = async (data: any) => {
  try {
    console.log("🟢 [ItemCreated] event received:", data);

    // Check if item already exists (avoid duplicates)
    const existing = await ItemModel.findOne({ itemId: data.itemId });
    if (existing) {
      console.log(`⚠️ Item with itemId=${data.itemId} already exists, skipping insert.`);
      return;
    }

    // Create new document in MongoDB
    const item = new ItemModel({
      itemId: data.itemId,
      name: data.name,
      price: data.price,
      updatedAt: data.updatedAt || new Date(),
    });

    await item.save();
    console.log(`✅ Item created in MongoDB (itemId=${data.itemId})`);
  } catch (error: any) {
    console.error("❌ Error in handleItemCreated:", error.message);
  }
};

// 🟡 Handle ItemUpdated Event
export const handleItemUpdated = async (data: any) => {
  try {
    console.log("🟡 [ItemUpdated] event received:", data);

    const result = await ItemModel.updateOne(
      { itemId: data.itemId },
      {
        $set: {
          name: data.name,
          price: data.price,
          updatedAt: data.updatedAt || new Date(),
        },
      },
      { upsert: false } // do not create if missing
    );

    if (result.matchedCount === 0) {
      console.log(`⚠️ Item with itemId=${data.itemId} not found for update.`);
    } else {
      console.log(`✅ Item updated in MongoDB (itemId=${data.itemId})`);
    }
  } catch (error: any) {
    console.error("❌ Error in handleItemUpdated:", error.message);
  }
};

export const handleItemDelete = async (data: any) => {
  try {
    console.log("🟡 [ItemDeleted] event received:", data);
    await ItemModel.deleteOne({ itemId: data.itemId });
    console.log(`✅ Item deleted from MongoDB (itemId=${data.itemId})`);
  } catch (error: any) {
    console.error("❌ Error in handleItemDelete:", error.message);
  }
};