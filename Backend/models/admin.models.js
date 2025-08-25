const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  AdminID: { type: Number, required: true, unique: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: { type: String, default: "admin" },
  CreatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;