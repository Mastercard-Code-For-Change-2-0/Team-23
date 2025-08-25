// Backend Configuration for Katalyst System
const config = {
  // Development backend URL
  development: {
    baseURL: 'http://localhost:3000',
    apiVersion: 'v1',
    endpoints: {
      auth: {
        login: '/api/v1/auth/login',
        signup: '/api/v1/auth/signup',
        logout: '/api/v1/auth/logout',
        google: '/api/v1/auth/google',
        refresh: '/api/v1/auth/refresh'
      },
      events: {
        list: '/api/v1/events',
        create: '/api/v1/events',
        update: '/api/v1/events/:id',
        delete: '/api/v1/events/:id',
        register: '/api/v1/events/:id/register'
      },
      students: {
        list: '/api/v1/students',
        create: '/api/v1/students',
        update: '/api/v1/students/:id',
        delete: '/api/v1/students/:id',
        track: '/api/v1/students/track/:trackingId'
      },
      analytics: {
        dashboard: '/api/v1/analytics/dashboard',
        events: '/api/v1/analytics/events',
        conversions: '/api/v1/analytics/conversions',
        export: '/api/v1/analytics/export'
      }
    }
  },
  
  // Production backend URL (update when deploying)
  production: {
    baseURL: 'https://your-production-backend.com',
    apiVersion: 'v1',
    endpoints: {
      auth: {
        login: '/api/v1/auth/login',
        signup: '/api/v1/auth/signup',
        logout: '/api/v1/auth/logout',
        google: '/api/v1/auth/google',
        refresh: '/api/v1/auth/refresh'
      },
      events: {
        list: '/api/v1/events',
        create: '/api/v1/events',
        update: '/api/v1/events/:id',
        delete: '/api/v1/events/:id',
        register: '/api/v1/events/:id/register'
      },
      students: {
        list: '/api/v1/students',
        create: '/api/v1/students',
        update: '/api/v1/students/:id',
        delete: '/api/v1/students/:id',
        track: '/api/v1/students/track/:trackingId'
      },
      analytics: {
        dashboard: '/api/v1/analytics/dashboard',
        events: '/api/v1/analytics/events',
        conversions: '/api/v1/analytics/conversions',
        export: '/api/v1/analytics/export'
      }
    }
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export current config
export const backendConfig = config[environment];

// Helper function to build full API URLs
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${backendConfig.baseURL}${endpoint}`;
  
  // Replace URL parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Default axios configuration
export const axiosConfig = {
  baseURL: backendConfig.baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
};

export default backendConfig;
