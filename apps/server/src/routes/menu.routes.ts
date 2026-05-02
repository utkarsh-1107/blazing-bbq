import { Router, Request, Response } from 'express';
import { menuService } from '../services/menu.service';

const router = Router();

// GET /menu - Get all categories with items
router.get('/', async (req: Request, res: Response) => {
  try {
    const menu = await menuService.getMenu();
    res.json({ success: true, data: menu });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /menu/categories - Get categories only
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await menuService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /menu/items/:slug - Get single item
router.get('/items/:slug', async (req: Request, res: Response) => {
  try {
    const item = await menuService.getItem(req.params.slug);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
