import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ParentProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Parent Profile</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <div className="mt-1 text-gray-900">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-gray-900">{user.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Username</label>
              <div className="mt-1 text-gray-900">{user.username}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <div className="mt-1 text-gray-900 capitalize">{user.role}</div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Parent Dashboard</h2>
          <p className="mt-2 text-gray-600">
            As a parent, you can view your child's information, communicate with teachers, and stay updated on school activities.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700">Child Information</h3>
              <p className="mt-1 text-sm text-blue-500">View your child's profile and progress</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-700">Teacher Communication</h3>
              <p className="mt-1 text-sm text-green-500">Message your child's teachers</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700">School Updates</h3>
              <p className="mt-1 text-sm text-purple-500">Stay informed about school events and announcements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
