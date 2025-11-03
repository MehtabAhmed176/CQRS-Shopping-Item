import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: any = null;
let connection: any = null;

const EXCHANGE = 'item_events'; // ✅ consistent with Query Service
const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

/**
 * Establishes RabbitMQ connection and channel.
 * Should be called once when the app starts.
 */
export const connectRabbit = async () => {
  try {
    console.log('🔌 Connecting to RabbitMQ:', RABBIT_URL);

    connection = await amqp.connect(RABBIT_URL);
    if (!connection) throw new Error('Failed to create connection');
    
    channel = await connection.createChannel();
    if (!channel) throw new Error('Failed to create channel');

    await channel.assertExchange(EXCHANGE, 'fanout', { durable: true });

    console.log('🐇 RabbitMQ connected and exchange declared:', EXCHANGE);

    // Optional: Handle graceful shutdown
    process.on('exit', () => {
      if (channel) channel.close();
      if (connection) connection.close();
      console.log('🧹 RabbitMQ connection closed');
    });
  } catch (error) {
    console.error('❌ RabbitMQ connection failed:', error);
    setTimeout(connectRabbit, 5000); // 🔁 Retry after 5 seconds
  }
};

/**
 * Publishes an event to RabbitMQ.
 */
export const publishEvent = async (
  eventType: string,
  data: Record<string, any>,
) => {
  if (!channel) {
    console.warn('⚠️ Channel not ready, attempting to reconnect...');
    await connectRabbit();
  }

  try {
    const payload = JSON.stringify({ type: eventType, data });
    channel!.publish(EXCHANGE, '', Buffer.from(payload), { persistent: true });
    console.log(`📤 Event published: ${eventType}`);
  } catch (error) {
    console.error('❌ Failed to publish event:', error);
  }
};
