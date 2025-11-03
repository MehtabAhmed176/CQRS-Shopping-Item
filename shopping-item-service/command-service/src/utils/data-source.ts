import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Item } from '../models/item.entity';
import dotenv from 'dotenv';
import { OutboxEntity as Outbox} from '../models/outbox.entity';

dotenv.config();
const isDocker = process.env.DOCKER_ENV === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isDocker ? 'postgres' : 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Item, Outbox],
  synchronize: true, // only for dev
});
