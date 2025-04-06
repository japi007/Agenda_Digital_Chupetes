import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { User } from '../../types';
import axios from 'axios';

const Users: React.FC = () => {
  const { user, token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Photo states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'parent',
    password: '',
    confirmPassword: ''
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.users);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear photo selection
  const clearPhotoSelection = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get full API URL for photo
  const getPhotoUrl = (photoPath: string | null | undefined) => {
    if (!photoPath) return null;
    
    // If it's already a full URL or data URL, return as is
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) {
      return photoPath;
    }
    
    // Otherwise, prepend the API URL
    return `${import.meta.env.VITE_API_URL}${photoPath}`;
  };

  // Open modal for creating a new user
  const openCreateModal = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'parent',
      password: '',
      confirmPassword: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setModalMode('create');
    setShowModal(true);
  };

  // Open modal for editing a user
  const openEditModal = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setPhotoFile(null);
    
    // Set photo preview with the correct URL format
    if (user.photoUrl) {
      setPhotoPreview(getPhotoUrl(user.photoUrl));
    } else {
      setPhotoPreview(null);
    }
    
    setCurrentUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setError(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Upload photo for a user
  const uploadPhoto = async (userId: number): Promise<string | null> => {
    if (!photoFile) return null;
    
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data.photoUrl;
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      throw new Error(err.response?.data?.message || 'Error uploading photo');
    }
  };

  // Create a new user
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      // First create the user
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          password: formData.password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const newUser = response.data.user;
      
      // If there's a photo, upload it
      if (photoFile && newUser.id) {
        try {
          await uploadPhoto(newUser.id);
        } catch (photoErr) {
          console.error('Photo upload failed, but user was created:', photoErr);
          // We don't want to block user creation if photo upload fails
        }
      }
      
      // Refresh user list
      fetchUsers();
      closeModal();
      
      // Show success message
      alert('User created successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating user');
      console.error('Error creating user:', err);
    }
  };

  // Update an existing user
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      // First, update basic user details
      const userData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // If there's a new photo, upload it
      if (photoFile) {
        try {
          await uploadPhoto(currentUser.id);
        } catch (photoErr) {
          console.error('Photo upload failed, but user was updated:', photoErr);
          // We don't want to block user update if photo upload fails
        }
      }
      
      // If password is being changed
      if (formData.password && formData.password.trim() !== '') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        
        // For admin users, we'll bypass the current password check
        const passwordData = user?.role === 'admin' 
          ? { 
              newPassword: formData.password,
              // Admin bypass - this should be handled securely in a real app
              currentPassword: 'admin-bypass' 
            }
          : {
              newPassword: formData.password,
              currentPassword: prompt('Please enter your current password to confirm') || ''
            };
        
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}/password`,
          passwordData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      // Refresh user list
      fetchUsers();
      closeModal();
      
      // Show success message
      alert('User updated successfully');
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Error updating user');
    }
  };

  // Delete a user
  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh user list
      fetchUsers();
      
      // Show success message
      alert('User deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting user');
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 transition-all duration-300 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <button 
                  onClick={openCreateModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Añadir Nuevo Usuario
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Foto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.photoUrl ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={getPhotoUrl(user.photoUrl)} 
                                  alt={`${user.firstName} ${user.lastName}`} 
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {user.role === 'admin' ? 'Administrador' : 
                               user.role === 'teacher' ? 'Profesor' : 'Padre/Madre'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => openEditModal(user)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={modalMode === 'create' ? createUser : updateUser}>
              {/* Photo Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Foto de Perfil
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-20 w-20 relative">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </div>
                    )}
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={clearPhotoSelection}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded text-sm"
                    >
                      {photoPreview ? 'Cambiar Foto' : 'Subir Foto'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG o GIF. Máximo 20MB.</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="teacher">Profesor</option>
                  <option value="parent">Padre/Madre</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  {modalMode === 'create' ? 'Contraseña' : 'Nueva Contraseña (dejar en blanco para mantener la actual)'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={modalMode === 'create'}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={modalMode === 'create' || formData.password !== ''}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {modalMode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
