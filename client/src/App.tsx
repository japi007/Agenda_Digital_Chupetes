import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminProfile from './pages/admin/Profile';
import AdminUsers from './pages/admin/Users';
import AdminStudents from './pages/admin/Students';

// Teacher pages
import TeacherProfile from './pages/teacher/Profile';

// Parent pages
import ParentProfile from './pages/parent/Profile';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={[]}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminProfile />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminUsers />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <AdminStudents />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Teacher routes */}
          <Route path="/teacher/profile" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <MainLayout>
                <TeacherProfile />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/students" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <MainLayout>
                <AdminStudents />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Parent routes */}
          <Route path="/parent/profile" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <MainLayout>
                <ParentProfile />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
