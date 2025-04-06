import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  photoUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      // Save to state
      setUser(user);
      setToken(token);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      return user;
    } catch (err) {
      console.error('Login error:', err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Add function to update user data
  const updateUser = (userData: User) => {
    // Create a new user object to ensure all properties are included
    const updatedUser = {
      ...userData,
      photoUrl: userData.photoUrl || null
    };
    
    // Update state
    setUser(updatedUser);
    
    // Update localStorage with the complete user object
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Log the updated user for debugging
    console.log('Updated user in context:', updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
