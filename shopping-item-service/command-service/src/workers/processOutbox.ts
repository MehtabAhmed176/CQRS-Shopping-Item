// src/workers/processOutbox.ts
import { AppDataSource } from '../utils/data-source';
import { OutboxRepository } from '../repositories/outbox.repository';
import { publishEvent } from '../rabbitmq';

const MAX_RETRIES = 5;

export const processOutbox = async () => {
  const outboxRepo = AppDataSource.getRepository('outbox');

  const pending = await outboxRepo.find({
    where: { processed: false },
    take: 20,
  });
 
  for (const event of pending) {
    try {
      await publishEvent(event.eventType, event.payload);
      event.processed = true;
      await outboxRepo.save(event);
      console.log(`✅ Published ${event.eventType} and Payload ${ JSON.stringify(event.payload)}`);
    } catch (err) {
      console.error(`❌ Failed to publish ${event.eventType}`, err);
      event.retryCount += 1;

      if (event.retryCount >= MAX_RETRIES) {
        console.error(`⚠️ Event ${event.id} moved to dead-letter queue`);
        // Optional: move to a dead-letter table
      }

      await outboxRepo.save(event);
    }
  }
};
