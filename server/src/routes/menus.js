import express from 'express';
import MonthlyMenu from '../models/MonthlyMenu.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all menus
router.get('/', protect, async (req, res) => {
  try {
    const menus = await MonthlyMenu.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
});

// Get menu by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const menu = await MonthlyMenu.findByPk(req.params.id);
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
});

// Create new menu
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const menu = await MonthlyMenu.create(req.body);
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu', error: error.message });
  }
});

// Update menu
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const menu = await MonthlyMenu.findByPk(req.params.id);
    if (menu) {
      await menu.update(req.body);
      res.json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating menu', error: error.message });
  }
});

// Delete menu
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menu = await MonthlyMenu.findByPk(req.params.id);
    if (menu) {
      await menu.destroy();
      res.json({ message: 'Menu deleted successfully' });
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
});

export default router;
