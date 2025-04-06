import express from 'express';
import Parent from '../models/Parent.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all parents
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const parents = await Parent.findAll();
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parents', error: error.message });
  }
});

// Get parent by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (parent) {
      res.json(parent);
    } else {
      res.status(404).json({ message: 'Parent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parent', error: error.message });
  }
});

// Create new parent
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const parent = await Parent.create(req.body);
    res.status(201).json(parent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating parent', error: error.message });
  }
});

// Update parent
router.put('/:id', protect, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (parent) {
      await parent.update(req.body);
      res.json(parent);
    } else {
      res.status(404).json({ message: 'Parent not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating parent', error: error.message });
  }
});

// Delete parent
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (parent) {
      await parent.destroy();
      res.json({ message: 'Parent deleted successfully' });
    } else {
      res.status(404).json({ message: 'Parent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting parent', error: error.message });
  }
});

export default router;
