import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Redirect to appropriate dashboard based on role
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/profile');
          break;
        case 'teacher':
          navigate('/teacher/profile');
          break;
        case 'parent':
          navigate('/parent/profile');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <div className="text-7xl mb-4">🚫</div>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
