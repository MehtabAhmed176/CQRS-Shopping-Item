// src/handlers/update-item.handler.ts
import { AppDataSource } from '../utils/data-source';
import { Item } from '../models/item.entity';
import { OutboxRepository } from '../repositories/outbox.repository';

type UpdateItemDTO = {
  name?: string;
  price?: number;
};

/**
 * Update an item and persist a corresponding Outbox event (ItemUpdated)
 * in the SAME DB transaction to guarantee consistency.
 */
export const updateItemHandler = async (itemId: string, data: UpdateItemDTO) => {
  if (data.name === undefined && data.price === undefined) {
    throw new Error('Nothing to update: provide at least one of { name, price }.');
  }

  return AppDataSource.transaction(async (manager) => {
    // 1) Load current item (lock recommended to avoid concurrent lost updates)
    const itemRepo = manager.getRepository(Item);
    const item = await itemRepo.findOne({ where: { itemId } });

    console.log("item updated", item)

    if (!item) {
      // Let the controller/service convert this to a 404
      throw new Error(`Item not found: ${itemId}`);
    }

    // 2) Apply partial updates
    if (data.name !== undefined) item.name = data.name;
    if (data.price !== undefined) item.price = data.price;

    // TypeORM @UpdateDateColumn will bump updatedAt on save (if you use it)
    // Otherwise, uncomment:
    // item.updatedAt = new Date();

    // 3) Persist the item update
    await itemRepo.save(item);

    // 4) Write Outbox event in the same transaction
    const outboxEvent = manager.create(OutboxRepository.target, {
      eventType: 'ItemUpdated',
      payload: {
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        updatedAt: item.updatedAt, // relies on UpdateDateColumn; else use new Date()
      },
      // Optional fields depending on your Outbox schema:
      // status: 'PENDING',
      // publishedAt: null,
    });

    await manager.save(OutboxRepository.target, outboxEvent);

    // No direct publish here—the background outbox worker will pick it up and publish to RabbitMQ.
    return item;
  });
};
