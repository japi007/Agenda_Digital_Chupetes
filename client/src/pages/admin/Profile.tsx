import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

const AdminProfile: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Photo upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For debugging
  useEffect(() => {
    console.log('Profile user data:', user);
    if (user?.photoUrl) {
      console.log('Photo URL in profile:', user.photoUrl);
    }
  }, [user]);
  
  // Set initial preview URL when component mounts or user changes
  useEffect(() => {
    if (user?.photoUrl) {
      // If it's already a complete URL (starts with http or data:), use it as is
      if (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('data:')) {
        setPreviewUrl(user.photoUrl);
      } else {
        // Otherwise, prepend the backend URL
        setPreviewUrl(`http://localhost:3001${user.photoUrl}`);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [user]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds 20MB limit');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // First update user profile data
      const profileResponse = await axios.put(
        `http://localhost:3001/api/users/${user?.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // If there's a new photo, upload it
      let photoUrl = user?.photoUrl;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);
        
        const photoResponse = await axios.post(
          `http://localhost:3001/api/users/${user?.id}/photo`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        photoUrl = photoResponse.data.photoUrl;
        console.log('New photo URL from server:', photoUrl);
      }
      
      // Update local user state with new data
      if (user) {
        const updatedUser = {
          ...user,
          ...formData,
          photoUrl
        };
        updateUser(updatedUser);
        
        // If it's a new photo, update the preview URL
        if (photoUrl && photoUrl !== user.photoUrl) {
          // If it's already a complete URL (starts with http or data:), use it as is
          if (photoUrl.startsWith('http') || photoUrl.startsWith('data:')) {
            setPreviewUrl(photoUrl);
          } else {
            // Otherwise, prepend the backend URL
            setPreviewUrl(`http://localhost:3001${photoUrl}`);
          }
        }
      }
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      // Send password change request
      await axios.put(
        `http://localhost:3001/api/users/${user?.id}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Password changed successfully');
      setIsChangingPassword(false);
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
    });
    
    // Reset file selection
    setSelectedFile(null);
    
    // Reset preview URL to current user photo
    if (user?.photoUrl) {
      // If it's already a complete URL (starts with http or data:), use it as is
      if (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('data:')) {
        setPreviewUrl(user.photoUrl);
      } else {
        // Otherwise, prepend the backend URL
        setPreviewUrl(`http://localhost:3001${user.photoUrl}`);
      }
    } else {
      setPreviewUrl(null);
    }
    
    // Exit edit mode
    setIsEditing(false);
    setError(null);
  };
  
  const cancelPasswordChange = () => {
    // Reset password form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Exit password change mode
    setIsChangingPassword(false);
    setError(null);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 transition-all duration-300 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>
              
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
                    <div 
                      className="h-32 w-32 rounded-full overflow-hidden mb-4 relative"
                      onClick={isEditing ? triggerFileInput : undefined}
                      style={{ cursor: isEditing ? 'pointer' : 'default' }}
                    >
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt={`${user?.firstName} ${user?.lastName}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-medium">
                          {user?.firstName?.charAt(0) || 'A'}
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                          <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    )}
                    
                    <h2 className="text-xl font-medium">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                    
                    {!isEditing && !isChangingPassword && (
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm"
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3 md:pl-6">
                  {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                              minLength={6}
                            />
                          </div>
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                              minLength={6}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={cancelPasswordChange}
                          className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center"
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          Change Password
                        </button>
                      </div>
                    </form>
                  ) : isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium mb-4">Edit Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                              Username
                            </label>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center"
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">First Name</p>
                            <p className="font-medium">{user?.firstName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Name</p>
                            <p className="font-medium">{user?.lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">{user?.username}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
