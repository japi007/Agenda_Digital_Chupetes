import express from 'express';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Get student by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// Create new student
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
});

// Update student
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      await student.update(req.body);
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
});

// Delete student
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      await student.destroy();
      res.json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

export default router;
