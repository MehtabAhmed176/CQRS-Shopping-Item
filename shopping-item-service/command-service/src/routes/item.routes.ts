import express from 'express';
import { createItemHandler } from '../handlers/item.handler';
import { updateItemHandler } from '../handlers/item-update.handler'
import { deleteItemHandler } from '../handlers/item-delete.handler';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("req.body:", req.body)
  try {
    const item = await createItemHandler(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT — Update Item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('req.body:', req.body);

  try {
    const item = await updateItemHandler(id, req.body);
    console.log("item updateItemHandler-->", item)
    res.status(200).json(item);
  } catch (err: any) {
    console.error(err);
    if (err.message?.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE — Remove Item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ DELETE /api/command/items/${id}`);

  try {
    const item = await deleteItemHandler(id);
    res.status(200).json(item);
  } catch (err: any) {
    console.error(err);
    if (err.message?.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to delete item' });
  }
});



export default router;
