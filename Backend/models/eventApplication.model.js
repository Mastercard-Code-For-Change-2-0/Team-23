import mongoose from 'mongoose';

const eventApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  // Student Registration Information
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  yearOfStudy: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post Graduate']
  },
  fieldOfStudy: {
    type: String,
    required: true,
    enum: ['Computer Engineering', 'IT', 'EnTC', 'Other']
  },
  otherFieldOfStudy: {
    type: String,
    trim: true,
    required: function() {
      return this.fieldOfStudy === 'Other';
    }
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['applied', 'accepted', 'rejected','interested'], 
    default: 'applied' 
  }
});

// Ensure a user can only apply once per event
eventApplicationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const EventApplication = mongoose.model('EventApplication', eventApplicationSchema);

export default EventApplication;
