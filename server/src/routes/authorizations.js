import express from 'express';
import Authorization from '../models/Authorization.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all authorizations
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const authorizations = await Authorization.findAll();
    res.json(authorizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authorizations', error: error.message });
  }
});

// Get authorization by ID
router.get('/:id', protect, authorize('admin', 'teacher', 'parent'), async (req, res) => {
  try {
    const authorization = await Authorization.findByPk(req.params.id);
    if (authorization) {
      res.json(authorization);
    } else {
      res.status(404).json({ message: 'Authorization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authorization', error: error.message });
  }
});

// Create new authorization
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const authorization = await Authorization.create(req.body);
    res.status(201).json(authorization);
  } catch (error) {
    res.status(400).json({ message: 'Error creating authorization', error: error.message });
  }
});

// Update authorization
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const authorization = await Authorization.findByPk(req.params.id);
    if (authorization) {
      await authorization.update(req.body);
      res.json(authorization);
    } else {
      res.status(404).json({ message: 'Authorization not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating authorization', error: error.message });
  }
});

// Delete authorization
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const authorization = await Authorization.findByPk(req.params.id);
    if (authorization) {
      await authorization.destroy();
      res.json({ message: 'Authorization deleted successfully' });
    } else {
      res.status(404).json({ message: 'Authorization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting authorization', error: error.message });
  }
});

export default router;
