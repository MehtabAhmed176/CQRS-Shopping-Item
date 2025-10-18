import amqp from 'amqplib';

export async function publishEvent(eventName: string, data: any) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  const exchange = 'item_events';
  await channel.assertExchange(exchange, 'fanout', { durable: true });

  channel.publish(exchange, '', Buffer.from(JSON.stringify({ eventName, data })));
  console.log(`[Event Published] ${eventName}`);

  await channel.close();
  await connection.close();
}
