import express from 'express';
import { createItemHandler } from '../handlers/item.handler';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const item = await createItemHandler(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

export default router;
