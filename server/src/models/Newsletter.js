import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Newsletter = sequelize.define('Newsletter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachments: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('attachments');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('attachments', JSON.stringify(value));
    }
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Newsletter;
