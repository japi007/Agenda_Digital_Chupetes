import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Authorization = sequelize.define('Authorization', {
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
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  responseNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Parents',
      key: 'id'
    }
  },
  requestedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  respondedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Authorization;
