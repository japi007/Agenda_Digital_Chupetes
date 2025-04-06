import React from 'react';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Teacher Profile</h1>
      
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
          <h2 className="text-xl font-semibold text-gray-700">Teacher Dashboard</h2>
          <p className="mt-2 text-gray-600">
            As a teacher, you can manage your classroom, students, and communicate with parents.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700">Student Management</h3>
              <p className="mt-1 text-sm text-blue-500">View and manage your students</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-700">Parent Communication</h3>
              <p className="mt-1 text-sm text-green-500">Send messages and updates to parents</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700">Classroom Activities</h3>
              <p className="mt-1 text-sm text-purple-500">Plan and track classroom activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
