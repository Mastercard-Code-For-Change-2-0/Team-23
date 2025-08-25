import mongoose from 'mongoose';

const eventApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['applied', 'accepted', 'rejected'], 
    default: 'applied' 
  }
});

// Ensure a user can only apply once per event
eventApplicationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const EventApplication = mongoose.model('EventApplication', eventApplicationSchema);

export default EventApplication;
