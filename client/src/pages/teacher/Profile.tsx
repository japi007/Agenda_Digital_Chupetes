import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const TeacherProfile: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  
  // Selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) {
      setError('User session not found');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update user profile data
      const response = await axios.put(
        `http://localhost:3001/api/users/${user.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // If we have a file to upload, do that in a separate request
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append('photo', selectedFile);
        
        const photoResponse = await axios.post(
          `http://localhost:3001/api/users/${user.id}/photo`,
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Update the user data with the new photo URL
        response.data.user.photoUrl = photoResponse.data.photoUrl;
      }
      
      // Update the user in context
      updateUser(response.data.user);
      
      setSuccess('Perfil actualizado con éxito');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al actualizar el perfil');
      } else {
        setError('Error al actualizar el perfil. Por favor, inténtelo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Perfil del Profesor</h1>
      
      {/* Success message */}
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row">
        {/* Profile Photo Section - Full width on mobile, 1/3 on larger screens */}
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <div className="flex justify-center">
            {user?.photoUrl ? (
              <img 
                src={`http://localhost:3001${user.photoUrl}`} 
                alt="Profile" 
                className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full object-cover border-4 border-indigo-200"
              />
            ) : (
              <div className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-3xl sm:text-4xl border-4 border-indigo-200">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Mobile-only edit button */}
          <div className="flex justify-center mt-4 lg:hidden">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded text-sm w-full max-w-xs"
              disabled={loading}
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
        </div>
        
        {/* Profile Info Section - Full width on mobile, 2/3 on larger screens */}
        <div className="w-full lg:w-2/3 lg:pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-500">Nombre</h2>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-500">Email</h2>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900 break-words">{user?.email}</p>
            </div>
            
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-500">Nombre de Usuario</h2>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">{user?.username}</p>
            </div>
            
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-500">Rol</h2>
              <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900 capitalize">
                {user?.role === 'teacher' ? 'Profesor' : user?.role}
              </p>
            </div>
          </div>
          
          {/* Desktop edit button - hidden on mobile */}
          <div className="hidden lg:block mt-8">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
              disabled={loading}
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Edit Form - Show when editing */}
      {isEditing && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Editar Información</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
