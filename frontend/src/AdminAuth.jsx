import React, { useState } from 'react';
import './AdminAuth.css';

export default function AdminAuth({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
  
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      onLogin(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  return (
    <div className="admin-auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🔐 Admin Authentication</h1>
          <p>Enter your credentials to access the Katalyst Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button type="submit" className="auth-btn">
            Login to Admin Panel
          </button>
        </form>
        
        <div className="auth-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>katalyst2024</code></p>
        </div>
      </div>
    </div>
  );
}
