import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  AdminID: { type: Number, required: true }, //admin object id
  Title: { type: String, required: true },
  Description: { type: String },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  Location: { type: String },
  CreatedAt: { type: Date, default: Date.now }
});

const User_Event = mongoose.model('Event', eventSchema);

export default User_Event