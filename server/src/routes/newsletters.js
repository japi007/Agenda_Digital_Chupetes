import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all newsletters
router.get('/', protect, async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching newsletters', error: error.message });
  }
});

// Get newsletter by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByPk(req.params.id);
    if (newsletter) {
      res.json(newsletter);
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching newsletter', error: error.message });
  }
});

// Create new newsletter
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const newsletter = await Newsletter.create({ ...req.body, authorId: req.user.id });
    res.status(201).json(newsletter);
  } catch (error) {
    res.status(400).json({ message: 'Error creating newsletter', error: error.message });
  }
});

// Update newsletter
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne({ where: { id: req.params.id, authorId: req.user.id } });
    if (newsletter) {
      await newsletter.update(req.body);
      res.json(newsletter);
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating newsletter', error: error.message });
  }
});

// Delete newsletter
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const newsletter = await Newsletter.findByPk(req.params.id);
    if (newsletter) {
      await newsletter.destroy();
      res.json({ message: 'Newsletter deleted successfully' });
    } else {
      res.status(404).json({ message: 'Newsletter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting newsletter', error: error.message });
  }
});

export default router;
