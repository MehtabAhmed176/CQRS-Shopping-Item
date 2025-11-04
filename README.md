# 🛍️ CQRS Architecture — Shopping Item Service  
**Tech Stack:** Node.js · NestJS · PostgreSQL · RabbitMQ · MongoDB · Docker  

This project demonstrates a **microservices-based CQRS (Command Query Responsibility Segregation)** architecture that cleanly separates **command (write)** and **query (read)** responsibilities for a **Shopping Item domain**, ensuring **scalability**, **reliability**, and **real-time data synchronization** through **RabbitMQ** and the **Outbox pattern**.

It’s designed as a practical example of implementing **event-driven microservices** with clear separation of concerns and **eventual consistency** between data stores.  
The system is fully containerized with **Docker Compose** and can be extended for **Kubernetes deployment** or **CI/CD pipelines**.


---

## 🧱 Architecture Overview

![CQRS Architecture Diagram](./docs/CQRS_ShoppingItem.png)

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **API Gateway** | NestJS (HTTP Proxy for microservice routing) |
| **Command Service** | Express + TS + PostgreSQL (TypeORM / Sequelize) |
| **Query Service** | Express + TS + MongoDB (Mongoose / ODM) |
| **Messaging** | RabbitMQ (Event-driven communication) |
| **Containerization** | Docker Compose |
| **Language** | TypeScript |

---

## 🗂 Folder Structure

```bash
shopping-item-service/
│
├── api-gateway/
│   ├── package.json
│   └── src/
│       ├── controllers/
│       │   ├── command.controller.ts
│       │   └── query.controller.ts
│       ├── routes/
│       │   ├── items.command.routes.ts
│       │   └── items.query.routes.ts
│       ├── main.ts
│       └── app.module.ts
│
├── command-service/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── events/
│       │   ├── publisher.ts
│       │   └── rabbitmq.ts
│       ├── handlers/
│       │   ├── create-item.handler.ts
│       │   ├── update-item.handler.ts
│       │   └── delete-item.handler.ts
│       ├── models/
│       │   ├── item.entity.ts
│       │   └── outbox.entity.ts
│       ├── repositories/
│       │   ├── item.repository.ts
│       │   └── outbox.repository.ts
│       ├── workers/
│       │   └── processOutbox.ts
│       ├── utils/
│       │   └── data-source.ts
│       └── main.ts
│
├── query-service/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── events/
│       │   └── rabbitmq.listener.ts
│       ├── handlers/
│       │   ├── item-event.handler.ts
│       │   └── item-update.handler.ts
│       ├── models/
│       │   └── item.model.ts
│       ├── routes/
│       │   └── item.routes.ts
│       └── index.ts
│
├── docs/
│   ├── CQRS_ShoppingItem.drawio
│   └── CQRS_ShoppingItem.png
│
├── docker-compose.yml
├── README.md
└── .gitignore

```


## 🔧 Environment Variables
```bash
### 🧩 Command Service (`.env`)
PORT=4001
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=commanddb
RABBITMQ_URL=amqp://rabbitmq:5672


### 🔍 Query Service (`.env`)
PORT=4002
MONGO_URI=mongodb://mongodb:27017/querydb
RABBITMQ_URL=amqp://rabbitmq:5672
```

---

## ⚙️ Development Workflow (Recommended)
📁 **Note:** Please run all commands from the root directory — `shopping-item-service/`
> 💡 **Preferred Local Setup**
>
> For development, it’s recommended to run the **Node.js services** —  
> `command-service`, `api-gateway`, and `query-service` — **outside of Docker** for:
> - Faster reloads
> - Easier debugging
> - No rebuild overhead
>
> Meanwhile, run the **infrastructure services** —  
> 🐘 **PostgreSQL**, 🐇 **RabbitMQ**, and 🍃 **MongoDB** — **inside Docker** for consistency and isolation.
>
> This hybrid setup provides the best developer experience.  

---

> ⚠️ **Important:**  
> Don’t forget to run the **Outbox Worker** to publish unprocessed events:
>
> ```bash
> cd command-service
> npm run worker
> ```
>
> Without it, events from the Outbox table won’t be sent to RabbitMQ, and the **Query Service (MongoDB)** will not receive updates.

---

## 🚀 Setup & Run

1️⃣ Install Dependencies
```bash
cd api-gateway && npm install
cd command-service && npm install
cd query-service && npm install
 
``` 

2️⃣ Run Infrastructure Containers Only

