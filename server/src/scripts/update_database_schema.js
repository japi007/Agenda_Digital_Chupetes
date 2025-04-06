import { sequelize } from '../config/database.js';
import '../models/index.js';

const updateDatabaseSchema = async () => {
  try {
    console.log('Starting database schema update...');
    
    // Changed from alter:true to force:false to prevent automatic schema changes
    // that might exceed MySQL's key limit
    await sequelize.sync({ force: false });
    
    console.log('Database schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  }
};

updateDatabaseSchema();
