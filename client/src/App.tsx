import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminProfile from './pages/admin/Profile';
import AdminUsers from './pages/admin/Users';

// Teacher pages
import TeacherProfile from './pages/teacher/Profile';

// Parent pages
import ParentProfile from './pages/parent/Profile';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Dashboard - accessible to all authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'parent']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/profile" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher routes */}
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Parent routes */}
          <Route 
            path="/parent/profile" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
