-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS kindergarten_agenda;
USE kindergarten_agenda;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Newsletters;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Users;

-- Create Users table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'parent') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  photoUrl VARCHAR(255) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Notifications table
CREATE TABLE Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  type ENUM('general', 'personal', 'announcement') DEFAULT 'personal',
  senderId INT NOT NULL,
  recipientId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipientId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Newsletters table
CREATE TABLE Newsletters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT,
  publishedAt DATETIME,
  status ENUM('draft', 'published') DEFAULT 'draft',
  authorId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Insert sample data for testing

-- Insert admin user
INSERT INTO Users (username, email, password, firstName, lastName, role) 
VALUES ('admin', 'admin@example.com', '$2a$10$ij3DjrFJaEzUoICRdaFp3.QRasXJlGlpRlIXkGGtBn77K5kdjuOSa', 'Admin', 'User', 'admin');
-- Password: admin123

-- Insert teacher user
INSERT INTO Users (username, email, password, firstName, lastName, role) 
VALUES ('teacher1', 'teacher1@example.com', '$2a$10$ij3DjrFJaEzUoICRdaFp3.QRasXJlGlpRlIXkGGtBn77K5kdjuOSa', 'John', 'Doe', 'teacher');

-- Insert parent user
INSERT INTO Users (username, email, password, firstName, lastName, role) 
VALUES ('parent1', 'parent1@example.com', '$2a$10$ij3DjrFJaEzUoICRdaFp3.QRasXJlGlpRlIXkGGtBn77K5kdjuOSa', 'Robert', 'Johnson', 'parent');

-- Insert notifications
INSERT INTO Notifications (title, content, senderId, recipientId) 
VALUES ('Welcome to Kindergarten', 'Welcome to our kindergarten! We are excited to have you join our community.', 1, 3);

INSERT INTO Notifications (title, content, type, senderId, recipientId) 
VALUES ('School Closure', 'The school will be closed on Monday due to maintenance.', 'announcement', 1, 2);

-- Insert newsletter
INSERT INTO Newsletters (title, content, authorId, status)
VALUES ('Monthly Update', 'This is our monthly newsletter with updates on school activities.', 1, 'published');
