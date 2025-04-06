import express from 'express';
import Document from '../models/Document.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all documents
router.get('/', protect, async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
});

// Get document by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
});

// Create new document
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const document = await Document.create({ ...req.body, uploaderId: req.user.id });
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: 'Error creating document', error: error.message });
  }
});

// Update document
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const document = await Document.findOne({ where: { id: req.params.id, uploaderId: req.user.id } });
    if (document) {
      await document.update(req.body);
      res.json(document);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating document', error: error.message });
  }
});

// Delete document
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (document) {
      await document.destroy();
      res.json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
});

export default router;
