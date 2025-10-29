import amqplib from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { handleItemCreated, handleItemUpdated } from "./src/events/item-event.handler";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const MONGO_URI = process.env.MONGO_URI!;
const QUEUE = "item_events";

async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Connect to RabbitMQ
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
    console.log("✅ Listening to RabbitMQ queue:", QUEUE);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;
      const event = JSON.parse(msg.content.toString());
      console.log("📩 Event received:", event);

      switch (event.type) {
        case "ItemCreated":
          await handleItemCreated(event.data);
          break;
        case "ItemUpdated":
          await handleItemUpdated(event.data);
          break;
      }

      channel.ack(msg);
    });
  } catch (err) {
    console.error("❌ Query service failed:", err);
  }
}

start();
