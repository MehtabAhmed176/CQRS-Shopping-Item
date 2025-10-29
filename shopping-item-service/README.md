# 🛍️ CQRS Architecture — Shopping Item Service  
**Tech Stack:** Node.js · NestJS · PostgreSQL · RabbitMQ · MongoDB · Docker  

This project implements a **CQRS (Command Query Responsibility Segregation)** architecture using **microservices** to separate write and read operations for a `Shopping Item` domain.

---

## 🧱 Architecture Overview

            ┌─────────────────────────┐
            │       API Gateway       │
            │  (NestJS - Routes to MS)│
            └────────────┬────────────┘
                         │
   ┌─────────────────────┼─────────────────────┐
   ▼                                           ▼
┌────────────────────────┐ ┌────────────────────────┐
│ Command Service │ │ Query Service │
│ (NestJS + PostgreSQL) │ │ (NestJS + MongoDB) │
│ - Handles Writes (CUD) │ │ - Handles Reads (R) │
│ - Publishes Events via │ │ - Subscribes to Events │
│ RabbitMQ │ │ via RabbitMQ │
└────────────────────────┘ └────────────────────────┘
┌──────────────────────┐
│ RabbitMQ Bus │
│ (Event propagation) │
└──────────────────────┘


---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **API Gateway** | NestJS (HTTP Proxy for microservice routing) |
| **Command Service** | NestJS + PostgreSQL (TypeORM / Sequelize) |
| **Query Service** | NestJS + MongoDB (Mongoose / ODM) |
| **Messaging** | RabbitMQ (Event-driven communication) |
| **Containerization** | Docker Compose |
| **Language** | TypeScript |

---

## 🗂 Folder Structure

shopping-item-service/
│
├── api-gateway/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── items.command.routes.ts
│ │ │ └── items.query.routes.ts
│ │ ├── controllers/
│ │ │ ├── command.controller.ts
│ │ │ └── query.controller.ts
│ │ └── main.ts
│ └── package.json
│
├── command-service/
│ ├── src/
│ │ ├── commands/
│ │ ├── handlers/
│ │ ├── events/
│ │ ├── models/
│ │ ├── repositories/
│ │ └── main.ts
│ └── package.json
│
├── query-service/
│ ├── src/
│ │ ├── events/
│ │ ├── handlers/
│ │ ├── models/
│ │ ├── repositories/
│ │ └── main.ts
│ └── package.json
│
├── docker-compose.yml
└── README.md


---

## 🔧 Environment Variables

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


---

## 🚀 Setup & Run

### 1. Install Dependencies
```bash
cd command-service && npm install
cd ../api-gateway && npm install


2. Run Containers
docker compose up --build


3. Stop & Rebuild Containers
docker compose down -v
docker compose up --build



🌐 Access Services
| Service                 | URL                                              | Description                          |
| ----------------------- | ------------------------------------------------ | ------------------------------------ |
| **API Gateway**         | [http://localhost:4000](http://localhost:4000)   | Routes to command/query services     |
| **Command Service**     | [http://localhost:4001](http://localhost:4001)   | Handles writes (PostgreSQL)          |
| **Query Service**       | [http://localhost:4002](http://localhost:4002)   | Handles reads (MongoDB)              |
| **RabbitMQ Management** | [http://localhost:15672](http://localhost:15672) | Default user/pass: `guest` / `guest` |

🧩 Pending Work
| Task                                                 | Status                   |
| ---------------------------------------------------- | ------------------------ |
| API Gateway setup (NestJS + routes)                  | ✅ Done                   |
| Command Service (Write side + PostgreSQL)            | ✅ Done                   |
| Query Service (Read side + MongoDB)                  | ⏳ To Do                  |
| Event publishing (RabbitMQ integration)              | ✅ Done                   |
| Event consumption (Query side)                       | ⏳ To Do                  |
| Docker Compose setup (Postgres + RabbitMQ + MongoDB) | ✅ Basic version done     |
| Full container orchestration                         | ⏳ Pending (Docker issue) |


---

If you want, I can **also fix all table alignments and spacing issues** so it’s perfectly readable on GitHub with **tables looking neat**, even for `.env` variables and setup commands.  


