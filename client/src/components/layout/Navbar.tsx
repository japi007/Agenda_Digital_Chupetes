import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  // Function to get the correct photo URL
  const getPhotoUrl = (photoUrl: string | null | undefined): string => {
    if (!photoUrl) return '';
    
    // If the URL already starts with http/https, it's an external URL
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // Otherwise, it's a local path that needs to be prefixed with the API URL
    return `http://localhost:3001${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
  };
  
  return (
    <nav className="bg-indigo-600 fixed w-full z-50 top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none mr-4 p-2 rounded hover:bg-indigo-700"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                Agenda Chupetes
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* User name display */}
            <div className="text-white text-sm mr-3 hidden md:block">
              {user?.firstName} {user?.lastName}
            </div>
            
            {/* Profile photo */}
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {user?.photoUrl ? (
                <img 
                  src={getPhotoUrl(user.photoUrl)} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-700 text-white">
                  {user?.firstName?.charAt(0) || ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
