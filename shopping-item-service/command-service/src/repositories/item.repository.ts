import { AppDataSource } from '../utils/data-source';
import { Item } from '../models/item.entity';

export const ItemRepository = AppDataSource.getRepository(Item);
