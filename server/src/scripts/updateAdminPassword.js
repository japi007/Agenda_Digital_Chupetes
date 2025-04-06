import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    const newPassword = 'admin123'; // Use the correct password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('New hash to be stored:', hashedPassword);

    // Bypass the beforeUpdate hook by using a raw query
    await sequelize.query(
      'UPDATE Users SET password = ? WHERE id = ?',
      {
        replacements: [hashedPassword, admin.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Reload the user instance from the database
    await admin.reload();

    console.log('Admin password updated successfully');
    console.log('New hashed password:', hashedPassword);

    // Verify the update
    const updatedAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    console.log('Database stored hash:', updatedAdmin.password);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await sequelize.close();
  }
}

updateAdminPassword();
