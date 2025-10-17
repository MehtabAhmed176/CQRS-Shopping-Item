



```text
shopping-item-service/
│
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── items.command.routes.ts   # Routes for commands
│   │   │   └── items.query.routes.ts     # Routes for queries
│   │   ├── controllers/
│   │   │   ├── command.controller.ts
│   │   │   └── query.controller.ts
│   │   └── index.ts                      # Express/NestJS app entry
│   └── package.json
│
├── command-service/
│   ├── src/
│   │   ├── commands/                     # Command objects (CreateItem, UpdateItem)
│   │   ├── handlers/                     # Command handlers
│   │   │   └── item.handler.ts
│   │   ├── events/                       # Domain events (ItemCreated, ItemUpdated)
│   │   ├── models/                        # PostgreSQL models (TypeORM/Sequelize)
│   │   ├── repositories/                 # DB access layer
│   │   └── index.ts                       # App entry
│   └── package.json
│
├── query-service/
│   ├── src/
│   │   ├── events/                       # Event consumers (ItemCreated, ItemUpdated)
│   │   ├── handlers/                     # Event handlers for read model
│   │   ├── models/                        # MongoDB models
│   │   ├── repositories/                 # Query DB access
│   │   └── index.ts                       # App entry
│   └── package.json
│
└── docker-compose.yml                     # Run all services + RabbitMQ + DBs
