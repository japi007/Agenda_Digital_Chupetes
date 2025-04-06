import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  classroomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classrooms',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Student;
