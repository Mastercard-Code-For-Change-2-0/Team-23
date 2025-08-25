import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, isAdmin, logout } from './utils/auth';
import './Navbar.css';

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      const currentUser = getCurrentUser();
      const adminStatus = isAdmin();
      
      setIsAuth(authStatus);
      setUser(currentUser);
      setIsAdminUser(adminStatus);
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = async () => {
    await logout(navigate);
    setIsAuth(false);
    setUser(null);
    setIsAdminUser(false);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          🚀 Katalyst
        </Link>
      </div>
      
      <nav className="navbar__links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'navlink navlink--active' : 'navlink'}>
          Home
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => isActive ? 'navlink navlink--active' : 'navlink'}>
          Events
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? 'navlink navlink--active' : 'navlink'}>
          Register
        </NavLink>
        <NavLink to="/track" className={({ isActive }) => isActive ? 'navlink navlink--active' : 'navlink'}>
          Track Application
        </NavLink>
        
        {/* Admin Link - Only show if user is admin */}
        {isAdminUser && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'navlink navlink--active' : 'navlink'}>
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="navbar__auth">
        {isAuth ? (
          <div className="auth-user">
            <span className="user-greeting">
              Welcome, {user?.username || user?.email || 'User'}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/signin" className="navlink signin-btn">
              Sign In
            </Link>
            <Link to="/signup" className="navlink signup-btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}