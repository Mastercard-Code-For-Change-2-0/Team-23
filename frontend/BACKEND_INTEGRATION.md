# 🔧 Backend Integration Guide for Katalyst System

This guide explains how to integrate the Katalyst frontend with a backend server and MongoDB database.

## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hashed with bcrypt
  role: String, // 'admin' or 'student'
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    college: String,
    yearOfStudy: String,
    fieldOfStudy: String
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

#### Events Collection
```javascript
{
  _id: ObjectId,
  uniqueId: String, // KAT-STEM-001 format
  title: String,
  description: String,
  date: Date,
  location: String,
  eventType: String, // 'workshop', 'bootcamp', 'webinar', 'conference'
  maxCapacity: Number,
  registrations: Number,
  status: String, // 'active', 'inactive', 'completed'
  adminId: ObjectId, // Reference to user who created the event
  createdAt: Date,
  updatedAt: Date
}
```

#### Registrations Collection
```javascript
{
  _id: ObjectId,
  trackingId: String, // STU-ABC123 format
  studentId: ObjectId, // Reference to user
  eventId: ObjectId, // Reference to event
  status: String, // 'registered', 'started', 'completed', 'rejected'
  registrationDate: Date,
  applicationData: {
    // Additional form data specific to the event
    documents: [String], // URLs to uploaded documents
    responses: Object // Custom form responses
  },
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Backend API Endpoints

### Authentication Routes

#### POST `/api/v1/auth/signup`
```javascript
// Request Body
{
  username: "johndoe",
  email: "john@example.com",
  password: "securepassword123",
  role: "student" // or "admin"
}

// Response (201 Created)
{
  success: true,
  message: "User created successfully",
  user: {
    _id: "user_id",
    username: "johndoe",
    email: "john@example.com",
    role: "student"
  }
}
```

#### POST `/api/v1/auth/login`
```javascript
// Request Body
{
  email: "john@example.com",
  password: "securepassword123"
}

// Response (200 OK)
{
  success: true,
  message: "Login successful",
  user: {
    _id: "user_id",
    username: "johndoe",
    email: "john@example.com",
    role: "student",
    token: "jwt_token_here"
  }
}
```

#### POST `/api/v1/auth/logout`
```javascript
// Request: Requires authentication header
// Response (200 OK)
{
  success: true,
  message: "Logged out successfully"
}
```

### Events Routes

#### GET `/api/v1/events`
```javascript
// Query Parameters
{
  status: "active", // optional
  eventType: "workshop", // optional
  page: 1, // optional, for pagination
  limit: 10 // optional, for pagination
}

// Response (200 OK)
{
  success: true,
  events: [
    {
      _id: "event_id",
      uniqueId: "KAT-STEM-001",
      title: "STEM Bootcamp",
      description: "3-day immersive bootcamp",
      date: "2025-03-15T00:00:00.000Z",
      location: "Mumbai, India",
      eventType: "bootcamp",
      maxCapacity: 50,
      registrations: 25,
      status: "active"
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    pages: 3
  }
}
```

#### POST `/api/v1/events`
```javascript
// Request Body (Admin only)
{
  title: "New Workshop",
  description: "Workshop description",
  date: "2025-04-15",
  location: "Delhi, India",
  eventType: "workshop",
  maxCapacity: 30
}

// Response (201 Created)
{
  success: true,
  message: "Event created successfully",
  event: {
    _id: "event_id",
    uniqueId: "KAT-WORK-002",
    // ... event data
  }
}
```

### Student Registration Routes

#### POST `/api/v1/events/:eventId/register`
```javascript
// Request Body
{
  studentId: "user_id",
  applicationData: {
    // Custom form data
    documents: ["url1", "url2"],
    responses: {
      question1: "answer1",
      question2: "answer2"
    }
  }
}

// Response (201 Created)
{
  success: true,
  message: "Registration successful",
  registration: {
    _id: "registration_id",
    trackingId: "STU-ABC123",
    status: "registered"
  }
}
```

#### GET `/api/v1/students/track/:trackingId`
```javascript
// Response (200 OK)
{
  success: true,
  registration: {
    _id: "registration_id",
    trackingId: "STU-ABC123",
    status: "registered",
    student: {
      username: "johndoe",
      email: "john@example.com"
    },
    event: {
      title: "STEM Bootcamp",
      date: "2025-03-15T00:00:00.000Z"
    },
    registrationDate: "2025-01-15T00:00:00.000Z"
  }
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user_id",
    email: "user@example.com",
    role: "student",
    iat: 1642234567,
    exp: 1642320967
  }
}
```

### Protected Route Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

## 🗃️ MongoDB Connection

### Environment Variables
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/katalyst_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
COOKIE_SECRET=your_cookie_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Connection Setup
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});
```

## 📊 Data Migration from Frontend

### Current Frontend Data Structure
The frontend currently uses localStorage with this structure:
- `katalyst_events`: Array of event objects
- `katalyst_leads`: Array of student registration objects

### Migration Script
```javascript
// migration.js
const migrateFromLocalStorage = async () => {
  // This would be run once to migrate existing data
  const events = JSON.parse(localStorage.getItem('katalyst_events') || '[]');
  const leads = JSON.parse(localStorage.getItem('katalyst_leads') || '[]');
  
  // Migrate events
  for (const event of events) {
    await Event.create({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      location: event.location,
      eventType: event.eventType,
      maxCapacity: event.maxCapacity,
      registrations: event.registrations,
      status: event.status,
      uniqueId: event.uniqueId
    });
  }
  
  // Migrate leads
  for (const lead of leads) {
    await Registration.create({
      trackingId: lead.trackingId,
      studentId: lead.id, // You'll need to create user accounts first
      eventId: lead.eventId,
      status: lead.status,
      registrationDate: new Date(lead.registrationDate)
    });
  }
};
```

## 🚀 Deployment Checklist

### Backend Deployment
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables
- [ ] Set up JWT secrets
- [ ] Configure CORS for frontend domain
- [ ] Set up Google OAuth credentials
- [ ] Test all API endpoints
- [ ] Set up monitoring and logging

### Frontend Updates
- [ ] Update API base URLs for production
- [ ] Test authentication flow
- [ ] Verify all API integrations
- [ ] Test error handling
- [ ] Update environment configuration

### Security Considerations
- [ ] HTTPS enabled
- [ ] JWT tokens properly secured
- [ ] Password hashing with bcrypt
- [ ] Input validation and sanitization
- [ ] Rate limiting implemented
- [ ] CORS properly configured

## 🔍 Testing the Integration

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Test Authentication
```bash
# Test signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","role":"student"}'

# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend Integration
- Open frontend in browser
- Navigate to `/signup`
- Create a new account
- Sign in with credentials
- Verify navigation and authentication state

## 📝 Next Steps

1. **Set up MongoDB Atlas cluster** using the provided connection string
2. **Create backend server** with Express.js and MongoDB
3. **Implement authentication middleware** with JWT
4. **Create API endpoints** for all CRUD operations
5. **Test integration** between frontend and backend
6. **Deploy to production** environment

## 🆘 Troubleshooting

### Common Issues

**CORS Errors**: Ensure backend CORS is configured for frontend domain
**Authentication Failures**: Check JWT secret and token expiration
**Database Connection**: Verify MongoDB URI and network access
**API Endpoints**: Ensure all routes are properly defined and protected

### Debug Mode
Enable debug logging in backend:
```javascript
process.env.DEBUG = 'app:*';
```

For more detailed assistance, check the backend server logs and browser console for specific error messages.
