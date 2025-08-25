import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import Event from '../models/events.model.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = new Admin({
      username: 'Admin User',
      email: 'admin@katalyst.org',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user: admin@katalyst.org / admin123');

    // Create regular user
    const user = new User({
      username: 'Jane Student',
      email: 'student@example.com',
      password: 'student123'
    });
    await user.save();
    console.log('Created test user: student@example.com / student123');

    // Create sample events
    const events = [
      {
        EventID: 1001,
        AdminID: 1,
        Title: 'Women in Tech Workshop',
        Description: 'A comprehensive workshop covering latest trends in technology, career guidance, and networking opportunities for women in the tech industry.',
        StartDate: new Date('2025-09-15T10:00:00'),
        EndDate: new Date('2025-09-15T16:00:00'),
        Location: 'Mumbai Tech Hub, Bandra'
      },
      {
        EventID: 1002,
        AdminID: 1,
        Title: 'Financial Literacy Seminar',
        Description: 'Learn essential financial planning skills, investment strategies, and how to build wealth as a young professional.',
        StartDate: new Date('2025-09-22T14:00:00'),
        EndDate: new Date('2025-09-22T18:00:00'),
        Location: 'Katalyst Community Center, Pune'
      },
      {
        EventID: 1003,
        AdminID: 1,
        Title: 'Leadership Development Program',
        Description: 'A 3-day intensive program designed to develop leadership skills, communication abilities, and professional networking.',
        StartDate: new Date('2025-10-05T09:00:00'),
        EndDate: new Date('2025-10-07T17:00:00'),
        Location: 'Delhi Convention Center'
      },
      {
        EventID: 1004,
        AdminID: 1,
        Title: 'Digital Marketing Masterclass',
        Description: 'Learn digital marketing strategies, social media management, and online business development techniques.',
        StartDate: new Date('2025-10-12T11:00:00'),
        EndDate: new Date('2025-10-12T15:00:00'),
        Location: 'Virtual Event (Online)'
      },
      {
        EventID: 1005,
        AdminID: 1,
        Title: 'Entrepreneurship Bootcamp',
        Description: 'Turn your business ideas into reality with guidance from successful entrepreneurs and industry experts.',
        StartDate: new Date('2025-10-20T10:00:00'),
        EndDate: new Date('2025-10-21T16:00:00'),
        Location: 'Bangalore Startup Hub'
      }
    ];

    await Event.insertMany(events);
    console.log('Created sample events');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin Credentials:');
    console.log('🔑 Admin: admin@katalyst.org / admin123');
    console.log('👤 Student: student@example.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
