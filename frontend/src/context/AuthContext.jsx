import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:3000/api/v1';
    axios.defaults.withCredentials = true;
  }, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me');
          if (response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post('/auth/signup', { username, email, password });
      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove('token');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server request fails
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove('token');
      return { success: false };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
