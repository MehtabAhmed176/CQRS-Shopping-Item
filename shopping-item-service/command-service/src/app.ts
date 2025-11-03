import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import itemRoutes from '../src/routes/item.routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/command/items', itemRoutes);

export default app;
