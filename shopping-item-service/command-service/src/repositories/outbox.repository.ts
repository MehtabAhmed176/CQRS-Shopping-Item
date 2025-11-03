import { AppDataSource } from '../utils/data-source';
import { OutboxEntity } from '../models/outbox.entity';

export const OutboxRepository = AppDataSource.getRepository(OutboxEntity);
