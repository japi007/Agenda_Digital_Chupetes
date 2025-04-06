import express from 'express';
import { sequelize } from '../config/database.js';
import { DataTypes } from 'sequelize';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Define Classroom model if not already defined
const Classroom = sequelize.define('Classroom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ageGroup: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Get all classrooms
router.get('/', protect, async (req, res) => {
  try {
    const classrooms = await Classroom.findAll();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms', error: error.message });
  }
});

// Get classroom by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (classroom) {
      res.json(classroom);
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error: error.message });
  }
});

// Create new classroom
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: 'Error creating classroom', error: error.message });
  }
});

// Update classroom
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (classroom) {
      await classroom.update(req.body);
      res.json(classroom);
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating classroom', error: error.message });
  }
});

// Delete classroom
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const classroom = await Classroom.findByPk(req.params.id);
    if (classroom) {
      await classroom.destroy();
      res.json({ message: 'Classroom deleted successfully' });
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
});

export default router;
