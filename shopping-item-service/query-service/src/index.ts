import express from 'express';
import amqplib from 'amqplib';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { handleItemCreated, handleItemUpdated, handleItemDelete } from './handlers/item-event.handler.js';
import { ItemModel } from './models/item.model.js';

dotenv.config();

const app = express();
app.use(express.json());

const EXCHANGE = 'item_events'; // ✅ same name as publisher
const QUEUE = 'query_service_queue'; // unique queue name per service
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4002;

// Auto-select Mongo URI
const MONGO_URI =
  NODE_ENV === 'development'
    ? process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017/querydb'
    : process.env.MONGO_DOCKER_URI || 'mongodb://mongo:27017/querydb';

// Auto-select RabbitMQ URI
const RABBITMQ_URL =
  NODE_ENV === 'development'
    ? process.env.RABBITMQ_LOCAL_URL || 'amqp://localhost:5672'
    : process.env.RABBITMQ_DOCKER_URL || 'amqp://rabbitmq:5672';

console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`🧩 MongoDB URI: ${MONGO_URI}`);
console.log(`🐇 RabbitMQ URI: ${RABBITMQ_URL}`);

async function start() {
  try {
    // ✅ 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ✅ 2. Connect to RabbitMQ
    const connection = await amqplib.connect(RABBITMQ_URL, { heartbeat: 60 });
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'fanout', { durable: true }); // ensure same exchange
    const { queue } = await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(queue, EXCHANGE, ''); // ✅ crucial link

    console.log(`✅ Bound queue "${queue}" to exchange "${EXCHANGE}"`);
    console.log(`🐇 Listening for events on "${EXCHANGE}"`);

    // ✅ 3. Consume events
    channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;
        console.log('📩 Raw message:', msg.content.toString());

        try {
          const event = JSON.parse(msg.content.toString());
          console.log('📦 Event received:', event);

          switch (event.type) {
            case 'ItemCreated':
              await handleItemCreated(event.data);
              break;
            case 'ItemUpdated':
              await handleItemUpdated(event.data);
              break;
            case 'ItemDeleted':
              await handleItemDelete(event.data)  
            default:
              console.warn('⚠️ Unknown event type:', event.type);
          }

          channel.ack(msg);
        } catch (err) {
          console.error('❌ Error handling event:', err);
        }
      },
      { noAck: false },
    );

    // ✅ 4. Express API routes
    app.get('/api/query/items', async (req, res) => {
      const items = await ItemModel.find();
      res.json(items);
    });

    app.get('/api/query/items/:id', async (req, res) => {
      const { id } = req.params;
      console.log('🔍 QueryService request for itemId:', id);

      try {
        const item = await ItemModel.findOne({ itemId: id });
        if (!item) {
          return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: 'Internal server error while fetching item',
          error: error.message,
        });
      }
    });

    // ✅ 5. Start server
    app.listen(PORT, () => {
      console.log(`🚀 Query Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Query service failed:', err);
  }
}

start();
