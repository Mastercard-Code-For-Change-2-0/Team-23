import axios from 'axios';
import { Navigate } from 'react-router-dom';

export const isAuthenticated = () => {
  const authStatus = localStorage.getItem('isAuthenticated');
  const userData = localStorage.getItem('user');
  return authStatus === 'true' && userData !== null;
};


export const getCurrentUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Invalid user data in localStorage. Clearing it.');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isStudent = () => {
  const user = getCurrentUser();
  return user && user.role === 'student';
};

export const logout = async (navigate) => {
  try {
    await axios.post("http://localhost:3000/api/v1/auth/logout", {}, {
      withCredentials: true
    });
  } catch (error) {
    console.log('Logout API call failed, but continuing with local logout');
  }

  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');

  if (navigate) {
    navigate('/');
  }
  
  return true;
};

export const getAuthHeaders = () => {
  const user = getCurrentUser();
  return {
    'Content-Type': 'application/json',
    'Authorization': user ? `Bearer ${user.token}` : '',
  };
};

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};


