import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads/profile-photos');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user by ID
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is requesting their own data or is an admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this user data' });
    }
    
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is updating their own data or is an admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Extract fields to update
    const { firstName, lastName, email, username } = req.body;
    
    // Check if username is being changed and already exists
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    
    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    
    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      username: username || user.username
    });
    
    // Return updated user without password
    const userData = { ...user.get(), password: undefined };
    
    res.status(200).json({
      message: 'User updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Change password
router.put('/:id/password', protect, async (req, res) => {
  try {
    // Check if user is updating their own password or is an admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change this user\'s password' });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const isMatch = await user.checkPassword(currentPassword);
    if (!isMatch){
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Upload profile photo
router.post('/:id/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    // Check if user is updating their own photo or is an admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user\'s photo' });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Delete old photo if exists
    if (user.photoUrl && !user.photoUrl.startsWith('http') && !user.photoUrl.startsWith('data:')) {
      const oldPhotoPath = path.join(process.cwd(), user.photoUrl);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    
    // Update user with new photo URL
    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    await user.update({ photoUrl });
    
    res.status(200).json({
      message: 'Photo uploaded successfully',
      photoUrl
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    // Delete user's photo if exists
    if (user.photoUrl && !user.photoUrl.startsWith('http') && !user.photoUrl.startsWith('data:')) {
      const photoPath = path.join(process.cwd(), user.photoUrl);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

export default router;
