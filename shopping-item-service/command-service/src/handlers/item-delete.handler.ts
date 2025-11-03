// src/handlers/delete-item.handler.ts
import { AppDataSource } from '../utils/data-source';
import { ItemRepository } from '../repositories/item.repository';
import { OutboxRepository } from '../repositories/outbox.repository';

export const deleteItemHandler = async (id: string) => {
  return await AppDataSource.transaction(async (manager) => {
    // 🧩 1️⃣ Fetch item before deletion
    const item = await manager.findOne(ItemRepository.target, { where: { itemId: id } });
    if (!item) throw new Error(`Item not found: ${id}`);

    console.log("🗑️ Item fetched for deletion:", item);

    // 🧩 2️⃣ Make a safe copy before removal
    const deletedPayload = {
      itemId: item.itemId, // ✅ stable id
      name: item.name,
      price: item.price,
      deletedAt: new Date(),
    };

    // 🧩 3️⃣ Delete item
    await manager.remove(ItemRepository.target, item);

    // 🧩 4️⃣ Save Outbox event
    const outboxEvent = manager.create(OutboxRepository.target, {
      eventType: 'ItemDeleted',
      payload: deletedPayload,
    });

    await manager.save(OutboxRepository.target, outboxEvent);

    console.log("✅ Outbox event created:", deletedPayload);
    return item;
  });
};

