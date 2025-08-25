import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  EventID: { type: Number, required: true, unique: true },
  AdminID: { type: Number, required: true }, //admin object id
  Title: { type: String, required: true },
  Description: { type: String },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  Location: { type: String },
  CreatedAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

export default Event