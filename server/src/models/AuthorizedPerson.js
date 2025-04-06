import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Student from './Student.js';

const AuthorizedPerson = sequelize.define('AuthorizedPerson', {
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
  relationship: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  identificationNumber: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
AuthorizedPerson.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(AuthorizedPerson, { foreignKey: 'studentId' });

export default AuthorizedPerson;
