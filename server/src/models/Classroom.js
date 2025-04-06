import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20
  },
  ageGroup: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Classroom;
