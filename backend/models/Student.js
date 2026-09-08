const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  roll_no: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^NMCA/
  },
  name: { type: String, required: true, trim: true },
  class: { type: String, trim: true, uppercase: true },
  dob: { type: Date, default: null },
  email: {
    type: String,
    trim: true,
    default: '',
    match: [/^$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email']
  },
  phone: {
    type: String,
    default: '',
    match: [/^$|^[0-9]{10}$/, 'Phone number must have exactly 10 digits']
  },
  semester1: { type: Number, min: 0, max: 100, default: null },
  semester2: { type: Number, min: 0, max: 100, default: null },
  semester3: { type: Number, min: 0, max: 100, default: null },
  semester4: { type: Number, min: 0, max: 100, default: null },
  percentage: { type: Number, min: 0, max: 100, default: null },
  image_path: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
