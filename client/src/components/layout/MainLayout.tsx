import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'parent';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close sidebar automatically when switching to mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log("MainLayout: No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(`MainLayout: User role ${user.role} doesn't match required role ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 p-6 transition-all duration-300 ${isMobile ? 'w-full' : 'md:ml-64'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
