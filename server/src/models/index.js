import User from './User.js';
import Student from './Student.js';
import Parent from './Parent.js';
import Classroom from './Classroom.js';
import Authorization from './Authorization.js';
import Newsletter from './Newsletter.js';
import Notification from './Notification.js';

// Define associations
User.hasOne(Parent, { foreignKey: 'userId' });
Parent.belongsTo(User, { foreignKey: 'userId' });

Student.belongsTo(Classroom, { foreignKey: 'classroomId' });
Classroom.hasMany(Student, { foreignKey: 'classroomId' });

Authorization.belongsTo(Student, { foreignKey: 'studentId' });
Authorization.belongsTo(Parent, { foreignKey: 'parentId' });
Authorization.belongsTo(User, { as: 'requestedBy', foreignKey: 'requestedById' });
Authorization.belongsTo(User, { as: 'respondedBy', foreignKey: 'respondedById' });

Newsletter.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Newsletter, { as: 'authoredNewsletters', foreignKey: 'authorId' });

// Update Notification associations
Notification.belongsTo(User, { as: 'notificationSender', foreignKey: 'senderId' });
Notification.belongsTo(User, { as: 'notificationRecipient', foreignKey: 'recipientId' });
User.hasMany(Notification, { as: 'sentNotifications', foreignKey: 'senderId' });
User.hasMany(Notification, { as: 'receivedNotifications', foreignKey: 'recipientId' });

export {
  User,
  Student,
  Parent,
  Classroom,
  Authorization,
  Newsletter,
  Notification
};
