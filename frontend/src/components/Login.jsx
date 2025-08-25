import React, { useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import img1 from '../assets/image1.avif'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type') || 'student';
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAdminLogin = loginType === 'admin';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Get user info to determine role
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/me');
        const userRole = response.data.user.role;
        
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } catch (error) {
        console.error('Failed to get user info:', error);
        // Default to user dashboard
        navigate('/user/dashboard');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div
      className={`h-screen w-screen flex-wrap  font-serif overflow-hidden bg-gradient-to-br ${isAdminLogin ? 'from-purple-100 to-white' : 'from-pink-50 to-white'} flex flex-row items-stretch justify-evenly px-0 relative`}
    style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
    >
      {/* Background image on the left half */}
      <div
        className="absolute left-0 top-0 h-full w-1/2 z-0"
        
        aria-hidden="true"
      />
      {/* Overlay for possible dimming or color effect (optional) */}
      {/* <div className="absolute left-0 top-0 h-full w-1/2 z-10 bg-black/20" /> */}

      {/* Content */}
      <div className="relative z-10 flex flex-1">
        <div className="flex-1" />
        <div className="max-w-md w-full bg-gray-50 shadow-xl p-8 h-full overflow-y-auto">
          <div className="text-center mb-8">
            {/* <div className={`w-16 h-16 ${isAdminLogin ? 'bg-purple-100' : 'bg-pink-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {/* <span className="text-2xl">
              {isAdminLogin ? '🔐' : '👤'}
            </span> 
          </div> */}
            <h2 className="text-3xl font-bold text-gray-800">
              {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isAdminLogin ? 'Access administrative dashboard' : 'Sign in to your account'}
            </p>
          </div>

          {/* Login Type Indicator */}
          <div className={`mb-6 p-3  ${isAdminLogin ? 'bg-purple-50 border border-purple-200' : 'bg-pink-50 border border-pink-200'}`}>
            <p className={`text-sm font-medium ${isAdminLogin ? 'text-purple-700' : 'text-pink-700'}`}>
              {isAdminLogin ? 'Administrator Login' : 'Student Login'}
            </p>
            {isAdminLogin && (
              <p className="text-xs text-black mt-1 bg-white">
                Use your admin credentials: admin@katalyst.org
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 focus:ring-2 ${isAdminLogin ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-pink-500 focus:border-pink-500'} outline-none transition-colors`}
                placeholder={isAdminLogin ? "admin@katalyst.org" : "Enter your email"}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 focus:ring-2 ${isAdminLogin ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-pink-500 focus:border-pink-500'} outline-none transition-colors`}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${isAdminLogin ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-200' : 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-200'} text-white py-3 px-4 rounded-lg font-semibold focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? 'Signing In...' : `Sign In ${isAdminLogin ? 'as Admin' : ''}`}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            {isAdminLogin ? (
              <div className="text-xs text-gray-600">
                <p><strong>Admin:</strong> admin@katalyst.org / admin123</p>
              </div>
            ) : (
              <div className="text-xs text-gray-600">
                <p><strong>Student:</strong> student@example.com / student123</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            {!isAdminLogin && (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-pink-600 hover:text-pink-500 font-medium">
                  Sign up
                </Link>
                <br />
                <Link 
                  to="/login?type=admin" 
                  className="text-purple-600 hover:text-purple-500 font-medium inline-block mt-2"
                >
                  Admin Login →
                </Link>
              </>
            )}
            {isAdminLogin && (
              <Link 
                to="/login?type=student" 
                className="text-pink-600 hover:text-pink-500 font-medium"
              >
                ← Student Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
