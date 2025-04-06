import express from 'express';
import StudentFollowUp from '../models/StudentFollowUp.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all follow-ups
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const followUps = await StudentFollowUp.findAll();
    res.json(followUps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow-ups', error: error.message });
  }
});

// Get follow-up by ID
router.get('/:id', protect, authorize('admin', 'teacher', 'parent'), async (req, res) => {
  try {
    const followUp = await StudentFollowUp.findByPk(req.params.id);
    if (followUp) {
      res.json(followUp);
    } else {
      res.status(404).json({ message: 'Follow-up not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follow-up', error: error.message });
  }
});

// Create new follow-up
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const followUp = await StudentFollowUp.create({ ...req.body, teacherId: req.user.id });
    res.status(201).json(followUp);
  } catch (error) {
    res.status(400).json({ message: 'Error creating follow-up', error: error.message });
  }
});

// Update follow-up
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const followUp = await StudentFollowUp.findOne({ where: { id: req.params.id, teacherId: req.user.id } });
    if (followUp) {
      await followUp.update(req.body);
      res.json(followUp);
    } else {
      res.status(404).json({ message: 'Follow-up not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating follow-up', error: error.message });
  }
});

// Delete follow-up
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const followUp = await StudentFollowUp.findByPk(req.params.id);
    if (followUp) {
      await followUp.destroy();
      res.json({ message: 'Follow-up deleted successfully' });
    } else {
      res.status(404).json({ message: 'Follow-up not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting follow-up', error: error.message });
  }
});

export default router;
