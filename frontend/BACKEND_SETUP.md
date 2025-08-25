# 🚀 Quick Backend Setup for Katalyst

This is a quick guide to set up a basic backend server for testing the authentication system.

## 📁 Create Backend Directory

```bash
# From the Team-23 root directory
mkdir backend
cd backend
npm init -y
```

## 📦 Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

## 🔧 Basic Server Setup

Create `server.js` in the backend directory:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/v1/auth/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'student'
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/v1/auth/logout', (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🌍 Environment Variables

Create `.env` file in the backend directory:

```bash
MONGODB_URI=mongodb+srv://siddheshkadane:Mz3Q4NMAumjrz2Gr@cluster001.jt56vax.mongodb.net/katalyst_db?retryWrites=true&w=majority&appName=Cluster001
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

## 🚀 Start the Server

```bash
# Add this to package.json scripts
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# Then run
npm run dev
```

## 🧪 Test the Setup

1. **Test Backend Connection:**
   ```bash
   curl http://localhost:3000/api/test
   ```

2. **Test Signup:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"testadmin","email":"admin@katalyst.com","password":"admin123","role":"admin"}'
   ```

3. **Test Login:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@katalyst.com","password":"admin123"}'
   ```

## 🔗 Frontend Integration

Your frontend is already configured to work with this backend. The authentication system will:

- Allow users to sign up with role selection
- Authenticate users and store JWT tokens
- Show different navigation based on user role
- Protect admin routes
- Handle logout and session management

## 📝 Next Steps

1. **Test the basic setup** with the commands above
2. **Add more API endpoints** for events and registrations
3. **Implement proper error handling** and validation
4. **Add Google OAuth** integration
5. **Set up production deployment**

## 🆘 Troubleshooting

- **MongoDB Connection Error**: Check your connection string and network access
- **CORS Issues**: Ensure the frontend URL is correct in the CORS configuration
- **JWT Errors**: Verify the JWT_SECRET is set in your .env file
- **Port Conflicts**: Change PORT in .env if 3000 is already in use

The backend is now ready to handle authentication for your Katalyst system! 🎉
