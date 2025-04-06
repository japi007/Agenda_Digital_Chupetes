import express from 'express';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id } });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Get notification by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification', error: error.message });
  }
});

// Create new notification
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const notification = await Notification.create({ ...req.body, senderId: req.user.id });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Error creating notification', error: error.message });
  }
});

// Update notification
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, senderId: req.user.id } });
    if (notification) {
      await notification.update(req.body);
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification', error: error.message });
  }
});

// Delete notification
router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, senderId: req.user.id } });
    if (notification) {
      await notification.destroy();
      res.json({ message: 'Notification deleted successfully' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
});

export default router;
