import { sequelize } from '../config/database.js';
import User from '../models/User.js';

async function checkAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (admin) {
      console.log('Admin user found');
      console.log('Stored hashed password:', admin.password);
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkAdminPassword();
