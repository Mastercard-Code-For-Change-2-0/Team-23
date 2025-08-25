const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  InterestID: { type: Number, required: true, unique: true },
  StudentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  EventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  CreatedAt: { type: Date, default: Date.now }
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;