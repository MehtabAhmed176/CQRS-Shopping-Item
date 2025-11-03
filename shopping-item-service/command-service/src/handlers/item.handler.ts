import { AppDataSource } from '../utils/data-source';
import { ItemRepository } from '../repositories/item.repository';
import { OutboxRepository } from '../repositories/outbox.repository';
import { Item } from '../models/item.entity';

/**
 * Create an item and ensure consistency with event publishing via Outbox Pattern.
 */
export const createItemHandler = async (data: { itemId?: string; name: string; price: number }) => {
  return await AppDataSource.transaction(async (manager) => {
    // 🧩 1️⃣ Create item entity
    const item = manager.create(ItemRepository.target, {
      itemId: data.itemId,
      name: data.name,
      price: data.price,
    });

    console.log('Creating item in DB:', item);

    // 🧩 2️⃣ Save to PostgreSQL
    await manager.save(ItemRepository.target, item);

    // 🧩 3️⃣ Save corresponding event to Outbox (same DB transaction)
    const outboxEvent = manager.create(OutboxRepository.target, {
      eventType: 'ItemCreated',
      payload: {
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        updatedAt: item.updatedAt,
      },
    });

    await manager.save(OutboxRepository.target, outboxEvent);

    // No direct RabbitMQ publish here — the background worker handles it safely later
    return item;
  });
};