Use Docker Compose to start only the infrastructure stack:
```bash
docker compose up postgres mongo rabbitmq
```

This launches:

🐘 PostgreSQL — for the Command Service (Write side)

🍃 MongoDB — for the Query Service (Read side)

🐇 RabbitMQ — for event propagation between services

These containers will stay running in the background and can be reused across multiple development sessions.

3️⃣ Run Node Services Locally (Outside Docker)

Open three separate terminals for live reload and debugging:
```bash 
#🏗 API Gateway
cd api-gateway
npm run start:dev
```
```bash
# 🧩 Command Service
cd command-service
npm run start:dev
```
```bash
# 📚 Query Service
cd query-service
npm run start:dev
```
✅ Each service connects automatically to its respective database or message broker (running in Docker).

✅ Instant hot-reload support when using ts-node-dev or nodemon.


4️⃣ Run the Outbox Worker

In a separate terminal:
```bash cd command-service
npm run worker
```
This continuously monitors the Outbox table and publishes pending domain events to RabbitMQ, which are then consumed by the Query Service.

### 🧾 TL;DR
| Environment                | Recommendation                                         |
| -------------------------- | ------------------------------------------------------ |
| 🧪 **Development**         | Run Node services locally + infra in Docker            |
| 🐳 **Full Container Mode** | Run all services via `docker compose up`               |
| ☸️ **Production**          | Deploy with Kubernetes or ECS and external managed DBs |


🌐 Access Services
| Service                 | URL                                              | Description                          |
| ----------------------- | ------------------------------------------------ | ------------------------------------ |
| **API Gateway**         | [http://localhost:4000](http://localhost:4000)   | Routes to command/query services     |
| **Command Service**     | [http://localhost:4001](http://localhost:4001)   | Handles writes (PostgreSQL)          |
| **Query Service**       | [http://localhost:4002](http://localhost:4002)   | Handles reads (MongoDB)              |
| **RabbitMQ Management** | [http://localhost:15672](http://localhost:15672) | Default user/pass: `guest` / `guest` |

---

---

## 🧪 API Testing with Postman

A ready-to-use **Postman Collection** is included to test all endpoints across the API Gateway, Command Service, and Query Service.

📂 **File:** [`docs/ShoppingItemService.postman_collection.json`](./docs/ShoppingItemService.postman_collection.json)

### 🚀 How to Import
1. Open **Postman**
2. Click **File → Import**
3. Select the file:  
   `docs/ShoppingItemService.postman_collection.json`
4. All API routes will appear under **Shopping Item Service** collection

### ✅ Included Requests
| Service | Method | Endpoint | Description |
|----------|--------|-----------|--------------|
| **API Gateway** | `POST` | `/api/command/items` | Create item |
| **API Gateway** | `GET` | `/api/query/items` | Get all items |
| **API Gateway** | `GET` | `/api/query/items/:id` | Get item by ID |
| **API Gateway** | `PUT` | `/api/command/items/:id` | Update item |
| **API Gateway** | `DELETE` | `/api/command/items/:id` | Soft delete item |

> 💡 *Each request automatically uses the correct `localhost` ports defined in your Docker/Local setup.*
---

---

## 🧪 Manual Testing / Test Plan

After setup, you can manually verify that the system works end-to-end.  
Use Postman or any API client to test these scenarios.

| Step | Action | Expected Result |
|------|---------|-----------------|
| 1️⃣ | **Create Item** – Send a `POST` request to `/api/command/items` with name and price. | Item is saved in PostgreSQL, event appears in RabbitMQ, and item is created in MongoDB. |
| 2️⃣ | **Get All Items** – Send a `GET` request to `/api/query/items`. | Newly created item should appear in the list from MongoDB. |
| 3️⃣ | **Get Item by ID** – Send a `GET` request to `/api/query/items/:id`. | Returns the specific item details. |
| 4️⃣ | **Update Item** – Send a `PUT` request to `/api/command/items/:id` with new data. | Updated data is saved in PostgreSQL and reflected in MongoDB after event propagation. |
| 5️⃣ | **Delete Item** – Send a `DELETE` request to `/api/command/items/:id`. | Item is soft deleted in PostgreSQL and removed from MongoDB. |
| 6️⃣ | **Verify Consistency** – Check both databases. | PostgreSQL shows `deletedAt` timestamp; MongoDB no longer contains the item. |

🧠 **Tip:** Always make sure your worker process is running (`npm run worker`) —  
otherwise, events will remain unprocessed in the Outbox.

---




