import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Parent = sequelize.define('Parent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Parent;
