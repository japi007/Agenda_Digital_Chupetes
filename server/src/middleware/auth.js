import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('Headers:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from header:', token);
  }

  if (!token) {
    console.log('No token found');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Decoded token:', decoded);

    // Use userId from decoded token
    req.user = await User.findByPk(decoded.userId);
    console.log('User found:', req.user ? 'Yes' : 'No');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
