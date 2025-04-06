import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Classroom from './Classroom.js';

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
Teacher.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Teacher.belongsTo(Classroom, { foreignKey: 'classroomId' });
Classroom.hasMany(Teacher, { foreignKey: 'classroomId' });

export default Teacher;
