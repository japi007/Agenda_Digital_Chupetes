import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
Document.belongsTo(User, { as: 'uploadedBy', foreignKey: 'uploadedById' });

export default Document;
