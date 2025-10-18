import { ItemRepository } from '../repositories/item.repository';
import { publishEvent } from '../events/rabbitmq';
import { Item } from '../models/item.entity';

export const createItemHandler = async (data: { name: string; price: number }) => {
  const item = ItemRepository.create(data);
  await ItemRepository.save(item);

  await publishEvent('ItemCreated', { id: item.id, name: item.name, price: item.price });
  return item;
};
