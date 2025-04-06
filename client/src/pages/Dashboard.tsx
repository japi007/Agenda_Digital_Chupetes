import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 transition-all duration-300 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Home</h1>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Bienvenido a Agenda Chupetes, {user?.firstName}! Has iniciado sesión como <span className="font-medium">{user?.role}</span>.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick access cards */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mi Perfil</h3>
                  <p className="text-gray-500 mb-4">Ver y editar tu información personal</p>
                  <a href={`/${user?.role}/profile`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Ir a Mi Perfil →
                  </a>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Administrar Usuarios</h3>
                    <p className="text-gray-500 mb-4">Gestionar usuarios, roles y permisos</p>
                    <a href="/admin/users" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Administrar Usuarios →
                    </a>
                  </div>
                )}
                
                {user?.role === 'teacher' && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Mi Aula</h3>
                    <p className="text-gray-500 mb-4">Gestionar tu aula y estudiantes</p>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Ir a Mi Aula →
                    </a>
                  </div>
                )}
                
                {user?.role === 'parent' && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Mis Hijos</h3>
                    <p className="text-gray-500 mb-4">Ver información sobre tus hijos</p>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Ver Mis Hijos →
                    </a>
                  </div>
                )}
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notificaciones</h3>
                  <p className="text-gray-500 mb-4">Ver tus notificaciones recientes</p>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Ver Notificaciones →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
