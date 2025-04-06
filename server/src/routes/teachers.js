import express from 'express';
import Teacher from '../models/Teacher.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all teachers
router.get('/', protect, async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
});

// Get teacher by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
});

// Create new teacher
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error creating teacher', error: error.message });
  }
});

// Update teacher
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (teacher) {
      await teacher.update(req.body);
      res.json(teacher);
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating teacher', error: error.message });
  }
});

// Delete teacher
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (teacher) {
      await teacher.destroy();
      res.json({ message: 'Teacher deleted successfully' });
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
});

export default router;
