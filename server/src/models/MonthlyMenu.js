import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

const MonthlyMenu = sequelize.define('MonthlyMenu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileUrl: {
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

// Associations
MonthlyMenu.belongsTo(User, { as: 'uploadedBy', foreignKey: 'uploadedById' });

export default MonthlyMenu;
