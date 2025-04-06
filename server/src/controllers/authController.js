// Add this file if it doesn't exist yet
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;
    
    // Check if username already exists (since we removed the unique constraint)
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role
    });
    
    // Don't send password in response
    const userData = { ...user.get(), password: undefined };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token with userId instead of id
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    // Don't send password in response
    const userData = { ...user.get(), password: undefined };
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't send password in response
    const userData = { ...user.get(), password: undefined };
    
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error getting user data', error: error.message });
  }
};
