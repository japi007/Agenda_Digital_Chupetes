import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';
import Teacher from './Teacher.js';

const StudentFollowUp = sequelize.define('StudentFollowUp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  activities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.ENUM('happy', 'neutral', 'sad'),
    allowNull: true
  },
  sleep: {
    type: DataTypes.ENUM('good', 'fair', 'poor'),
    allowNull: true
  },
  appetite: {
    type: DataTypes.ENUM('good', 'fair', 'poor'),
    allowNull: true
  },
  behavior: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learningProgress: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
StudentFollowUp.belongsTo(Student, { foreignKey: 'studentId' });
StudentFollowUp.belongsTo(Teacher, { foreignKey: 'teacherId' });
Student.hasMany(StudentFollowUp, { foreignKey: 'studentId' });
Teacher.hasMany(StudentFollowUp, { foreignKey: 'teacherId' });

export default StudentFollowUp;
